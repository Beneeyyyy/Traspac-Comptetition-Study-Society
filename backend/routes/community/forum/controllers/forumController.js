const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
              votes: true,
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      rank: true
                    }
                  },
                  votes: true
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
                  image: true,
                  rank: true
                }
              },
              votes: true
            }
          },
          votes: {
            where: {
              userId: userId
            }
          }
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // Increment view count
      await prisma.forumPost.update({
        where: { id: parseInt(id) },
        data: { viewCount: { increment: 1 } }
      });

      // Transform post to include vote status
      const transformPost = (post) => {
        const upvotes = post.votes.filter(vote => vote.isUpvote).length;
        const downvotes = post.votes.filter(vote => !vote.isUpvote).length;
        const userVote = post.votes[0];

        const { votes, ...postWithoutVotes } = post;
        return {
          ...postWithoutVotes,
          score: upvotes - downvotes,
          userVote: userVote ? (userVote.isUpvote ? 'upvote' : 'downvote') : null
        };
      };

      const transformedPost = transformPost(post);

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
      const { title, content, tags, images } = req.body;
      const userId = req.user.id;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        });
      }

      const post = await prisma.forumPost.create({
        data: {
          title,
          content,
          tags: tags || [],
          images: images || [],
          userId
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
        data: post
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create post'
      });
    }
  },

  // Answer Controllers
  createAnswer: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, images } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      const answer = await prisma.forumAnswer.create({
        data: {
          content,
          images: images || [],
          userId,
          postId: parseInt(postId)
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
          }
        }
      });

      // Transform answer to include vote counts
      const transformedAnswer = {
        ...answer,
        upvoteCount: answer.votes.filter(vote => vote.isUpvote).length,
        downvoteCount: answer.votes.filter(vote => !vote.isUpvote).length,
        userVote: null // New answer has no votes yet
      };

      // Remove votes array from response
      delete transformedAnswer.votes;

      res.json({
        success: true,
        data: transformedAnswer
      });
    } catch (error) {
      console.error('Error in createAnswer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create answer'
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
      const { content } = req.body;
      const { postId, answerId } = req.params;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Content is required'
        });
      }

      const comment = await prisma.forumComment.create({
        data: {
          content,
          userId,
          postId: postId ? parseInt(postId) : undefined,
          answerId: answerId ? parseInt(answerId) : undefined
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
        data: comment
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
      const userId = req.user.id;

      // Validate vote type
      if (!['post', 'answer', 'comment'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid vote type'
        });
      }

      const voteData = {
        userId,
        isUpvote,
        [`${type}Id`]: parseInt(id)
      };

      // Check if vote exists
      const existingVote = await prisma.forumVote.findFirst({
        where: {
          userId,
          [`${type}Id`]: parseInt(id)
        }
      });

      let vote;
      if (existingVote) {
        if (existingVote.isUpvote === isUpvote) {
          // Remove vote if same type
          vote = await prisma.forumVote.delete({
            where: { id: existingVote.id }
          });
        } else {
          // Update vote if different type
          vote = await prisma.forumVote.update({
            where: { id: existingVote.id },
            data: { isUpvote }
          });
        }
      } else {
        // Create new vote
        vote = await prisma.forumVote.create({
          data: voteData
        });
      }

      // Get updated vote counts
      const votes = await prisma.forumVote.findMany({
        where: {
          [`${type}Id`]: parseInt(id)
        }
      });

      const upvotes = votes.filter(v => v.isUpvote).length;
      const downvotes = votes.filter(v => !v.isUpvote).length;

      res.json({
        success: true,
        data: {
          vote,
          upvotes,
          downvotes,
          userVote: vote ? (vote.isUpvote ? 'upvote' : 'downvote') : null
        }
      });
    } catch (error) {
      console.error('Error in handleVote:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to handle vote'
      });
    }
  }
};

module.exports = forumController; 