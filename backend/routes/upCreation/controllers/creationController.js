const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../utils/uploadImage');

// Get all creations with filters
const getCreations = async (req, res) => {
  try {
    const { category, search, status = 'published' } = req.query;
    
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

    res.json(creations);
  } catch (error) {
    console.error('Error getting creations:', error);
    res.status(500).json({ error: 'Failed to get creations' });
  }
};

// Get single creation by ID
const getCreationById = async (req, res) => {
  try {
    const { id } = req.params;
    
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
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

    res.json(creation);
  } catch (error) {
    console.error('Error getting creation:', error);
    res.status(500).json({ error: 'Failed to get creation' });
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

// Like/Unlike creation
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.creationLike.findUnique({
      where: {
        userId_creationId: {
          userId,
          creationId: parseInt(id)
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.creationLike.delete({
          where: {
            userId_creationId: {
              userId,
              creationId: parseInt(id)
            }
          }
        }),
        prisma.creation.update({
          where: { id: parseInt(id) },
          data: { likes: { decrement: 1 } }
        })
      ]);
    } else {
      // Like
      await prisma.$transaction([
        prisma.creationLike.create({
          data: {
            userId,
            creationId: parseInt(id)
          }
        }),
        prisma.creation.update({
          where: { id: parseInt(id) },
          data: { likes: { increment: 1 } }
        })
      ]);
    }

    res.json({ message: existingLike ? 'Creation unliked' : 'Creation liked' });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.creationComment.create({
      data: {
        content,
        userId,
        creationId: parseInt(id)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
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

module.exports = {
  getCreations,
  getCreationById,
  createCreation,
  updateCreation,
  deleteCreation,
  toggleLike,
  addComment,
  deleteComment
}; 