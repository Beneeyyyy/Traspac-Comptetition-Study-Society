const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../utils/uploadImage');
const { requireAuth } = require('../../usersManagement/controllers/authController');
const cors = require('cors');

// Configure CORS for this router
router.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

console.log('Squad routes loading...');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Squad Route] ${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('Cookies:', req.cookies);
  next();
});

// Create new squad
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('Creating new squad with data:', req.body);
    const { name, description, isPublic = true, image, banner } = req.body;

    // Upload images to Cloudinary if provided
    let uploadedImage = null;
    let uploadedBanner = null;

    if (image) {
      console.log('Uploading squad image...');
      uploadedImage = await uploadImage(image);
    }

    if (banner) {
      console.log('Uploading squad banner...');
      uploadedBanner = await uploadImage(banner);
    }

    // Create squad with initial member count = 1 (the admin)
    const squad = await prisma.squad.create({
      data: {
        name,
        description,
        isPublic,
        image: uploadedImage,
        banner: uploadedBanner,
        memberCount: 1 // Set initial member count
      }
    });

    // Create squad member (admin)
    await prisma.squadMember.create({
      data: {
        squadId: squad.id,
        userId: req.user.id,
        role: 'ADMIN'
      }
    });

    // Get complete squad data
    const completeSquad = await prisma.squad.findUnique({
      where: { id: squad.id },
      include: {
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        },
        members: {
          where: {
            userId: req.user.id
          },
          select: {
            role: true
          }
        }
      }
    });

    // Transform to match frontend expectations
    const transformedSquad = {
      id: completeSquad.id,
      name: completeSquad.name,
      description: completeSquad.description,
      isPublic: completeSquad.isPublic,
      banner: completeSquad.banner,
      image: completeSquad.image,
      memberCount: completeSquad._count.members,
      materialsCount: completeSquad._count.materials,
      discussionsCount: completeSquad._count.discussions,
      isMember: true, // Creator is always a member
      role: 'ADMIN' // Creator is always admin
    };

    console.log('Squad created:', transformedSquad);
    res.status(201).json(transformedSquad);
  } catch (error) {
    console.error('Error creating squad:', error);
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

// Test route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Squad route is working' });
});

// Create test squad
router.post('/create-test', async (req, res) => {
  try {
    const squad = await prisma.squad.create({
      data: {
        name: 'Programming Squad',
        description: 'A squad for learning programming together',
        isPublic: true,
        image: 'https://example.com/squad.jpg',
        banner: 'https://example.com/banner.jpg'
      }
    });
    res.json(squad);
  } catch (error) {
    console.error('Error creating test squad:', error);
    res.status(500).json({ error: 'Failed to create test squad' });
  }
});

// Get all squads
router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('GET / route hit - Fetching squads from database');
    const userId = req.user.id;
    const isMember = req.query.isMember === 'true';
    
    console.log('User ID:', userId);
    console.log('Is Member filter:', isMember);

    const baseInclude = {
      _count: {
        select: {
          members: true,
          materials: true,
          discussions: true
        }
      },
      members: {
        where: {
          userId
        },
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    };

    let squads;
    try {
      if (isMember) {
        // Get squads where user is a member
        squads = await prisma.squad.findMany({
          where: {
            members: {
              some: {
                userId
              }
            }
          },
          include: baseInclude
        });
      } else {
        // Get all squads
        squads = await prisma.squad.findMany({
          include: baseInclude
        });
      }

      console.log(`Found ${squads.length} squads`);

      // Transform the data to match frontend expectations
      const transformedSquads = squads.map(squad => ({
        id: squad.id,
        name: squad.name,
        description: squad.description,
        isPublic: squad.isPublic,
        banner: squad.banner,
        image: squad.image,
        about: squad.about,
        rules: squad.rules || [],
        memberCount: squad._count.members,
        materialsCount: squad._count.materials,
        discussionsCount: squad._count.discussions,
        isMember: squad.members.length > 0,
        role: squad.members[0]?.role || null,
        createdAt: squad.createdAt,
        updatedAt: squad.updatedAt
      }));

      console.log('Sending response:', transformedSquads);
      res.json(transformedSquads);
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Database query failed');
    }
  } catch (error) {
    console.error('Error fetching squads:', error);
    res.status(500).json({ 
      error: 'Failed to fetch squads', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get squad by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const userId = req.user.id;

    console.log(`Fetching squad with ID: ${squadId}`);

    // Get squad with counts and members
    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        },
        members: {
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
        materials: {
          select: {
            id: true
          }
        },
        discussions: {
          select: {
            id: true
          }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Check if user is a member
    const member = squad.members.find(m => m.user.id === userId);

    // Transform squad data
    const transformedSquad = {
      id: squad.id,
      name: squad.name,
      description: squad.description,
      isPublic: squad.isPublic,
      banner: squad.banner,
      image: squad.image,
      about: squad.about,
      rules: squad.rules || [],
      memberCount: squad._count.members,
      _count: {
        members: squad._count.members,
        materials: squad._count.materials,
        discussions: squad._count.discussions
      },
      isMember: !!member,
      role: member?.role || null,
      members: squad.members,
      createdAt: squad.createdAt,
      updatedAt: squad.updatedAt
    };

    console.log('Sending transformed squad:', {
      id: transformedSquad.id,
      name: transformedSquad.name,
      counts: transformedSquad._count
    });

    res.json(transformedSquad);
  } catch (error) {
    console.error('Error fetching squad:', error);
    res.status(500).json({ error: 'Failed to fetch squad' });
  }
});

// Get squad materials
router.get('/:id/materials', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    console.log(`Fetching materials for squad ${squadId}`);

    // Check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Get materials where squadId matches
    const materials = await prisma.material.findMany({
      where: {
        squadId: squadId
      },
      include: {
        stages: true, // Include stages
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform materials data
    const transformedMaterials = materials.map(material => ({
      id: material.id,
      title: material.title,
      description: material.description,
      image: material.image,
      xp_reward: material.xp_reward,
      estimated_time: material.estimated_time,
      stages: material.stages,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      learnerCount: material._count.progress
    }));

    console.log('Transformed materials:', transformedMaterials);
    res.json(transformedMaterials);
  } catch (error) {
    console.error('Error fetching squad materials:', error);
    res.status(500).json({ 
      error: 'Failed to fetch squad materials',
      details: error.message,
      stack: error.stack 
    });
  }
});

// Get squad discussions
router.get('/:id/discussions', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    console.log(`Fetching discussions for squad ${squadId}`);

    // Check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Get discussions with properly nested replies
    const discussions = await prisma.squadDiscussion.findMany({
      where: {
        squadId: squadId
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
            },
            children: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                },
                children: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        image: true
                      }
                    },
                    children: {
                      include: {
                        user: {
                          select: {
                            id: true,
                            name: true,
                            image: true
                          }
                        },
                        children: {
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
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform discussions data
    const transformedDiscussions = discussions.map(discussion => ({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      isPinned: discussion.isPinned,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      user: discussion.user,
      replyCount: discussion._count.replies,
      replies: discussion.replies
    }));

    console.log('Transformed discussions:', transformedDiscussions);
    res.json(transformedDiscussions);
  } catch (error) {
    console.error('Error fetching squad discussions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch squad discussions',
      details: error.message
    });
  }
});

// Join squad
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const userId = req.user.id;

    console.log(`User ${userId} attempting to join squad ${squadId}`);

    // Check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        members: {
          where: {
            userId: userId
          }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Check if user is already a member
    if (squad.members.length > 0) {
      return res.status(400).json({ error: 'Already a member of this squad' });
    }

    // Create squad member
    await prisma.squadMember.create({
      data: {
        squadId: squadId,
        userId: userId,
        role: 'member'
      }
    });

    // Increment member count
    await prisma.squad.update({
      where: { id: squadId },
      data: {
        memberCount: {
          increment: 1
        }
      }
    });

    // Get updated squad data
    const updatedSquad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        },
        members: {
          where: {
            userId: userId
          },
          select: {
            role: true
          }
        }
      }
    });

    // Transform squad data
    const transformedSquad = {
      id: updatedSquad.id,
      name: updatedSquad.name,
      description: updatedSquad.description,
      isPublic: updatedSquad.isPublic,
      banner: updatedSquad.banner,
      image: updatedSquad.image,
      memberCount: updatedSquad._count.members,
      materialsCount: updatedSquad._count.materials,
      discussionsCount: updatedSquad._count.discussions,
      isMember: true,
      role: updatedSquad.members[0]?.role
    };

    console.log('User successfully joined squad:', transformedSquad);
    res.json(transformedSquad);
  } catch (error) {
    console.error('Error joining squad:', error);
    res.status(500).json({ error: 'Failed to join squad', details: error.message });
  }
});

// Leave squad
router.post('/:id/leave', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const userId = req.user.id;

    console.log(`User ${userId} attempting to leave squad ${squadId}`);

    // Check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        members: {
          where: {
            userId: userId
          }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Check if user is a member
    if (squad.members.length === 0) {
      return res.status(400).json({ error: 'Not a member of this squad' });
    }

    // Check if user is the admin
    if (squad.members[0].role === 'ADMIN') {
      return res.status(400).json({ error: 'Squad admin cannot leave the squad' });
    }

    // Delete squad member
    await prisma.squadMember.deleteMany({
      where: {
        squadId: squadId,
        userId: userId
      }
    });

    // Decrement member count
    await prisma.squad.update({
      where: { id: squadId },
      data: {
        memberCount: {
          decrement: 1
        }
      }
    });

    // Get updated squad data
    const updatedSquad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        },
        members: {
          where: {
            userId: userId
          },
          select: {
            role: true
          }
        }
      }
    });

    // Transform squad data
    const transformedSquad = {
      id: updatedSquad.id,
      name: updatedSquad.name,
      description: updatedSquad.description,
      isPublic: updatedSquad.isPublic,
      banner: updatedSquad.banner,
      image: updatedSquad.image,
      memberCount: updatedSquad._count.members,
      materialsCount: updatedSquad._count.materials,
      discussionsCount: updatedSquad._count.discussions,
      isMember: false,
      role: null
    };

    console.log('User successfully left squad:', transformedSquad);
    res.json(transformedSquad);
  } catch (error) {
    console.error('Error leaving squad:', error);
    res.status(500).json({ error: 'Failed to leave squad', details: error.message });
  }
});

// Update squad information (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const userId = req.user.id;
    const { name, description, isPublic, image, banner, about, rules } = req.body;

    // Check if user is admin
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId,
        userId,
        role: 'ADMIN'
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Only admin can update squad information' });
    }

    // Upload new images if provided
    let uploadedImage = image;
    let uploadedBanner = banner;
    
    if (image && image !== squad.image) {
      uploadedImage = await uploadImage(image);
    }
    
    if (banner && banner !== squad.banner) {
      uploadedBanner = await uploadImage(banner);
    }

    // Update squad
    const updatedSquad = await prisma.squad.update({
      where: { id: squadId },
      data: {
        name,
        description,
        isPublic,
        image: uploadedImage,
        banner: uploadedBanner,
        about,
        rules
      },
      include: {
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        },
        members: {
          where: {
            userId
          },
          select: {
            role: true
          }
        }
      }
    });

    // Transform squad data
    const transformedSquad = {
      id: updatedSquad.id,
      name: updatedSquad.name,
      description: updatedSquad.description,
      isPublic: updatedSquad.isPublic,
      banner: updatedSquad.banner,
      image: updatedSquad.image,
      about: updatedSquad.about,
      rules: updatedSquad.rules,
      memberCount: updatedSquad._count.members,
      materialsCount: updatedSquad._count.materials,
      discussionsCount: updatedSquad._count.discussions,
      isMember: true,
      role: 'ADMIN'
    };

    res.json(transformedSquad);
  } catch (error) {
    console.error('Error updating squad:', error);
    res.status(500).json({ error: 'Failed to update squad', details: error.message });
  }
});

// Manage squad members (admin only)
router.put('/:id/members/:memberId', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const memberId = parseInt(req.params.memberId);
    const adminId = req.user.id;
    const { role, action } = req.body;

    // Check if user is admin
    const isAdmin = await prisma.squadMember.findFirst({
      where: {
        squadId,
        userId: adminId,
        role: 'ADMIN'
      }
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admin can manage members' });
    }

    if (action === 'remove') {
      // Check if trying to remove admin
      const memberToRemove = await prisma.squadMember.findFirst({
        where: {
          squadId,
          userId: memberId
        }
      });

      if (memberToRemove.role === 'ADMIN') {
        return res.status(400).json({ error: 'Cannot remove squad admin' });
      }

      // Remove member
      await prisma.squadMember.delete({
        where: {
          id: memberToRemove.id
        }
      });

      // Update member count
      await prisma.squad.update({
        where: { id: squadId },
        data: {
          memberCount: {
            decrement: 1
          }
        }
      });

      res.json({ message: 'Member removed successfully' });
    } else if (action === 'update') {
      // Update member role
      await prisma.squadMember.update({
        where: {
          squadId_userId: {
            squadId,
            userId: memberId
          }
        },
        data: {
          role
        }
      });

      res.json({ message: 'Member role updated successfully' });
    }
  } catch (error) {
    console.error('Error managing squad member:', error);
    res.status(500).json({ error: 'Failed to manage squad member', details: error.message });
  }
});

// Delete squad (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if user is admin
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId,
        userId,
        role: 'ADMIN'
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Only admin can delete squad' });
    }

    // Delete all related data
    await prisma.$transaction([
      // Delete squad members
      prisma.squadMember.deleteMany({
        where: { squadId }
      }),
      // Delete squad materials
      prisma.material.deleteMany({
        where: { squadId }
      }),
      // Delete squad discussions
      prisma.squadDiscussion.deleteMany({
        where: { squadId }
      }),
      // Finally delete the squad
      prisma.squad.delete({
        where: { id: squadId }
      })
    ]);

    res.json({ message: 'Squad deleted successfully' });
  } catch (error) {
    console.error('Error deleting squad:', error);
    res.status(500).json({ error: 'Failed to delete squad', details: error.message });
  }
});

// Get squad members
router.get('/:id/members', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    console.log(`Fetching members for squad ${squadId}`);

    // Check if squad exists
    const squad = await prisma.squad.findUnique({
      where: { id: squadId }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Get members with user data
    const members = await prisma.squadMember.findMany({
      where: {
        squadId: squadId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Transform members data
    const transformedMembers = members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      image: member.user.image,
      email: member.user.email,
      role: member.role,
      joinedAt: member.createdAt
    }));

    console.log('Transformed members:', transformedMembers);
    res.json(transformedMembers);
  } catch (error) {
    console.error('Error fetching squad members:', error);
    res.status(500).json({ 
      error: 'Failed to fetch squad members',
      details: error.message,
      stack: error.stack 
    });
  }
});

// Create material
router.post('/:id/materials', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const { title, description, xp_reward, estimated_time, categoryId, learningPathId, stages } = req.body;

    console.log('Creating material with data:', {
      title,
      description,
      xp_reward,
      estimated_time,
      categoryId,
      learningPathId,
      stages
    });

    // Validate required fields
    if (!title || !stages || stages.length === 0) {
      return res.status(400).json({ error: 'Title and at least one stage are required' });
    }

    // Create material
    const material = await prisma.material.create({
      data: {
        title,
        description,
        xp_reward: xp_reward || 0,
        estimated_time: estimated_time || 30,
        is_published: true,
        categoryId: parseInt(categoryId),
        squadId,
        ...(learningPathId && {
          learningPaths: {
            connect: {
              id: parseInt(learningPathId)
            }
          }
        }),
        stages: {
          create: stages.map((stage, index) => ({
            title: stage.title,
            contents: stage.contents,
            order: index + 1
          }))
        }
      },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        },
        learningPaths: true,
        category: true
      }
    });

    console.log('Material created successfully:', material);
    res.status(201).json(material);

  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ 
      error: 'Failed to create material', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update material
router.put('/:squadId/materials/:materialId', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.squadId);
    const materialId = parseInt(req.params.materialId);
    const { title, description, xp_reward, estimated_time, learningPathId, categoryId, stages } = req.body;

    console.log('Updating material with data:', {
      title,
      description,
      xp_reward,
      estimated_time,
      categoryId,
      learningPathId,
      stages
    });

    // Validate required fields
    if (!title || !stages || stages.length === 0) {
      return res.status(400).json({ error: 'Title and at least one stage are required' });
    }

    // Validate stages structure
    for (const stage of stages) {
      if (!stage.title || !stage.contents || !Array.isArray(stage.contents) || stage.contents.length === 0) {
        return res.status(400).json({ error: 'Each stage must have a title and at least one content item' });
      }
      for (const content of stage.contents) {
        if (!content.type || !content.content) {
          return res.status(400).json({ error: 'Each content item must have a type and content' });
        }
      }
    }

    // Update material
    const material = await prisma.material.update({
      where: { id: materialId },
      data: {
        title,
        description,
        xp_reward: xp_reward || 0,
        estimated_time: estimated_time || 30,
        categoryId: parseInt(categoryId),
        ...(learningPathId && {
          learningPaths: {
            connect: {
              id: parseInt(learningPathId)
            }
          }
        }),
        stages: {
          deleteMany: {},
          create: stages.map((stage, stageIndex) => ({
            title: stage.title,
            order: stageIndex + 1,
            contents: {
              create: stage.contents.map((content, contentIndex) => ({
                type: content.type,
                content: content.content,
                order: contentIndex + 1
              }))
            }
          }))
        }
      },
      include: {
        stages: {
          include: {
            contents: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        learningPaths: true,
        category: true
      }
    });

    console.log('Material updated successfully:', material);
    res.json(material);

  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ 
      error: 'Failed to update material',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete material
router.delete('/:id/materials/:materialId', requireAuth, async (req, res) => {
  try {
    const { id: squadId, materialId } = req.params;
    const userId = req.user.id;

    // Check if squad exists and user is admin/moderator
    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(squadId) },
      include: {
        members: {
          where: { userId, role: { in: ['ADMIN', 'MODERATOR'] } }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    if (squad.members.length === 0) {
      return res.status(403).json({ error: 'Only admins and moderators can delete materials' });
    }

    // Delete material
    await prisma.material.delete({
      where: { id: parseInt(materialId) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Create discussion
router.post('/:id/discussions', requireAuth, async (req, res) => {
  try {
    const { id: squadId } = req.params;
    const { title, content, isPinned } = req.body;
    const userId = req.user.id;

    // Check if squad exists and user is member
    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(squadId) },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    if (squad.members.length === 0) {
      return res.status(403).json({ error: 'Only squad members can create discussions' });
    }

    // Create discussion
    const discussion = await prisma.squadDiscussion.create({
      data: {
        title,
        content,
        isPinned: isPinned || false,
        squadId: parseInt(squadId),
        userId: userId
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
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    });

    // Transform response to match frontend expectations
    const transformedDiscussion = {
      ...discussion,
      replyCount: discussion._count.replies,
      _count: undefined
    };

    res.status(201).json(transformedDiscussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

// Update discussion
router.put('/:id/discussions/:discussionId', requireAuth, async (req, res) => {
  try {
    const { id: squadId, discussionId } = req.params;
    const { title, content, isPinned } = req.body;
    const userId = req.user.id;

    // Check if squad exists and user is creator or admin/moderator
    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(squadId) },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    const discussion = await prisma.squadDiscussion.findUnique({
      where: { id: parseInt(discussionId) }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Only creator or admin/moderator can update
    if (discussion.userId !== userId && !squad.members.some(m => ['ADMIN', 'MODERATOR'].includes(m.role))) {
      return res.status(403).json({ error: 'Not authorized to update discussion' });
    }

    // Update discussion
    const updatedDiscussion = await prisma.squadDiscussion.update({
      where: { id: parseInt(discussionId) },
      data: {
        title,
        content,
        isPinned: isPinned !== undefined ? isPinned : discussion.isPinned
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
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    });

    // Transform response
    const transformedDiscussion = {
      ...updatedDiscussion,
      replyCount: updatedDiscussion._count.replies,
      _count: undefined
    };

    res.json(transformedDiscussion);
  } catch (error) {
    console.error('Error updating discussion:', error);
    res.status(500).json({ error: 'Failed to update discussion' });
  }
});

// Delete discussion
router.delete('/:id/discussions/:discussionId', requireAuth, async (req, res) => {
  try {
    const { id: squadId, discussionId } = req.params;
    const userId = req.user.id;

    // Check if squad exists and user is creator or admin/moderator
    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(squadId) },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    const discussion = await prisma.squadDiscussion.findUnique({
      where: { id: parseInt(discussionId) }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Only creator or admin/moderator can delete
    if (discussion.userId !== userId && !squad.members.some(m => ['ADMIN', 'MODERATOR'].includes(m.role))) {
      return res.status(403).json({ error: 'Not authorized to delete discussion' });
    }

    // Delete discussion
    await prisma.squadDiscussion.delete({
      where: { id: parseInt(discussionId) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
});

// Add reply to discussion
router.post('/:id/discussions/:discussionId/replies', requireAuth, async (req, res) => {
  try {
    const { id: squadId, discussionId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    // Check if squad exists and user is member
    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(squadId) },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    if (squad.members.length === 0) {
      return res.status(403).json({ error: 'Only squad members can reply to discussions' });
    }

    // Check if discussion exists
    const discussion = await prisma.squadDiscussion.findUnique({
      where: { id: parseInt(discussionId) }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // If parentId is provided, verify it exists and belongs to this discussion
    if (parentId) {
      const parentReply = await prisma.squadDiscussionReply.findUnique({
        where: { id: parseInt(parentId) }
      });

      if (!parentReply || parentReply.discussionId !== parseInt(discussionId)) {
        return res.status(404).json({ error: 'Parent reply not found or invalid' });
      }
    }

    // Create reply
    const reply = await prisma.squadDiscussionReply.create({
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
            image: true
          }
        },
        children: {
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

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

// Get material by ID
router.get('/:id/materials/:materialId', requireAuth, async (req, res) => {
  try {
    const squadId = parseInt(req.params.id);
    const materialId = parseInt(req.params.materialId);
    const userId = req.user.id;

    console.log(`Fetching material with ID: ${materialId} from squad ${squadId}`);

    // Check if squad exists and user is a member
    const squad = await prisma.squad.findUnique({
      where: { id: squadId }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Check if user is a member
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId,
        userId
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'You must be a member of this squad to access its materials' });
    }

    // Get material with stages and their contents
    const material = await prisma.material.findFirst({
      where: {
        id: parseInt(materialId),
        squadId: parseInt(squadId)
      },
      include: {
        stages: {
          orderBy: {
            order: "asc"
          }
        },
        category: true,
        learningPaths: true
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found in this squad' });
    }

    // Transform stages to include properly formatted contents
    const transformedStages = material.stages.map(stage => {
      let contents = [];
      try {
        // Try to parse contents if it's a string
        if (typeof stage.contents === 'string') {
          contents = JSON.parse(stage.contents);
        } else if (Array.isArray(stage.contents)) {
          contents = stage.contents;
        } else if (stage.content) { // Fallback to content field
          contents = typeof stage.content === 'string' ? JSON.parse(stage.content) : stage.content;
        }
        
        // Ensure contents is an array
        if (!Array.isArray(contents)) {
          console.warn(`Stage ${stage.id} contents is not an array:`, contents);
          contents = [];
        }

        // Log the contents structure
        console.log(`Stage ${stage.id} contents:`, contents);
        
      } catch (error) {
        console.error(`Error parsing stage ${stage.id} contents:`, error);
        contents = [];
      }

      return {
        id: stage.id,
        title: stage.title,
        order: stage.order,
        contents: contents,
        materialId: stage.materialId,
        createdAt: stage.createdAt,
        updatedAt: stage.updatedAt
      };
    });

    // Transform material data
    const transformedMaterial = {
      id: material.id,
      title: material.title,
      description: material.description,
      image: material.image,
      xp_reward: material.xp_reward,
      estimated_time: material.estimated_time,
      stages: transformedStages,
      category: material.category,
      learningPaths: material.learningPaths,
      is_published: material.is_published,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt
    };

    console.log('Transformed material:', {
      id: transformedMaterial.id,
      title: transformedMaterial.title,
      stagesCount: transformedMaterial.stages.length,
      stages: transformedMaterial.stages.map(s => ({
        id: s.id,
        title: s.title,
        contentsCount: s.contents.length,
        contents: s.contents
      }))
    });

    res.json({ material: transformedMaterial });

  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ 
      error: 'Failed to fetch material',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Stage progress routes
router.get('/:squadId/stage-progress/material/:userId/:materialId/complete', requireAuth, async (req, res) => {
  try {
    const { squadId, userId, materialId } = req.params;

    console.log('Loading stage progress:', {
      squadId,
      userId,
      materialId
    });

    // Validate user is member of squad
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId: parseInt(squadId),
        userId: parseInt(userId)
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'User is not a member of this squad' });
    }

    // Get material with stages
    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Parse contents for each stage
    material.stages = material.stages.map(stage => ({
      ...stage,
      contents: typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents
    }));

    // Get progress
    const progress = await prisma.materialProgress.findUnique({
      where: {
        userId_materialId: {
          userId: parseInt(userId),
          materialId: parseInt(materialId)
        }
      }
    });

    // If no progress found, return initial state
    if (!progress) {
      const initialProgress = {
        userId: parseInt(userId),
        materialId: parseInt(materialId),
        progress: 0,
        completed: false,
        stageProgress: {},
        completedStages: [],
        activeStage: 0,
        lastAccessed: new Date()
      };

      return res.json({
        success: true,
        data: {
          ...initialProgress,
          material
        }
      });
    }

    // Get points for each stage
    const points = await prisma.point.findMany({
      where: {
        userId: parseInt(userId),
        materialId: parseInt(materialId)
      }
    });

    // Map completed stages from points
    const completedStagesFromPoints = points.map(point => point.stageIndex);

    // Combine completed stages from progress and points
    const allCompletedStages = Array.from(new Set([
      ...(progress.completedStages || []),
      ...completedStagesFromPoints
    ]));

    // Prepare response with parsed progress
    const responseData = {
      ...progress,
      stageProgress: progress.stageProgress ? JSON.parse(progress.stageProgress) : {},
      completedStages: allCompletedStages,
      activeStage: progress.activeStage || 0,
      material
    };

    console.log('📤 Sending response:', {
      progress: responseData.progress,
      stageProgress: responseData.stageProgress,
      completedStages: responseData.completedStages,
      activeStage: responseData.activeStage
    });

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error loading stage progress:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to load progress',
      details: error.message
    });
  }
});

router.post('/:squadId/stage-progress/material/:userId/:materialId/complete', requireAuth, async (req, res) => {
  try {
    const { squadId, userId, materialId } = req.params;
    const { stageIndex, contentIndex, contentProgress, completedStages: newCompletedStages, isStageCompleted } = req.body;

    console.log('Stage progress update request:', {
      squadId,
      userId,
      materialId,
      stageIndex,
      contentIndex,
      contentProgress,
      completedStages: newCompletedStages,
      isStageCompleted
    });

    // Validate user is member of squad
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId: parseInt(squadId),
        userId: parseInt(userId)
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'User is not a member of this squad' });
    }

    // Get material with stages
    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const parsedUserId = parseInt(userId);
    const parsedMaterialId = parseInt(materialId);
    const parsedStageIndex = parseInt(stageIndex);
    const parsedContentIndex = contentIndex !== undefined ? parseInt(contentIndex) : null;

    // Get current progress
    const currentProgress = await prisma.materialProgress.findUnique({
      where: {
        userId_materialId: {
          userId: parsedUserId,
          materialId: parsedMaterialId
        }
      }
    });

    // Initialize or parse existing progress
    let stageProgress = {};
    let completedStages = [];
    
    if (currentProgress) {
      try {
        stageProgress = currentProgress.stageProgress ? JSON.parse(currentProgress.stageProgress) : {};
        completedStages = currentProgress.completedStages || [];
      } catch (e) {
        console.error('Failed to parse progress:', e);
        stageProgress = {};
        completedStages = [];
      }
    }

    // Initialize stage progress if not exists
    if (!stageProgress[parsedStageIndex]) {
      stageProgress[parsedStageIndex] = {
        progress: 0,
        contents: {}
      };
    } else if (typeof stageProgress[parsedStageIndex] === 'number') {
      // Convert old format to new format
      const oldProgress = stageProgress[parsedStageIndex];
      stageProgress[parsedStageIndex] = {
        progress: oldProgress,
        contents: {}
      };
    }

    // Update content progress if provided
    if (parsedContentIndex !== null && contentProgress !== undefined) {
      stageProgress[parsedStageIndex].contents[parsedContentIndex] = contentProgress;
      
      // Calculate stage progress based on content progress
      const totalContentProgress = Object.values(stageProgress[parsedStageIndex].contents)
        .reduce((sum, progress) => sum + progress, 0);
      const contentCount = Object.keys(stageProgress[parsedStageIndex].contents).length;
      stageProgress[parsedStageIndex].progress = Math.round(totalContentProgress / contentCount);
    } else {
      // If no content progress provided, mark entire stage as complete
      stageProgress[parsedStageIndex].progress = 100;
    }

    // Validate stage completion sequence
    const isValidCompletion = parsedStageIndex === 0 || completedStages.includes(parsedStageIndex - 1);
    
    // Update completed stages only if valid sequence
    if (isValidCompletion && (stageProgress[parsedStageIndex].progress === 100 || isStageCompleted) && 
        !completedStages.includes(parsedStageIndex)) {
      completedStages.push(parsedStageIndex);
      // Sort to maintain order
      completedStages.sort((a, b) => a - b);
    }

    // Calculate next stage and overall progress
    const nextStage = parsedStageIndex + 1;
    const hasNextStage = nextStage < material.stages.length;
    
    // Only allow moving to next stage if current stage is completed
    const shouldMoveToNext = hasNextStage && completedStages.includes(parsedStageIndex);
    
    // Calculate total progress based on sequential completion
    const totalProgress = Math.round((completedStages.length / material.stages.length) * 100);

    console.log('Final calculations:', {
      nextStage,
      hasNextStage,
      shouldMoveToNext,
      totalProgress,
      completedStages,
      stageProgress
    });

    // Update progress in database
    const updatedProgress = await prisma.materialProgress.upsert({
      where: {
        userId_materialId: {
          userId: parsedUserId,
          materialId: parsedMaterialId
        }
      },
      update: {
        progress: totalProgress,
        completed: totalProgress === 100,
        stageProgress: JSON.stringify(stageProgress),
        completedStages,
        activeStage: shouldMoveToNext ? nextStage : parsedStageIndex,
        lastAccessed: new Date()
      },
      create: {
        userId: parsedUserId,
        materialId: parsedMaterialId,
        progress: totalProgress,
        completed: totalProgress === 100,
        stageProgress: JSON.stringify(stageProgress),
        completedStages,
        activeStage: shouldMoveToNext ? nextStage : parsedStageIndex,
        lastAccessed: new Date()
      }
    });

    // Prepare response
    const response = {
      ...updatedProgress,
      stageProgress: JSON.parse(updatedProgress.stageProgress),
      completedStages: updatedProgress.completedStages
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error completing stage:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to complete stage',
      details: error.message
    });
  }
});

// Points check route
router.get('/:squadId/points/check/:userId/:materialId/:stageIndex', requireAuth, async (req, res) => {
  try {
    const { squadId, userId, materialId, stageIndex } = req.params;

    const existingPoints = await prisma.point.findFirst({
      where: {
        userId: parseInt(userId),
        materialId: parseInt(materialId),
        stageIndex: parseInt(stageIndex)
      }
    });

    res.json({
      exists: !!existingPoints
    });
  } catch (error) {
    console.error('Error checking points:', error);
    res.status(500).json({ error: 'Failed to check points' });
  }
});

// Points award route
router.post('/:squadId/points', requireAuth, async (req, res) => {
  try {
    const { userId, materialId, categoryId, value, stageIndex, isLastStage, remainderXP } = req.body;
    const squadId = parseInt(req.params.squadId);

    console.log('Points request:', {
      userId,
      materialId,
      categoryId,
      value,
      stageIndex,
      isLastStage,
      remainderXP,
      squadId
    });

    // Validate user is member of squad
    const member = await prisma.squadMember.findFirst({
      where: {
        squadId,
        userId: parseInt(userId)
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'User is not a member of this squad' });
    }

    // Check if points were already awarded for this stage
    const existingPoints = await prisma.point.findFirst({
      where: {
        userId: parseInt(userId),
        materialId: parseInt(materialId),
        stageIndex: parseInt(stageIndex)
      }
    });

    if (existingPoints) {
      console.log('Points already awarded for this stage:', existingPoints);
      return res.json({
        success: false,
        error: 'Points already awarded for this stage'
      });
    }

    // Get material to verify XP reward
    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
      include: {
        stages: true,
        category: true
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Ensure we have a valid categoryId
    const materialCategoryId = material.categoryId || categoryId;
    if (!materialCategoryId) {
      return res.status(400).json({ error: 'No category found for this material' });
    }

    // Calculate correct XP for this stage
    const totalXP = material.xp_reward || 0;
    const totalStages = material.stages.length;
    const baseXP = Math.floor(totalXP / totalStages);
    const finalXP = parseInt(stageIndex) === totalStages - 1 ? baseXP + (totalXP % totalStages) : baseXP;

    // Create point record with category
    const point = await prisma.point.create({
      data: {
        userId: parseInt(userId),
        materialId: parseInt(materialId),
        categoryId: parseInt(materialCategoryId),
        value: finalXP,
        stageIndex: parseInt(stageIndex)
      }
    });

    // Update user's total points
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        totalPoints: {
          increment: finalXP
        }
      }
    });

    console.log('Points awarded successfully:', {
      point,
      finalXP,
      stageIndex,
      categoryId: materialCategoryId
    });

    res.json({
      success: true,
      data: point
    });
  } catch (error) {
    console.error('Error creating points:', error);
    res.status(500).json({ error: 'Failed to create points' });
  }
});

// Make sure this is at the end of the file
module.exports = router;