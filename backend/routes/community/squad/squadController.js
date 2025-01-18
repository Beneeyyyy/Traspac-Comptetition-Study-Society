const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../utils/uploadImage');

// Create squad
const createSquad = async (req, res) => {
  try {
    console.log('\n=== CREATE SQUAD CONTROLLER START ===');
    
    // 1. Validate request
    console.log('1. Validating request data...');
    const { name, description, isPublic, image, banner } = req.body;
    const userId = req.user?.id;

    console.log('Request data:', {
      name,
      description,
      isPublic: String(isPublic),
      userId,
      hasImage: !!image,
      hasBanner: !!banner
    });

    if (!name || !description) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name and description are required' });
    }

    if (!userId) {
      console.log('No user ID found');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // 2. Handle image uploads
    console.log('\n2. Processing image uploads...');
    let imageUrl = null;
    let bannerUrl = null;

    if (image) {
      console.log('2.1 Uploading squad image...');
      try {
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        console.error('Upload error details:', {
          name: uploadError.name,
          message: uploadError.message,
          stack: uploadError.stack
        });
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    if (banner) {
      console.log('2.2 Uploading squad banner...');
      try {
        bannerUrl = await uploadImage(banner);
        console.log('Banner uploaded successfully:', bannerUrl);
      } catch (uploadError) {
        console.error('Error uploading banner:', uploadError);
        console.error('Upload error details:', {
          name: uploadError.name,
          message: uploadError.message,
          stack: uploadError.stack
        });
        return res.status(500).json({ error: 'Failed to upload banner' });
      }
    }

    // 3. Create squad in database
    console.log('\n3. Creating squad in database...');
    const squadData = {
      name,
      description,
      image: imageUrl,
      banner: bannerUrl,
      isPublic: isPublic === true || isPublic === 'true',
      memberCount: 1,
      members: {
        create: {
          userId,
          role: 'admin'
        }
      }
    };

    console.log('3.1 Prisma create data:', JSON.stringify(squadData, null, 2));

    try {
      const squad = await prisma.squad.create({
        data: squadData,
        include: {
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
          _count: {
            select: {
              members: true,
              materials: true,
              discussions: true
            }
          }
        }
      });

      console.log('\n3.2 Squad created successfully:', JSON.stringify(squad, null, 2));

      // 4. Transform and send response
      const transformedSquad = {
        ...squad,
        isMember: true,
        role: 'admin',
        memberCount: squad._count.members,
        materialsCount: squad._count.materials,
        discussionsCount: squad._count.discussions
      };

      console.log('\n4. Sending response:', JSON.stringify(transformedSquad, null, 2));
      console.log('=== CREATE SQUAD CONTROLLER END ===\n');
      
      res.json(transformedSquad);
    } catch (dbError) {
      console.error('\n=== DATABASE ERROR ===');
      console.error('Error type:', dbError.constructor.name);
      console.error('Error message:', dbError.message);
      console.error('Error code:', dbError.code);
      console.error('Error meta:', dbError.meta);
      console.error('Stack:', dbError.stack);
      throw dbError;
    }
  } catch (error) {
    console.error('\n=== CREATE SQUAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

// Get all squads with filters
const getSquads = async (req, res) => {
  try {
    const { search, isPublic } = req.query;
    const userId = req.user.id;
    
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    const squads = await prisma.squad.findMany({
      where,
      include: {
        members: {
          where: { userId },
          select: { role: true }
        },
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to include isMember
    const transformedSquads = squads.map(squad => ({
      ...squad,
      isMember: squad.members.length > 0,
      role: squad.members[0]?.role || null,
      members: undefined // Remove members array
    }));

    res.json(transformedSquads);
  } catch (error) {
    console.error('Error fetching squads:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get squad by ID
const getSquadById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const squad = await prisma.squad.findUnique({
      where: { id: parseInt(id) },
      include: {
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
          include: {
            stages: true
          }
        },
        discussions: {
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    // Check if user is a member
    const isMember = squad.members.some(member => member.userId === userId);
    const userRole = squad.members.find(member => member.userId === userId)?.role;

    res.json({
      ...squad,
      isMember,
      userRole
    });
  } catch (error) {
    console.error('Error fetching squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update squad
const updateSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    
    const updateData = {
      name,
      description,
      isPublic: isPublic === 'true'
    };

    // Upload new images to Cloudinary if provided
    if (req.files?.image) {
      const imageResult = await uploadImage(req.files.image[0]);
      updateData.image = imageResult.secure_url;
    }

    if (req.files?.banner) {
      const bannerResult = await uploadImage(req.files.banner[0]);
      updateData.banner = bannerResult.secure_url;
    }

    const squad = await prisma.squad.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
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
        }
      }
    });

    res.json(squad);
  } catch (error) {
    console.error('Error updating squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete squad
const deleteSquad = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.squad.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Squad deleted successfully' });
  } catch (error) {
    console.error('Error deleting squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Join squad
const joinSquad = async (req, res) => {
  try {
    console.log('\n=== JOIN SQUAD CONTROLLER START ===');
    const squadId = parseInt(req.params.id);
    const userId = req.user?.id;

    console.log('Request data:', { squadId, userId });

    // 1. Validate request
    if (!userId) {
      console.log('No user ID found');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // 2. Check if squad exists
    console.log('\n2. Checking if squad exists...');
    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        members: {
          where: { userId },
          select: { role: true }
        }
      }
    });

    if (!squad) {
      console.log('Squad not found');
      return res.status(404).json({ error: 'Squad not found' });
    }

    // 3. Check if user is already a member
    console.log('\n3. Checking if user is already a member...');
    if (squad.members.length > 0) {
      console.log('User is already a member');
      return res.status(400).json({ error: 'You are already a member of this squad' });
    }

    // 4. Create squad member and update member count
    console.log('\n4. Creating squad member and updating count...');
    const [squadMember] = await prisma.$transaction([
      // Create squad member
      prisma.squadMember.create({
        data: {
          squadId,
          userId,
          role: 'member'
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
      }),
      // Increment member count
      prisma.squad.update({
        where: { id: squadId },
        data: {
          memberCount: {
            increment: 1
          }
        }
      })
    ]);

    console.log('\n5. Squad member created:', JSON.stringify(squadMember, null, 2));
    console.log('=== JOIN SQUAD CONTROLLER END ===\n');

    res.json({
      message: 'Successfully joined squad',
      member: squadMember
    });

  } catch (error) {
    console.error('\n=== JOIN SQUAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

// Leave squad
const leaveSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.squadMember.delete({
      where: {
        squadId_userId: {
          squadId: parseInt(id),
          userId
        }
      }
    });

    // Update member count
    await prisma.squad.update({
      where: { id: parseInt(id) },
      data: {
        memberCount: {
          decrement: 1
        }
      }
    });

    res.json({ message: 'Left squad successfully' });
  } catch (error) {
    console.error('Error leaving squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update member role
const updateMemberRole = async (req, res) => {
  try {
    const { squadId, userId } = req.params;
    const { role } = req.body;

    const member = await prisma.squadMember.update({
      where: {
        squadId_userId: {
          squadId: parseInt(squadId),
          userId: parseInt(userId)
        }
      },
      data: { role }
    });

    res.json(member);
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete all squads (admin only)
const deleteAllSquads = async (req, res) => {
  try {
    console.log('\n=== DELETING ALL SQUADS ===');
    
    // First delete all squad members
    await prisma.squadMember.deleteMany({});
    console.log('Deleted all squad members');
    
    // Then delete all squads
    await prisma.squad.deleteMany({});
    console.log('Deleted all squads');
    
    console.log('=== ALL SQUADS DELETED ===\n');
    res.json({ message: 'All squads deleted successfully' });
  } catch (error) {
    console.error('Error deleting all squads:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSquad,
  getSquads,
  getSquadById,
  updateSquad,
  deleteSquad,
  joinSquad,
  leaveSquad,
  updateMemberRole,
  deleteAllSquads
}; 