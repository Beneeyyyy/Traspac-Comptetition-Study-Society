const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new learning path
const createLearningPath = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { title, description, materialIds } = req.body;
    const userId = req.user.id;

    // Create learning path with initial materials
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        description,
        squad: { connect: { id: parseInt(squadId) } },
        createdBy: { connect: { id: userId } },
        materials: {
          connect: materialIds?.map(id => ({ id: parseInt(id) })) || []
        },
        order: materialIds || [] // Save initial order
      },
      include: {
        materials: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.json(learningPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
};

// Get all learning paths for a squad
const getSquadLearningPaths = async (req, res) => {
  try {
    const { squadId } = req.params;

    const learningPaths = await prisma.learningPath.findMany({
      where: {
        squadId: parseInt(squadId)
      },
      include: {
        materials: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(learningPaths);
  } catch (error) {
    console.error('Error getting learning paths:', error);
    res.status(500).json({ error: 'Failed to get learning paths' });
  }
};

// Get a specific learning path
const getLearningPath = async (req, res) => {
  try {
    const { squadId, pathId } = req.params;

    const learningPath = await prisma.learningPath.findFirst({
      where: {
        id: parseInt(pathId),
        squadId: parseInt(squadId)
      },
      include: {
        materials: {
          include: {
            stages: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    res.json(learningPath);
  } catch (error) {
    console.error('Error getting learning path:', error);
    res.status(500).json({ error: 'Failed to get learning path' });
  }
};

// Update a learning path
const updateLearningPath = async (req, res) => {
  try {
    const { squadId, pathId } = req.params;
    const { title, description, materialIds, order } = req.body;

    // First check if learning path exists
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        id: parseInt(pathId),
        squadId: parseInt(squadId)
      }
    });

    if (!existingPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Update learning path
    const updatedPath = await prisma.learningPath.update({
      where: {
        id: parseInt(pathId)
      },
      data: {
        title,
        description,
        materials: {
          set: materialIds?.map(id => ({ id: parseInt(id) })) || []
        },
        order: order || materialIds || [] // Update order if provided, fallback to materialIds
      },
      include: {
        materials: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.json(updatedPath);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
};

// Delete a learning path
const deleteLearningPath = async (req, res) => {
  try {
    const { squadId, pathId } = req.params;

    // First check if learning path exists
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        id: parseInt(pathId),
        squadId: parseInt(squadId)
      }
    });

    if (!existingPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Delete learning path
    await prisma.learningPath.delete({
      where: {
        id: parseInt(pathId)
      }
    });

    res.json({ message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
};

module.exports = {
  createLearningPath,
  getSquadLearningPaths,
  getLearningPath,
  updateLearningPath,
  deleteLearningPath
}; 