const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const commentController = {
  getComments: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Creation ID is required'
        });
      }

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
              image: true,
              rank: true
            }
          },
          likes: {
            where: userId ? {
              userId: parseInt(userId)
            } : undefined
          },
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
              likes: {
                where: userId ? {
                  userId: parseInt(userId)
                } : undefined
              },
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
      });

      // Format comments to include like status
      const formattedComments = comments.map(comment => ({
        ...comment,
        isLiked: comment.likes?.length > 0,
        likeCount: comment._count.likes,
        replies: comment.replies.map(reply => ({
          ...reply,
          isLiked: reply.likes?.length > 0,
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

      res.json({
        success: true,
        data: formattedComments
      });
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get comments'
      });
    }
  },

  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const comment = await prisma.creationComment.create({
        data: {
          content,
          userId: parseInt(userId),
          creationId: parseInt(id)
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
          _count: {
            select: {
              likes: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: {
          ...comment,
          isLiked: false,
          likeCount: 0,
          replies: []
        }
      });
    } catch (error) {
      console.error('Error in addComment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add comment'
      });
    }
  },

  addReply: async (req, res) => {
    try {
      const { id, commentId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const reply = await prisma.creationComment.create({
        data: {
          content,
          userId: parseInt(userId),
          creationId: parseInt(id),
          parentId: parseInt(commentId)
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
          _count: {
            select: {
              likes: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: {
          ...reply,
          isLiked: false,
          likeCount: 0
        }
      });
    } catch (error) {
      console.error('Error in addReply:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add reply'
      });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Check if like exists
      const existingLike = await prisma.creationCommentLike.findFirst({
        where: {
          userId: parseInt(userId),
          commentId: parseInt(commentId)
        }
      });

      // If like exists, delete it (unlike)
      if (existingLike) {
        await prisma.creationCommentLike.delete({
          where: {
            id: existingLike.id
          }
        });
      } 
      // If no like exists, create it (like)
      else {
        await prisma.creationCommentLike.create({
          data: {
            userId: parseInt(userId),
            commentId: parseInt(commentId)
          }
        });
      }

      // Get updated like count
      const likeCount = await prisma.creationCommentLike.count({
        where: {
          commentId: parseInt(commentId)
        }
      });

      res.json({
        success: true,
        data: {
          isLiked: !existingLike,
          likeCount
        }
      });
    } catch (error) {
      console.error('Error in toggleLike:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle like'
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const comment = await prisma.creationComment.findUnique({
        where: {
          id: parseInt(commentId)
        }
      });

      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comment not found'
        });
      }

      if (comment.userId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this comment'
        });
      }

      await prisma.creationComment.delete({
        where: {
          id: parseInt(commentId)
        }
      });

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteComment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete comment'
      });
    }
  },

  getReplies: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      const replies = await prisma.creationComment.findMany({
        where: {
          parentId: parseInt(commentId)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format replies to include like status
      const formattedReplies = replies.map(reply => ({
        ...reply,
        isLiked: reply.likes?.length > 0,
        likeCount: reply._count.likes
      }));

      // Remove raw likes data
      formattedReplies.forEach(reply => {
        delete reply.likes;
      });

      res.json({
        success: true,
        data: formattedReplies
      });
    } catch (error) {
      console.error('Error getting replies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get replies'
      });
    }
  }
};

module.exports = commentController; 