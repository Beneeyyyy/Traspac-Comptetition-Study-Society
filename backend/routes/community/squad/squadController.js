const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadImage = require('../../../utils/uploadImage');

// Get all squads with filters
exports.getSquads = async (req, res) => {
  try {
    const { search, isPublic, isMember } = req.query;
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

    if (isMember === 'true') {
      where.members = {
        some: { userId }
      };
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
      orderBy: { createdAt: 'desc' }
    });

    const transformedSquads = squads.map(squad => ({
      ...squad,
      isMember: squad.members.length > 0,
      role: squad.members[0]?.role || null,
      memberCount: squad._count.members,
      materialsCount: squad._count.materials,
      discussionsCount: squad._count.discussions,
      members: undefined
    }));

    res.json(transformedSquads);
  } catch (error) {
    console.error('Error fetching squads:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get squad by ID
exports.getSquadById = async (req, res) => {
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
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    const member = squad.members.find(m => m.user.id === userId);
    const transformedSquad = {
      ...squad,
      isMember: !!member,
      role: member?.role || null,
      memberCount: squad._count.members,
      materialsCount: squad._count.materials,
      discussionsCount: squad._count.discussions
    };

    res.json(transformedSquad);
  } catch (error) {
    console.error('Error fetching squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create squad
exports.createSquad = async (req, res) => {
  try {
    const { name, description, isPublic, image, banner } = req.body;
    const userId = req.user?.id;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let imageUrl = null;
    let bannerUrl = null;

    if (image) {
      imageUrl = await uploadImage(image);
    }
    if (banner) {
      bannerUrl = await uploadImage(banner);
    }

    const squad = await prisma.squad.create({
      data: {
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
      },
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

    res.json({
      ...squad,
      isMember: true,
      role: 'admin',
      memberCount: squad._count.members,
      materialsCount: squad._count.materials,
      discussionsCount: squad._count.discussions
    });
  } catch (error) {
    console.error('Error creating squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update squad
exports.updateSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic, image, banner } = req.body;
    const userId = req.user.id;

    const member = await prisma.squadMember.findFirst({
      where: {
        squadId: parseInt(id),
        userId,
        role: 'admin'
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Only squad admin can update squad' });
    }

    let imageUrl = image;
    let bannerUrl = banner;

    if (image && image.startsWith('data:')) {
      imageUrl = await uploadImage(image);
    }
    if (banner && banner.startsWith('data:')) {
      bannerUrl = await uploadImage(banner);
    }

    const updatedSquad = await prisma.squad.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        isPublic,
        image: imageUrl,
        banner: bannerUrl
      },
      include: {
        members: true,
        _count: {
          select: {
            members: true,
            materials: true,
            discussions: true
          }
        }
      }
    });

    res.json({
      ...updatedSquad,
      isMember: true,
      role: 'admin',
      memberCount: updatedSquad._count.members,
      materialsCount: updatedSquad._count.materials,
      discussionsCount: updatedSquad._count.discussions
    });
  } catch (error) {
    console.error('Error updating squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete squad
exports.deleteSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const member = await prisma.squadMember.findFirst({
      where: {
        squadId: parseInt(id),
        userId,
        role: 'admin'
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Only squad admin can delete squad' });
    }

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
exports.joinSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingMember = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId: parseInt(id),
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this squad' });
    }

    await prisma.squadMember.create({
      data: {
        squadId: parseInt(id),
        userId,
        role: 'member'
      }
    });

    await prisma.squad.update({
      where: { id: parseInt(id) },
      data: {
        memberCount: {
          increment: 1
        }
      }
    });

    res.json({ message: 'Joined squad successfully' });
  } catch (error) {
    console.error('Error joining squad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Leave squad
exports.leaveSquad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const member = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId: parseInt(id),
          userId
        }
      }
    });

    if (!member) {
      return res.status(400).json({ error: 'Not a member of this squad' });
    }

    if (member.role === 'admin') {
      return res.status(400).json({ error: 'Admin cannot leave squad' });
    }

    await prisma.squadMember.delete({
      where: {
        squadId_userId: {
          squadId: parseInt(id),
          userId
        }
      }
    });

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
exports.updateMemberRole = async (req, res) => {
  try {
    const { id, userId: targetUserId } = req.params;
    const { role } = req.body;
    const adminId = req.user.id;

    const admin = await prisma.squadMember.findFirst({
      where: {
        squadId: parseInt(id),
        userId: adminId,
        role: 'admin'
      }
    });

    if (!admin) {
      return res.status(403).json({ error: 'Only squad admin can update roles' });
    }

    await prisma.squadMember.update({
      where: {
        squadId_userId: {
          squadId: parseInt(id),
          userId: parseInt(targetUserId)
        }
      },
      data: { role }
    });

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ error: error.message });
  }
};

console.log('squadController loaded, functions:', Object.keys(exports));

module.exports = {
  getSquads,
  getSquadById,
  createSquad,
  updateSquad,
  deleteSquad,
  joinSquad,
  leaveSquad,
  updateMemberRole
}; 