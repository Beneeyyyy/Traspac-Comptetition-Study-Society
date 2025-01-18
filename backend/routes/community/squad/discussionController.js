const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create discussion
const createDiscussion = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const discussion = await prisma.squadDiscussion.create({
      data: {
        title,
        content,
        squadId: parseInt(squadId),
        userId
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
        }
      }
    });

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all discussions
const getDiscussions = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { search, sort = 'newest' } = req.query;

    const where = {
      squadId: parseInt(squadId)
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = {};
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'mostReplies':
        orderBy = { replies: { _count: 'desc' } };
        break;
      default: // newest
        orderBy = { createdAt: 'desc' };
    }

    const discussions = await prisma.squadDiscussion.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific discussion
const getDiscussion = async (req, res) => {
  try {
    const { squadId, discussionId } = req.params;

    const discussion = await prisma.squadDiscussion.findFirst({
      where: {
        id: parseInt(discussionId),
        squadId: parseInt(squadId)
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update discussion
const updateDiscussion = async (req, res) => {
  try {
    const { squadId, discussionId } = req.params;
    const { title, content } = req.body;

    const discussion = await prisma.squadDiscussion.update({
      where: {
        id: parseInt(discussionId),
        squadId: parseInt(squadId)
      },
      data: {
        title,
        content
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
        }
      }
    });

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete discussion
const deleteDiscussion = async (req, res) => {
  try {
    const { squadId, discussionId } = req.params;

    await prisma.squadDiscussion.delete({
      where: {
        id: parseInt(discussionId),
        squadId: parseInt(squadId)
      }
    });

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add reply to discussion
const addReply = async (req, res) => {
  try {
    const { squadId, discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const reply = await prisma.squadDiscussionReply.create({
      data: {
        content,
        discussionId: parseInt(discussionId),
        userId
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

    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete reply
const deleteReply = async (req, res) => {
  try {
    const { squadId, discussionId, replyId } = req.params;

    await prisma.squadDiscussionReply.delete({
      where: {
        id: parseInt(replyId),
        discussionId: parseInt(discussionId)
      }
    });

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  deleteReply
}; 