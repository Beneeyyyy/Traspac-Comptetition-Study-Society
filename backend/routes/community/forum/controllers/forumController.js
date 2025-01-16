const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../../utils/uploadImage');

const forumController = {
  // Post Controllers
  getAllPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10, filter } = req.query;
      const skip = (page - 1) * parseInt(limit);
      const userId = req.user?.id;

      const posts = await prisma.forumPost.findMany({
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
              answers: true,
              comments: true,
              votes: true
            }
          },
          votes: {
            where: {
              userId: userId
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip
      });

      // Transform posts to include vote status
      const transformedPosts = posts.map(post => {
        const upvotes = post.votes.filter(vote => vote.isUpvote).length;
        const downvotes = post.votes.filter(vote => !vote.isUpvote).length;
        const userVote = post.votes[0]; // User can only have one vote

        const { votes, ...postWithoutVotes } = post;
        return {
          ...postWithoutVotes,
          score: upvotes - downvotes,
          userVote: userVote ? (userVote.isUpvote ? 'upvote' : 'downvote') : null
        };
      });

      const total = await prisma.forumPost.count();

      res.json({
        success: true,
        data: {
          posts: transformedPosts,
          meta: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get posts'
      });
    }
  },

  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const post = await prisma.forumPost.findUnique({
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
          answers: {
            orderBy: {
              createdAt: 'desc'
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
              votes: true,
              comments: {
                orderBy: {
                  createdAt: 'asc'
                },
                where: {
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
                  votes: {
                    where: userId ? {
                      userId: userId
                    } : undefined
                  },
                  replies: {
                    orderBy: {
                      createdAt: 'asc'
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
                      votes: {
                        where: userId ? {
                          userId: userId
                        } : undefined
                      },
                      replies: {
                        orderBy: {
                          createdAt: 'asc'
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
                          votes: {
                            where: userId ? {
                              userId: userId
                            } : undefined
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          comments: {
            orderBy: {
              createdAt: 'asc'
            },
            where: {
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
              votes: {
                where: userId ? {
                  userId: userId
                } : undefined
              },
              replies: {
                orderBy: {
                  createdAt: 'asc'
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
                  votes: {
                    where: userId ? {
                      userId: userId
                    } : undefined
                  },
                  replies: {
                    orderBy: {
                      createdAt: 'asc'
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
                      votes: {
                        where: userId ? {
                          userId: userId
                        } : undefined
                      }
                    }
                  }
                }
              }
            }
          },
          votes: {
            where: userId ? {
              userId: userId
            } : undefined
          }
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // Transform post votes
      const postUpvotes = post.votes.filter(vote => vote.isUpvote).length;
      const postDownvotes = post.votes.filter(vote => !vote.isUpvote).length;
      const postUserVote = post.votes[0];

      // Transform answers with vote data
      const transformedAnswers = post.answers.map(answer => {
        const answerUpvotes = answer.votes.filter(vote => vote.isUpvote).length;
        const answerDownvotes = answer.votes.filter(vote => !vote.isUpvote).length;
        const answerUserVote = answer.votes.find(vote => vote.userId === userId);

        // Transform comments with vote data
        const transformedComments = answer.comments.map(comment => {
          const commentUpvotes = comment.votes.filter(vote => vote.isUpvote).length;
          const commentDownvotes = comment.votes.filter(vote => !vote.isUpvote).length;
          const commentUserVote = comment.votes[0];

          const { votes: commentVotes, ...commentWithoutVotes } = comment;
          return {
            ...commentWithoutVotes,
            score: commentUpvotes - commentDownvotes,
            userVote: commentUserVote ? (commentUserVote.isUpvote ? 'upvote' : 'downvote') : null
          };
        });

        const { votes: answerVotes, comments, ...answerWithoutVotes } = answer;
        return {
          ...answerWithoutVotes,
          score: answerUpvotes - answerDownvotes,
          userVote: answerUserVote ? (answerUserVote.isUpvote ? 'upvote' : 'downvote') : null,
          comments: transformedComments
        };
      });

      // Transform comments with vote data
      const transformedComments = post.comments.map(comment => {
        const commentUpvotes = comment.votes.filter(vote => vote.isUpvote).length;
        const commentDownvotes = comment.votes.filter(vote => !vote.isUpvote).length;
        const commentUserVote = comment.votes[0];

        const { votes: commentVotes, ...commentWithoutVotes } = comment;
        return {
          ...commentWithoutVotes,
          score: commentUpvotes - commentDownvotes,
          userVote: commentUserVote ? (commentUserVote.isUpvote ? 'upvote' : 'downvote') : null
        };
      });

      const { votes, answers, comments, ...postWithoutVotes } = post;
      const transformedPost = {
        ...postWithoutVotes,
        score: postUpvotes - postDownvotes,
        userVote: postUserVote ? (postUserVote.isUpvote ? 'upvote' : 'downvote') : null,
        answers: transformedAnswers,
        comments: transformedComments
      };

      res.json({
        success: true,
        data: transformedPost
      });
    } catch (error) {
      console.error('Error in getPostById:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get post'
      });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, blocks, tags } = req.body;
      const userId = req.user.id;

      console.log('Creating post with data:', { title, blocksCount: blocks?.length, tags });

      if (!title || !blocks || !Array.isArray(blocks)) {
        return res.status(400).json({
          success: false,
          error: 'Title and blocks are required'
        });
      }

      // Process blocks and upload images
      const processedBlocks = await Promise.all(blocks.map(async (block, index) => {
        if (block.type === 'image' && block.content) {
          try {
            console.log(`Processing image block ${index + 1}...`);
            
            // Skip if already a Cloudinary URL
            if (block.content.includes('cloudinary.com')) {
              console.log(`Image ${index + 1} is already a Cloudinary URL`);
              return { ...block, order: index };
            }

            const imageUrl = await uploadImage(block.content);
            
            if (!imageUrl) {
              console.error(`Failed to get URL for image ${index + 1}`);
              throw new Error('Failed to upload image');
            }

            console.log(`Image ${index + 1} uploaded successfully:`, imageUrl);
            return {
              type: 'image',
              content: imageUrl,
              isFullWidth: block.isFullWidth || false,
              order: index
            };
          } catch (err) {
            console.error(`Error uploading image ${index + 1}:`, err);
            throw new Error(`Failed to upload image ${index + 1}`);
          }
        }
        return { ...block, order: index };
      }));

      console.log('Processed blocks:', processedBlocks);

      // Extract text content and image URLs for backward compatibility
      const textContent = processedBlocks
        .filter(b => b.type === 'text')
        .map(b => b.content)
        .join('\n\n');
      
      const imageUrls = processedBlocks
        .filter(b => b.type === 'image')
        .map(b => b.content);

      // Create post with processed blocks
      const post = await prisma.forumPost.create({
        data: {
          title,
          content: textContent,
          blocks: processedBlocks,
          images: imageUrls,
          tags: tags || ['general'],
          userId: parseInt(userId),
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
          votes: true,
        },
      });

      console.log('Post created:', post);

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ 
        success: false,
        message: error.message || 'Failed to create post',
        details: error.stack
      });
    }
  },

  // Answer Controllers
  createAnswer: async (req, res) => {
    try {
      const { blocks } = req.body;
      const { postId } = req.params;
      const userId = parseInt(req.user.id);

      console.log('Creating answer with raw data:', { 
        postId,
        postIdType: typeof postId,
        blocksCount: blocks?.length 
      });

      // Validate input
      if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Blocks are required and must be a non-empty array'
        });
      }

      // Parse and validate postId
      const parsedPostId = parseInt(postId);
      if (isNaN(parsedPostId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid post ID format'
        });
      }

      // Validate post exists
      const post = await prisma.forumPost.findUnique({
        where: { 
          id: parsedPostId
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // Process blocks and upload images to Cloudinary
      const processedBlocks = await Promise.all(blocks.map(async (block, index) => {
        if (block.type === 'image' && block.content) {
          try {
            console.log(`Processing image block ${index + 1}...`);
            
            // Skip if already a Cloudinary URL
            if (block.content.includes('cloudinary.com')) {
              console.log(`Image ${index + 1} is already a Cloudinary URL`);
              return { ...block, order: index };
            }

            const imageUrl = await uploadImage(block.content);
            
            if (!imageUrl) {
              console.error(`Failed to get URL for image ${index + 1}`);
              throw new Error('Failed to upload image');
            }

            console.log(`Image ${index + 1} uploaded successfully:`, imageUrl);
            return {
              type: 'image',
              content: imageUrl,
              isFullWidth: block.isFullWidth || false,
              order: index
            };
          } catch (err) {
            console.error(`Error uploading image ${index + 1}:`, err);
            throw new Error(`Failed to upload image ${index + 1}`);
          }
        }
        return { ...block, order: index };
      }));

      // Extract text content and image URLs for backward compatibility
      const textContent = processedBlocks
        .filter(b => b.type === 'text')
        .map(b => b.content)
        .join('\n\n');
      
      const imageUrls = processedBlocks
        .filter(b => b.type === 'image')
        .map(b => b.content);

      // Create answer with processed blocks
      const answer = await prisma.forumAnswer.create({
        data: {
          content: textContent || '',
          blocks: processedBlocks,
          images: imageUrls || [],
          userId,
          postId: parsedPostId,
          upvotes: 0,
          downvotes: 0
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
          comments: {
            include: {
              user: true,
              replies: {
                include: {
                  user: true
                }
              }
            }
          },
          votes: true
        }
      });

      // Transform the answer data
      const transformedAnswer = {
        ...answer,
        userVote: null,
        comments: answer.comments.map(comment => ({
          ...comment,
          userVote: null,
          replies: comment.replies.map(reply => ({
            ...reply,
            userVote: null
          }))
        }))
      };

      console.log('Answer created successfully:', transformedAnswer.id);

      res.json({
        success: true,
        data: transformedAnswer
      });
    } catch (error) {
      console.error('Error creating answer:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create answer'
      });
    }
  },

  acceptAnswer: async (req, res) => {
    try {
      const { postId, answerId } = req.params;
      const userId = req.user.id;

      // Check if user is post owner
      const post = await prisma.forumPost.findUnique({
        where: { id: parseInt(postId) }
      });

      if (!post || post.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Only post owner can accept answers'
        });
      }

      const answer = await prisma.forumAnswer.update({
        where: { id: parseInt(answerId) },
        data: { isAccepted: true }
      });

      res.json({
        success: true,
        data: answer
      });
    } catch (error) {
      console.error('Error in acceptAnswer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to accept answer'
      });
    }
  },

  // Comment Controllers
  createComment: async (req, res) => {
    try {
      const { content, parentId } = req.body;
      const { postId, answerId } = req.params;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      // Check if post exists
      const post = await prisma.forumPost.findUnique({
        where: { id: parseInt(postId) }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // If answerId is provided, check if answer exists
      if (answerId) {
        const answer = await prisma.forumAnswer.findUnique({
          where: { id: parseInt(answerId) }
        });

        if (!answer) {
          return res.status(404).json({
            success: false,
            error: 'Answer not found'
          });
        }
      }

      // If parentId is provided, check if parent comment exists
      if (parentId) {
        const parentComment = await prisma.forumComment.findUnique({
          where: { id: parseInt(parentId) }
        });

        if (!parentComment) {
          return res.status(404).json({
            success: false,
            error: 'Parent comment not found'
          });
        }
      }

      // Create the comment with proper nesting structure
      const comment = await prisma.forumComment.create({
        data: {
          content,
          userId,
          postId: parseInt(postId),
          answerId: answerId ? parseInt(answerId) : undefined,
          parentId: parentId ? parseInt(parentId) : undefined,
          upvotes: 0,
          downvotes: 0
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
          votes: {
            where: {
              userId
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
              votes: {
                where: {
                  userId
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
                  votes: {
                    where: {
                      userId
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Transform comment data to include vote status
      const transformComment = (comment) => {
        const upvotes = comment.votes.filter(v => v.isUpvote).length;
        const downvotes = comment.votes.filter(v => !v.isUpvote).length;
        const userVote = comment.votes[0];

        const { votes, replies, ...commentWithoutVotes } = comment;
        return {
          ...commentWithoutVotes,
          score: upvotes - downvotes,
          userVote: userVote ? (userVote.isUpvote ? 'upvote' : 'downvote') : null,
          replies: replies?.map(transformComment) || []
        };
      };

      const transformedComment = transformComment(comment);

      // Get the updated post data with nested comments
      const updatedPost = await prisma.forumPost.findUnique({
        where: { id: parseInt(postId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              rank: true
            }
          },
          answers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rank: true
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
                  votes: {
                    where: {
                      userId
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
                      votes: {
                        where: {
                          userId
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
                          votes: {
                            where: {
                              userId
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              votes: {
                where: {
                  userId
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
              votes: {
                where: {
                  userId
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
                  votes: {
                    where: {
                      userId
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
                      votes: {
                        where: {
                          userId
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          votes: {
            where: {
              userId
            }
          }
        }
      });

      // Transform post data
      const transformPost = (post) => {
        const upvotes = post.votes.filter(v => v.isUpvote).length;
        const downvotes = post.votes.filter(v => !v.isUpvote).length;
        const userVote = post.votes[0];

        const transformAnswer = (answer) => {
          const answerUpvotes = answer.votes.filter(v => v.isUpvote).length;
          const answerDownvotes = answer.votes.filter(v => !v.isUpvote).length;
          const answerUserVote = answer.votes[0];

          const { votes: answerVotes, comments, ...answerWithoutVotes } = answer;
          return {
            ...answerWithoutVotes,
            score: answerUpvotes - answerDownvotes,
            userVote: answerUserVote ? (answerUserVote.isUpvote ? 'upvote' : 'downvote') : null,
            comments: comments.map(transformComment)
          };
        };

        const { votes, answers, comments, ...postWithoutVotes } = post;
        return {
          ...postWithoutVotes,
          score: upvotes - downvotes,
          userVote: userVote ? (userVote.isUpvote ? 'upvote' : 'downvote') : null,
          answers: answers.map(transformAnswer),
          comments: comments.map(transformComment)
        };
      };

      const transformedPost = transformPost(updatedPost);

      res.json({
        success: true,
        data: transformedPost
      });
    } catch (error) {
      console.error('Error in createComment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create comment'
      });
    }
  },

  // Vote Controllers
  handleVote: async (req, res) => {
    try {
      const { type, id } = req.params;
      const { isUpvote } = req.body;
      const userId = req.user?.id;

      // Validate user
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      // Validate vote type
      if (!['post', 'answer', 'comment'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid vote type'
        });
      }

      // Execute vote operation in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Get item with current votes
        const modelName = type === 'post' ? 'forumPost' : type === 'answer' ? 'forumAnswer' : 'forumComment';
        const item = await tx[modelName].findUnique({
          where: { id: parseInt(id) },
          include: {
            votes: true,
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

        if (!item) {
          throw new Error(`${type} not found`);
        }

        // Check existing vote
        const existingVote = await tx.forumVote.findFirst({
          where: {
            userId,
            [`${type}Id`]: parseInt(id)
          }
        });

        let action = 'none';

        // Handle vote
        if (existingVote) {
          if (existingVote.isUpvote === isUpvote) {
            // Delete vote if same type (unvote)
            await tx.forumVote.delete({
              where: { id: existingVote.id }
            });
            action = 'delete';
          } else {
            // Update vote if different type
            await tx.forumVote.update({
              where: { id: existingVote.id },
              data: { isUpvote }
            });
            action = 'update';
          }
        } else {
          // Create new vote
          await tx.forumVote.create({
            data: {
              userId,
              isUpvote,
              [`${type}Id`]: parseInt(id)
            }
          });
          action = 'create';
        }

        // Get fresh vote counts
        const votes = await tx.forumVote.findMany({
          where: {
            [`${type}Id`]: parseInt(id)
          }
        });

        // Calculate vote counts
        const upvotes = votes.filter(v => v.isUpvote).length;
        const downvotes = votes.filter(v => !v.isUpvote).length;

        // Update item with new vote counts
        const updatedItem = await tx[modelName].update({
          where: { 
            id: parseInt(id) 
          },
          data: {
            upvotes,
            downvotes
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
            votes: {
              where: {
                userId
              }
            },
            ...(type === 'comment' && {
              replies: {
                orderBy: {
                  createdAt: 'asc'
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
                  votes: {
                    where: {
                      userId
                    }
                  },
                  replies: {
                    orderBy: {
                      createdAt: 'asc'
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
                      votes: {
                        where: {
                          userId
                        }
                      }
                    }
                  }
                }
              }
            })
          }
        });

        // Get user's current vote status
        const userVote = action === 'delete' ? null : isUpvote ? 'upvote' : 'downvote';

        // Transform the item to include vote status
        const transformedItem = {
          ...updatedItem,
          userVote,
          score: upvotes - downvotes
        };

        // If it's a comment, transform nested replies
        if (type === 'comment' && transformedItem.replies) {
          transformedItem.replies = transformedItem.replies.map(reply => {
            const replyUpvotes = reply.votes.filter(v => v.isUpvote).length;
            const replyDownvotes = reply.votes.filter(v => !v.isUpvote).length;
            const replyUserVote = reply.votes[0];

            return {
              ...reply,
              score: replyUpvotes - replyDownvotes,
              userVote: replyUserVote ? (replyUserVote.isUpvote ? 'upvote' : 'downvote') : null
            };
          });
        }

        return transformedItem;
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in handleVote:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to handle vote',
        details: error.message
      });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const { title, blocks, tags } = req.body;
      const userId = req.user.id;

      console.log('Creating question with data:', { title, blocksCount: blocks?.length, tags });

      // Validate input
      if (!title || !blocks || !Array.isArray(blocks)) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      // Upload images to Cloudinary and process blocks
      const processedBlocks = await Promise.all(blocks.map(async (block, index) => {
        if (block.type === 'image') {
          try {
            console.log(`Processing image block ${index + 1}...`);
            const imageUrl = await uploadImage(block.content);
            
            if (!imageUrl) {
              console.error(`Failed to get URL for image ${index + 1}`);
              throw new Error('Failed to upload image');
            }

            console.log(`Image ${index + 1} uploaded successfully:`, imageUrl);
            return {
              type: 'image',
              content: imageUrl,
              isFullWidth: block.isFullWidth,
              order: index
            };
          } catch (err) {
            console.error(`Error uploading image ${index + 1}:`, err);
            throw new Error('Failed to upload image');
          }
        }
        return { ...block, order: index };
      }));

      console.log('Processed blocks:', processedBlocks);

      // Create post with processed blocks
      const post = await prisma.forumPost.create({
        data: {
          title,
          content: processedBlocks
            .filter(b => b.type === 'text')
            .map(b => b.content)
            .join('\n\n'),
          blocks: processedBlocks,
          tags: tags || ['general'],
          userId: parseInt(userId),
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
          votes: true,
        },
      });

      console.log('Post created:', post);

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ 
        success: false,
        message: error.message || 'Failed to create post',
        details: error.stack
      });
    }
  }
};

module.exports = forumController; 