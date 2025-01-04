const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../utils/uploadImage');

// Get all creations with filters
const getCreations = async (req, res) => {
  try {
    const { category, search, status = 'published' } = req.query;
    const userId = req.user?.id;
    
    const filters = {
      status,
      AND: []
    };

    if (category) {
      filters.category = category;
    }

    if (search) {
      filters.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ]
      });
    }

    const creations = await prisma.creation.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        },
        creationLikes: userId ? {
          where: {
            userId,
            commentId: null
          }
        } : false,
        _count: {
          select: {
            comments: true,
            creationLikes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format response to include like status
    const formattedCreations = creations.map(creation => ({
      ...creation,
      liked: creation.creationLikes?.length > 0,
      likeCount: creation._count.creationLikes
    }));

    // Remove raw likes data
    formattedCreations.forEach(creation => {
      delete creation.creationLikes;
    });

    res.json(formattedCreations);
  } catch (error) {
    console.error('Error getting creations:', error);
    res.status(500).json({ error: 'Failed to get creations' });
  }
};

// Get single creation by ID
const getCreationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const creation = await prisma.creation.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        },
        comments: {
          where: {
            parentId: null // Only get top-level comments
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                rank: true
              }
            },
            likes: userId ? {
              where: {
                userId: parseInt(userId)
              }
            } : false,
            _count: {
              select: {
                likes: true,
                replies: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    rank: true
                  }
                },
                likes: userId ? {
                  where: {
                    userId: parseInt(userId)
                  }
                } : false,
                _count: {
                  select: {
                    likes: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        creationLikes: userId ? {
          where: {
            userId: parseInt(userId)
          }
        } : false,
        _count: {
          select: {
            creationLikes: true
          }
        }
      }
    });

    if (!creation) {
      return res.status(404).json({ error: 'Creation not found' });
    }

    // Increment view count
    await prisma.creation.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });

    // Format comments to include like status
    const formattedComments = creation.comments.map(comment => ({
      ...comment,
      isLiked: comment.likes?.length > 0,
      likeCount: comment._count.likes,
      replies: comment.replies.map(reply => ({
        ...reply,
        isLiked: reply.likes?.length > 0,
        likeCount: reply._count.likes
      }))
    }));

    // Remove raw likes data from comments
    formattedComments.forEach(comment => {
      delete comment.likes;
      comment.replies.forEach(reply => {
        delete reply.likes;
      });
    });

    // Format response with creation like status
    const response = {
      ...creation,
      liked: creation.creationLikes?.length > 0,
      likeCount: creation._count.creationLikes,
      comments: formattedComments
    };

    // Remove raw likes data
    delete response.creationLikes;
    delete response._count;

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error getting creation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get creation' 
    });
  }
};

// Create new creation
const createCreation = async (req, res) => {
  try {
    const { title, description, category, tags, image, fileUrl } = req.body;
    const userId = req.user.id;

    // Upload image to Cloudinary if provided
    let cloudinaryImageUrl = null;
    if (image) {
      try {
        cloudinaryImageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const creation = await prisma.creation.create({
      data: {
        title,
        description,
        category,
        tags,
        image: cloudinaryImageUrl,
        fileUrl,
        author: req.user.name,
        userId
      }
    });

    res.status(201).json(creation);
  } catch (error) {
    console.error('Error creating creation:', error);
    res.status(500).json({ error: 'Failed to create creation' });
  }
};

// Update creation
const updateCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, image, fileUrl, status } = req.body;
    const userId = req.user.id;

    // Check ownership
    const existing = await prisma.creation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Creation not found' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this creation' });
    }

    // Upload new image to Cloudinary if provided
    let cloudinaryImageUrl = existing.image;
    if (image && image !== existing.image) {
      try {
        cloudinaryImageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const creation = await prisma.creation.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        category,
        tags,
        image: cloudinaryImageUrl,
        fileUrl,
        status
      }
    });

    res.json(creation);
  } catch (error) {
    console.error('Error updating creation:', error);
    res.status(500).json({ error: 'Failed to update creation' });
  }
};

// Delete creation
const deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const existing = await prisma.creation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Creation not found' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this creation' });
    }

    // Delete related comments and likes first
    await prisma.$transaction([
      prisma.creationComment.deleteMany({
        where: { creationId: parseInt(id) }
      }),
      prisma.creationLike.deleteMany({
        where: { creationId: parseInt(id) }
      }),
      prisma.creation.delete({
        where: { id: parseInt(id) }
      })
    ]);

    res.json({ message: 'Creation deleted successfully' });
  } catch (error) {
    console.error('Error deleting creation:', error);
    res.status(500).json({ error: 'Failed to delete creation' });
  }
};

// Toggle like on creation
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Check if like exists
    const existingLike = await prisma.creationLike.findFirst({
      where: {
        userId: parseInt(userId),
        creationId: parseInt(id)
      }
    });

    // If like exists, delete it (unlike)
    if (existingLike) {
      await prisma.creationLike.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // If no like exists, create it (like)
      await prisma.creationLike.create({
        data: {
          userId: parseInt(userId),
          creationId: parseInt(id)
        }
      });
    }

    // Get updated like count and status
    const updatedCreation = await prisma.creation.findUnique({
      where: { 
        id: parseInt(id) 
      },
      include: {
        creationLikes: {
          where: {
            userId: parseInt(userId)
          }
        },
        _count: {
          select: {
            creationLikes: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        liked: !existingLike,
        likeCount: updatedCreation._count.creationLikes
      }
    });
  } catch (error) {
    console.error('Error in toggleLike:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle like'
    });
  }
};

// Like/Unlike comment
const toggleCommentLike = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;

    // Check if comment exists and get its creation ID
    const comment = await prisma.creationComment.findUnique({
      where: { id: parseInt(commentId) },
      select: {
        id: true,
        creationId: true
      }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const existingLike = await prisma.creationLike.findFirst({
      where: {
        userId,
        creationId: comment.creationId,
        commentId: parseInt(commentId)
      }
    });

    let liked = false;

    if (existingLike) {
      // Unlike
      await prisma.creationLike.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      // Like
      await prisma.creationLike.create({
        data: {
          userId,
          creationId: comment.creationId,
          commentId: parseInt(commentId)
        }
      });
      liked = true;
    }

    // Get updated like count
    const likeCount = await prisma.creationLike.count({
      where: {
        commentId: parseInt(commentId)
      }
    });

    res.json({ liked, likeCount });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ error: 'Failed to toggle comment like' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    // Check if creation exists
    const creation = await prisma.creation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!creation) {
      return res.status(404).json({ error: 'Creation not found' });
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.creationComment.findUnique({
        where: { id: parseInt(parentId) }
      });

      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    // Create comment
    const comment = await prisma.creationComment.create({
      data: {
        content,
        userId,
        creationId: parseInt(id),
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;

    const comment = await prisma.creationComment.findUnique({
      where: { id: parseInt(commentId) }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.creationComment.delete({
      where: { id: parseInt(commentId) }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Get comments for a creation
const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if creation exists
    const creation = await prisma.creation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!creation) {
      return res.status(404).json({ error: 'Creation not found' });
    }

    // Get top-level comments with replies
    const comments = await prisma.creationComment.findMany({
      where: {
        creationId: parseInt(id),
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            likes: userId ? {
              where: { userId }
            } : false,
            _count: {
              select: {
                likes: true,
                replies: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        likes: userId ? {
          where: { userId }
        } : false,
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format comments to include like status
    const formattedComments = comments.map(comment => ({
      ...comment,
      liked: comment.likes?.length > 0,
      likeCount: comment._count.likes,
      replies: comment.replies.map(reply => ({
        ...reply,
        liked: reply.likes?.length > 0,
        likeCount: reply._count.likes
      }))
    }));

    // Remove raw likes data
    formattedComments.forEach(comment => {
      delete comment.likes;
      comment.replies.forEach(reply => {
        delete reply.likes;
      });
    });

    res.json(formattedComments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

module.exports = {
  getCreations,
  getCreationById,
  createCreation,
  updateCreation,
  deleteCreation,
  toggleLike,
  toggleCommentLike,
  addComment,
  deleteComment,
  getComments
}; 