const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get squad discussions
const getDiscussions = async (req, res) => {
  try {
    console.log('\n=== GET DISCUSSIONS START ===');
    const squadId = parseInt(req.params.id);
    console.log('Squad ID:', squadId);
    
    // First check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId }
    });

    if (!squad) {
      console.log('Squad not found');
      return res.status(404).json({ error: 'Squad not found' });
    }

    console.log('Found squad:', squad.name);

    const discussions = await prisma.squadDiscussion.findMany({
      where: { 
        squadId
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${discussions.length} discussions`);

    // Transform data
    const transformedDiscussions = discussions.map(discussion => ({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      user: discussion.user,
      replies: discussion.replies,
      replyCount: discussion.replies.length,
      isPinned: discussion.isPinned
    }));

    console.log('=== GET DISCUSSIONS END ===\n');
    res.json(transformedDiscussions);
  } catch (error) {
    console.error('\n=== GET DISCUSSIONS ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

// Create discussion
const createDiscussion = async (req, res) => {
  try {
    console.log('\n=== CREATE DISCUSSION START ===');
    const squadId = parseInt(req.params.id);
    const { title, content } = req.body;
    const userId = req.user.id;

    console.log('Creating discussion:', { squadId, userId, title });

    const discussion = await prisma.squadDiscussion.create({
      data: {
        title,
        content,
        squad: {
          connect: { id: squadId }
        },
        user: {
          connect: { id: userId }
        }
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

    console.log('Discussion created:', discussion.id);
    console.log('=== CREATE DISCUSSION END ===\n');

    res.json({
      ...discussion,
      replies: [],
      replyCount: 0
    });
  } catch (error) {
    console.error('\n=== CREATE DISCUSSION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

// Add reply to discussion
const addDiscussionReply = async (req, res) => {
  try {
    console.log('\n=== ADD DISCUSSION REPLY START ===');
    const { id: squadId, discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    console.log('Adding reply:', { squadId, discussionId, userId });

    // First verify the discussion belongs to the squad
    const discussion = await prisma.squadDiscussion.findFirst({
      where: {
        id: parseInt(discussionId),
        squadId: parseInt(squadId)
      }
    });

    if (!discussion) {
      console.log('Discussion not found');
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const reply = await prisma.squadDiscussionReply.create({
      data: {
        content,
        discussion: {
          connect: { id: parseInt(discussionId) }
        },
        user: {
          connect: { id: userId }
        }
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

    console.log('Reply created:', reply.id);
    console.log('=== ADD DISCUSSION REPLY END ===\n');

    res.json(reply);
  } catch (error) {
    console.error('\n=== ADD DISCUSSION REPLY ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDiscussions,
  createDiscussion,
  addDiscussionReply
}; 