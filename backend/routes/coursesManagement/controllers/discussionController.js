const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const discussionController = {
  // Get discussions for a material
  getMaterialDiscussions: async (req, res) => {
    try {
      const { materialId } = req.params;
      const { page = 1, limit = 10, filter } = req.query;
      const skip = (page - 1) * parseInt(limit);

      // Build where clause
      const where = {
        materialId: parseInt(materialId),
        ...(filter === 'resolved' ? { isResolved: true } : 
           filter === 'unresolved' ? { isResolved: false } : {})
      };

      // Get discussions with replies count and likes count
      const discussions = await prisma.discussion.findMany({
        where,
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
              replies: true,
              likes: true
            }
          },
          resolvedReply: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip
      });

      // Get total count
      const total = await prisma.discussion.count({ where });

      res.json({
        success: true,
        data: {
          discussions,
          meta: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error in getMaterialDiscussions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get discussions',
        message: error.message
      });
    }
  },

  // Create new discussion
  createDiscussion: async (req, res) => {
    try {
      const { materialId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // dari middleware auth

      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      const discussion = await prisma.discussion.create({
        data: {
          content: content.trim(),
          userId,
          materialId: parseInt(materialId)
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
              replies: true,
              likes: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: discussion,
        message: 'Discussion created successfully'
      });
    } catch (error) {
      console.error('Error in createDiscussion:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create discussion',
        message: error.message
      });
    }
  },

  // Get single discussion with replies
  getDiscussion: async (req, res) => {
    try {
      const { id } = req.params;

      const discussion = await prisma.discussion.findUnique({
        where: { id: parseInt(id) },
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
              _count: {
                select: {
                  likes: true,
                  children: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          resolvedReply: {
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
              likes: true
            }
          }
        }
      });

      if (!discussion) {
        return res.status(404).json({
          success: false,
          error: 'Discussion not found'
        });
      }

      res.json({
        success: true,
        data: discussion
      });
    } catch (error) {
      console.error('Error in getDiscussion:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get discussion',
        message: error.message
      });
    }
  },

  // Add reply to discussion
  addReply: async (req, res) => {
    try {
      const { discussionId } = req.params;
      const { content, parentId } = req.body;
      const userId = req.user.id; // dari middleware auth

      const reply = await prisma.reply.create({
        data: {
          content,
          userId,
          discussionId: parseInt(discussionId),
          parentId: parentId ? parseInt(parentId) : null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              rank: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: reply,
        message: 'Reply added successfully'
      });
    } catch (error) {
      console.error('Error in addReply:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add reply',
        message: error.message
      });
    }
  },

  // Mark reply as resolved
  resolveDiscussion: async (req, res) => {
    try {
      const { discussionId, replyId } = req.params;
      const { pointAmount } = req.body;
      const userId = req.user.id;

      // Validate point amount
      if (!pointAmount || pointAmount < 10 || pointAmount > 50) {
        return res.status(400).json({
          success: false,
          error: 'Point amount must be between 10 and 50'
        });
      }

      // Get discussion
      const discussion = await prisma.discussion.findUnique({
        where: { id: parseInt(discussionId) },
        include: {
          resolvedReply: true
        }
      });

      // Validations
      if (!discussion) {
        return res.status(404).json({
          success: false,
          error: 'Discussion not found'
        });
      }

      if (discussion.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Only discussion creator can mark as resolved'
        });
      }

      if (discussion.isResolved) {
        return res.status(400).json({
          success: false,
          error: 'Discussion is already resolved'
        });
      }

      // Get reply
      const reply = await prisma.reply.findUnique({
        where: { id: parseInt(replyId) },
        include: {
          user: true
        }
      });

      if (!reply) {
        return res.status(404).json({
          success: false,
          error: 'Reply not found'
        });
      }

      if (reply.discussionId !== parseInt(discussionId)) {
        return res.status(400).json({
          success: false,
          error: 'Reply does not belong to this discussion'
        });
      }

      // Start transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Update discussion
        const updatedDiscussion = await prisma.discussion.update({
          where: { id: parseInt(discussionId) },
          data: {
            isResolved: true,
            resolvedReplyId: parseInt(replyId),
            pointAwarded: pointAmount
          },
          include: {
            resolvedReply: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    rank: true
                  }
                }
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                rank: true
              }
            }
          }
        });

        // Update reply
        await prisma.reply.update({
          where: { id: parseInt(replyId) },
          data: {
            isResolved: true,
            pointReceived: pointAmount
          }
        });

        // Add points to user who answered
        await prisma.user.update({
          where: { id: reply.userId },
          data: {
            totalPoints: {
              increment: pointAmount
            }
          }
        });

        // Create point record
        await prisma.point.create({
          data: {
            userId: reply.userId,
            value: pointAmount,
            materialId: discussion.materialId,
            categoryId: 1, // Get from material
            subcategoryId: 1 // Get from material
          }
        });

        // Create notification for user who answered
        await prisma.notification.create({
          data: {
            userId: reply.userId,
            type: 'DISCUSSION_RESOLVED',
            message: `Your answer was marked as correct! You received ${pointAmount} points.`,
            data: {
              discussionId: parseInt(discussionId),
              replyId: parseInt(replyId),
              pointAmount
            }
          }
        });

        return updatedDiscussion;
      });

      res.json({
        success: true,
        data: result,
        message: 'Discussion marked as resolved'
      });
    } catch (error) {
      console.error('Error in resolveDiscussion:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve discussion',
        message: error.message
      });
    }
  },

  // Like/unlike discussion or reply
  toggleLike: async (req, res) => {
    try {
      const { type, id } = req.params; // type: 'discussion' or 'reply'
      const userId = req.user.id; // dari middleware auth

      const where = {
        userId,
        ...(type === 'discussion' ? { discussionId: parseInt(id) } : { replyId: parseInt(id) })
      };

      // Check if like exists
      const existingLike = await prisma.like.findFirst({ where });

      if (existingLike) {
        // Unlike
        await prisma.like.delete({
          where: { id: existingLike.id }
        });

        res.json({
          success: true,
          message: `${type} unliked successfully`
        });
      } else {
        // Like
        await prisma.like.create({
          data: where
        });

        res.json({
          success: true,
          message: `${type} liked successfully`
        });
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle like',
        message: error.message
      });
    }
  }
};

module.exports = discussionController; 