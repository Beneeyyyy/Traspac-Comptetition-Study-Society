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

  // Get single discussion
  getDiscussion: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const discussion = await prisma.discussion.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              rank: true,
              role: true
            }
          },
          resolvedReply: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rank: true,
                  role: true
                }
              }
            }
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rank: true,
                  role: true
                }
              },
              children: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      rank: true,
                      role: true
                    }
                  },
                  _count: {
                    select: {
                      likes: true,
                      children: true
                    }
                  },
                  likes: userId ? {
                    where: {
                      userId
                    }
                  } : false
                }
              },
              _count: {
                select: {
                  likes: true,
                  children: true
                }
              },
              likes: userId ? {
                where: {
                  userId
                }
              } : false
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          },
          likes: userId ? {
            where: {
              userId
            }
          } : false
        }
      });

      if (!discussion) {
        return res.status(404).json({
          success: false,
          error: 'Discussion not found'
        });
      }

      // Add isLiked field
      const discussionWithLikes = {
        ...discussion,
        isLiked: discussion.likes?.length > 0,
        replies: discussion.replies.map(reply => ({
          ...reply,
          isLiked: reply.likes?.length > 0,
          children: reply.children.map(child => ({
            ...child,
            isLiked: child.likes?.length > 0
          }))
        }))
      };

      // Remove likes array
      delete discussionWithLikes.likes;
      discussionWithLikes.replies.forEach(reply => {
        delete reply.likes;
        reply.children.forEach(child => {
          delete child.likes;
        });
      });

      res.json({
        success: true,
        data: discussionWithLikes
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
      console.log('=== ADD REPLY START ===');
      console.log('Request headers:', req.headers);
      console.log('Request body:', req.body);
      console.log('Request user:', req.user);
      console.log('Request params:', req.params);
      
      const { discussionId } = req.params;
      const { content, parentId } = req.body;
      const userId = req.user.id;

      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      const reply = await prisma.reply.create({
        data: {
          content: content.trim(),
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
              rank: true,
              role: true
            }
          }
        }
      });

      console.log('Reply created:', reply);
      console.log('=== ADD REPLY END ===');

      res.json({
        success: true,
        data: reply,
        message: 'Reply added successfully'
      });
    } catch (error) {
      console.error('=== ADD REPLY ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== END ERROR ===');
      
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

      // Validate point amount
      if (!pointAmount || pointAmount < 10 || pointAmount > 50) {
        return res.status(400).json({
          error: 'Point amount must be between 10 and 50'
        });
      }

      // Check if discussion exists and user is the creator
      const discussion = await prisma.discussion.findUnique({
        where: {
          id: parseInt(discussionId)
        },
        include: {
          user: true,
          resolvedReply: true
        }
      });

      if (!discussion) {
        return res.status(404).json({
          error: 'Discussion not found'
        });
      }

      // Check if user is the discussion creator
      if (discussion.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Only the discussion creator can resolve the discussion'
        });
      }

      // Check if discussion is already resolved
      if (discussion.isResolved) {
        return res.status(400).json({
          error: 'Discussion is already resolved'
        });
      }

      // Get reply
      const reply = await prisma.reply.findUnique({
        where: {
          id: parseInt(replyId)
        },
        include: {
          user: true
        }
      });

      if (!reply) {
        return res.status(404).json({
          error: 'Reply not found'
        });
      }

      // Check if reply belongs to this discussion
      if (reply.discussionId !== parseInt(discussionId)) {
        return res.status(400).json({
          error: 'Reply does not belong to this discussion'
        });
      }

      // Update discussion and add points to reply creator
      const [updatedDiscussion, _] = await prisma.$transaction([
        prisma.discussion.update({
          where: {
            id: parseInt(discussionId)
          },
          data: {
            isResolved: true,
            resolvedReplyId: parseInt(replyId)
          },
          include: {
            user: true,
            resolvedReply: {
              include: {
                user: true
              }
            },
            replies: {
              include: {
                user: true,
                children: {
                  include: {
                    user: true,
                    _count: {
                      select: {
                        likes: true,
                        children: true
                      }
                    }
                  }
                },
                _count: {
                  select: {
                    likes: true,
                    children: true
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
        }),
        prisma.user.update({
          where: {
            id: reply.userId
          },
          data: {
            points: {
              increment: pointAmount
            }
          }
        })
      ]);

      res.json({
        message: 'Discussion resolved successfully',
        data: updatedDiscussion
      });
    } catch (error) {
      console.error('Error resolving discussion:', error);
      res.status(500).json({
        error: 'Failed to resolve discussion'
      });
    }
  },

  // Like/unlike discussion or reply
  toggleLike: async (req, res) => {
    try {
      const { type, id } = req.params; // type: 'discussion' or 'reply'
      const userId = req.user.id;

      const where = {
        userId,
        ...(type === 'discussion' ? { discussionId: parseInt(id) } : { replyId: parseInt(id) })
      };

      // Check if like exists
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          ...(type === 'discussion' ? { discussionId: parseInt(id) } : { replyId: parseInt(id) })
        }
      });

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
      
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        // If duplicate, treat it as unlike
        try {
          const existingLike = await prisma.like.findFirst({
            where: {
              userId: req.user.id,
              ...(req.params.type === 'discussion' 
                ? { discussionId: parseInt(req.params.id) } 
                : { replyId: parseInt(req.params.id) })
            }
          });

          if (existingLike) {
            await prisma.like.delete({
              where: { id: existingLike.id }
            });

            return res.json({
              success: true,
              message: `${req.params.type} unliked successfully`
            });
          }
        } catch (retryError) {
          console.error('Error in retry:', retryError);
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to toggle like',
        message: error.message
      });
    }
  }
};

module.exports = discussionController; 