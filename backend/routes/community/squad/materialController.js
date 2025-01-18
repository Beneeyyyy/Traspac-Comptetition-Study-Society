const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create material for squad
const createSquadMaterial = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { title, description, image, xp_reward, estimated_time, glossary } = req.body;
    const userId = req.user.id;

    const material = await prisma.material.create({
      data: {
        title,
        description,
        image,
        xp_reward,
        estimated_time,
        glossary,
        type: 'squad',
        squadId: parseInt(squadId),
        is_published: true, // Squad materials are published by default
      },
      include: {
        stages: true,
        squad: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all materials for a squad
const getSquadMaterials = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { search, sort = 'newest' } = req.query;

    const where = {
      squadId: parseInt(squadId),
      type: 'squad'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = {};
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'xp':
        orderBy = { xp_reward: 'desc' };
        break;
      default: // newest
        orderBy = { createdAt: 'desc' };
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy,
      include: {
        stages: true,
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific material from squad
const getSquadMaterial = async (req, res) => {
  try {
    const { squadId, materialId } = req.params;
    const userId = req.user.id;

    const material = await prisma.material.findFirst({
      where: {
        id: parseInt(materialId),
        squadId: parseInt(squadId),
        type: 'squad'
      },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        },
        squad: {
          select: {
            name: true,
            image: true
          }
        },
        progress: {
          where: {
            userId
          }
        }
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Add progress information
    const hasProgress = material.progress.length > 0;
    const progress = hasProgress ? material.progress[0] : null;

    res.json({
      ...material,
      progress: progress ? {
        status: progress.status,
        completedAt: progress.completedAt,
        lastAccessedAt: progress.lastAccessedAt
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update squad material
const updateSquadMaterial = async (req, res) => {
  try {
    const { squadId, materialId } = req.params;
    const { title, description, image, xp_reward, estimated_time, glossary } = req.body;

    const material = await prisma.material.update({
      where: {
        id: parseInt(materialId),
        squadId: parseInt(squadId),
        type: 'squad'
      },
      data: {
        title,
        description,
        image,
        xp_reward,
        estimated_time,
        glossary
      },
      include: {
        stages: true
      }
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete squad material
const deleteSquadMaterial = async (req, res) => {
  try {
    const { squadId, materialId } = req.params;

    await prisma.material.delete({
      where: {
        id: parseInt(materialId),
        squadId: parseInt(squadId),
        type: 'squad'
      }
    });

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSquadMaterial,
  getSquadMaterials,
  getSquadMaterial,
  updateSquadMaterial,
  deleteSquadMaterial
}; 