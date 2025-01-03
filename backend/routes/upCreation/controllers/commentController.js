const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const commentController = {
  getComments: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      console.log('=== getComments START ===');
      console.log('User ID:', userId);
      console.log('Creation ID:', id);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Get comments with replies and like status
      const comments = await prisma.creationComment.findMany({
        where: {
          creationId: parseInt(id),
          parentId: null
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
                where: {
                  userId: parseInt(userId)
                }
              },
              _count: {
                select: {
                  likes: true
                }
              }
            }
          },
          likes: {
            where: {
              userId: parseInt(userId)
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const formattedComments = comments.map(comment => ({
        ...comment,
        isLiked: comment.likes.length > 0,
        likeCount: comment._count.likes,
        replies: comment.replies.map(reply => ({
          ...reply,
          isLiked: reply.likes.length > 0,
          likeCount: reply._count.likes
        }))
      }));

      res.json({
        success: true,
        data: formattedComments
      });
    } catch (error) {
      console.error('Error in getComments:', error);
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

      // First get the comment to get its creationId
      const comment = await prisma.creationComment.findUnique({
        where: { id: parseInt(commentId) },
        select: { creationId: true }
      });

      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comment not found'
        });
      }

      // Delete any existing likes first
      await prisma.creationLike.deleteMany({
        where: {
          userId: parseInt(userId),
          creationId: comment.creationId,
          commentId: parseInt(commentId)
        }
      });

      const existingLike = await prisma.creationLike.findFirst({
        where: {
          userId: parseInt(userId),
          commentId: parseInt(commentId)
        }
      });

      if (existingLike) {
        await prisma.creationLike.delete({
          where: {
            id: existingLike.id
          }
        });
      } else {
        await prisma.creationLike.create({
          data: {
            userId: parseInt(userId),
            commentId: parseInt(commentId),
            creationId: comment.creationId
          }
        });
      }

      const updatedComment = await prisma.creationComment.findUnique({
        where: {
          id: parseInt(commentId)
        },
        include: {
          likes: {
            where: {
              userId: parseInt(userId)
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
          isLiked: !existingLike,
          likeCount: updatedComment._count.likes
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
  }
};

module.exports = commentController; 