const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const replyController = {
  addReply: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Get parent comment to get creationId
      const parentComment = await prisma.creationComment.findUnique({
        where: { id: parseInt(commentId) },
        select: { creationId: true }
      });

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          error: 'Parent comment not found'
        });
      }

      // Create reply
      const reply = await prisma.creationComment.create({
        data: {
          content,
          userId: parseInt(userId),
          creationId: parentComment.creationId,
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
          likes: {
            where: {
              userId: parseInt(userId)
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

      // Format response
      const formattedReply = {
        ...reply,
        isLiked: reply.likes.length > 0,
        likeCount: reply._count.likes,
        replyCount: reply._count.replies
      };
      delete formattedReply.likes;

      res.json({
        success: true,
        data: formattedReply
      });
    } catch (error) {
      console.error('Error in addReply:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add reply'
      });
    }
  },

  getReplies: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Get all replies for a comment
      const replies = await prisma.creationComment.findMany({
        where: {
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
          likes: {
            where: {
              userId: parseInt(userId)
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Format replies
      const formattedReplies = replies.map(reply => {
        const formatted = {
          ...reply,
          isLiked: reply.likes.length > 0,
          likeCount: reply._count.likes,
          replyCount: reply._count.replies
        };
        delete formatted.likes;
        return formatted;
      });

      res.json({
        success: true,
        data: formattedReplies
      });
    } catch (error) {
      console.error('Error in getReplies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get replies'
      });
    }
  },

  deleteReply: async (req, res) => {
    try {
      const { replyId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Check if reply exists and belongs to user
      const reply = await prisma.creationComment.findUnique({
        where: { id: parseInt(replyId) }
      });

      if (!reply) {
        return res.status(404).json({
          success: false,
          error: 'Reply not found'
        });
      }

      if (reply.userId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this reply'
        });
      }

      // Delete reply
      await prisma.creationComment.delete({
        where: { id: parseInt(replyId) }
      });

      res.json({
        success: true,
        message: 'Reply deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteReply:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete reply'
      });
    }
  }
};

module.exports = replyController; 