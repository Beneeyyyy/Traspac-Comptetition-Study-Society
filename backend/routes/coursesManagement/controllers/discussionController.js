const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const discussionController = {
  // Get discussions for a material
  getMaterialDiscussions: async (req, res) => {
    try {
      const { materialId } = req.params;
      const { page = 1, limit = 10, filter } = req.query;
      const userId = req.user?.id;
      const skip = (page - 1) * parseInt(limit);

      console.log('=== getMaterialDiscussions START ===');
      console.log('User ID:', userId);
      console.log('User object:', req.user);
      console.log('Material ID:', materialId);

      if (!userId) {
        console.log('No user ID found in request');
      }

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
          },
          likes: userId ? {
            where: {
              userId: parseInt(userId)
            }
          } : undefined
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip
      });

      console.log('Raw discussions:', discussions.map(d => ({
        id: d.id,
        likes: d.likes,
        likesCount: d._count.likes,
        userId: userId
      })));

      // Add isLiked field and format response
      const discussionsWithLikes = discussions.map(discussion => {
        // Remove likes array after checking
        const isLiked = discussion.likes?.length > 0;
        const { likes, ...discussionWithoutLikes } = discussion;
        
        console.log(`Discussion ${discussion.id}:`, {
          hasLikes: !!discussion.likes,
          likesLength: discussion.likes?.length,
          isLiked,
          likesCount: discussion._count.likes,
          userId: userId
        });

        return {
          ...discussionWithoutLikes,
          isLiked
        };
      });

      console.log('Processed discussions:', discussionsWithLikes.map(d => ({
        id: d.id,
        isLiked: d.isLiked,
        likesCount: d._count.likes,
        userId: userId
      })));

      // Get total count
      const total = await prisma.discussion.count({ where });

      res.json({
        success: true,
        data: {
          discussions: discussionsWithLikes,
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
      console.log('=== RESOLVE DISCUSSION START ===');
      const { discussionId, replyId } = req.params;
      const { pointAmount } = req.body;
      const userId = parseInt(req.user.id);

      console.log('Request data:', {
        discussionId: parseInt(discussionId),
        replyId: parseInt(replyId),
        pointAmount,
        userId
      });

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

      console.log('Found discussion:', {
        id: discussion?.id,
        userId: discussion?.userId,
        requestUserId: userId,
        isCreator: discussion?.userId === userId
      });

      if (!discussion) {
        return res.status(404).json({
          error: 'Discussion not found'
        });
      }

      // Check if user is the discussion creator
      if (parseInt(discussion.userId) !== userId) {
        console.log('Permission denied:', {
          discussionUserId: parseInt(discussion.userId),
          requestUserId: userId,
          isMatch: parseInt(discussion.userId) === userId
        });
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

      console.log('Found reply:', reply);

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
            totalPoints: {
              increment: pointAmount
            }
          }
        })
      ]);

      console.log('Updated discussion:', updatedDiscussion);
      console.log('=== RESOLVE DISCUSSION END ===');

      res.json({
        message: 'Discussion resolved successfully',
        data: updatedDiscussion
      });
    } catch (error) {
      console.error('=== RESOLVE DISCUSSION ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== END ERROR ===');
      res.status(500).json({
        error: 'Failed to resolve discussion',
        message: error.message
      });
    }
  },

  // Like/unlike discussion or reply
  toggleLike: async (req, res) => {
    try {
      const { type, id } = req.params; // type: 'discussion' or 'reply'
      const userId = req.user?.id;

      console.log('=== toggleLike START ===');
      console.log('User ID:', userId);
      console.log('User object:', req.user);
      console.log('Type:', type);
      console.log('ID:', id);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const where = {
        userId: parseInt(userId),
        ...(type === 'discussion' ? { discussionId: parseInt(id) } : { replyId: parseInt(id) })
      };

      console.log('Looking for existing like with:', where);

      // Check if like exists
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: parseInt(userId),
          ...(type === 'discussion' ? { discussionId: parseInt(id) } : { replyId: parseInt(id) })
        }
      });

      console.log('Existing like:', existingLike);

      if (existingLike) {
        // Unlike
        console.log('Deleting like:', existingLike.id);
        await prisma.like.delete({
          where: { id: existingLike.id }
        });
      } else {
        // Like
        console.log('Creating new like with:', where);
        await prisma.like.create({
          data: where
        });
      }

      // Get updated discussion data
      const updatedDiscussion = await prisma.discussion.findUnique({
        where: {
          id: parseInt(id)
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
          },
          likes: {
            where: {
              userId: parseInt(userId)
            }
          }
        }
      });

      console.log('Updated discussion:', {
        id: updatedDiscussion.id,
        likes: updatedDiscussion.likes,
        likesCount: updatedDiscussion._count.likes
      });

      // Add isLiked field and format response
      const formattedDiscussion = {
        ...updatedDiscussion,
        isLiked: updatedDiscussion.likes?.length > 0,
        likeCount: updatedDiscussion._count.likes
      };
      delete formattedDiscussion.likes;

      console.log('Formatted discussion:', {
        id: formattedDiscussion.id,
        isLiked: formattedDiscussion.isLiked,
        likeCount: formattedDiscussion.likeCount
      });

      res.json({
        success: true,
        message: existingLike ? `${type} unliked successfully` : `${type} liked successfully`,
        data: formattedDiscussion
      });
    } catch (error) {
      console.error('Error in toggleLike:', error);
      
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        // If duplicate, treat it as unlike
        try {
          const existingLike = await prisma.like.findFirst({
            where: {
              userId: parseInt(req.user?.id),
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