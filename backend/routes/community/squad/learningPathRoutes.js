const express = require('express');
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('../../../routes/usersManagement/controllers/authController');
const { checkSquadRole } = require('./squadMiddleware');

// Create a learning path
router.post('/', requireAuth, checkSquadRole(['ADMIN', 'MODERATOR']), async (req, res) => {
  const { squadId } = req.params;
  const { title, description, materialIds = [] } = req.body;
  const userId = req.user.id;

  try {
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        description,
        squad: { connect: { id: parseInt(squadId) } },
        createdBy: { connect: { id: userId } },
        materials: {
          connect: materialIds.map(id => ({ id: parseInt(id) }))
        },
        order: materialIds
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

    res.status(201).json(learningPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Get all learning paths for a squad
router.get('/', requireAuth, async (req, res) => {
  const { squadId } = req.params;

  try {
    const learningPaths = await prisma.learningPath.findMany({
      where: {
        squadId: parseInt(squadId)
      },
      include: {
        materials: {
          include: {
            stages: {
              orderBy: {
                order: 'asc'
              }
            },
            category: true
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

    // Transform stages to include properly formatted contents
    const transformedPaths = learningPaths.map(path => ({
      ...path,
      materials: path.materials.map(material => ({
        ...material,
        stages: material.stages.map(stage => {
          let contents = [];
          try {
            contents = stage.contents ? 
              (typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents) :
              (stage.content ? JSON.parse(stage.content) : []);
            
            if (!Array.isArray(contents)) {
              contents = [];
            }
            
            contents.sort((a, b) => (a.order || 0) - (b.order || 0));
          } catch (error) {
            console.error('Error parsing stage contents:', error);
            contents = [];
          }

          return {
            ...stage,
            contents
          };
        })
      }))
    }));

    console.log('Sending transformed learning paths:', transformedPaths.map(path => ({
      id: path.id,
      title: path.title,
      materialsCount: path.materials.length,
      materials: path.materials.map(m => ({
        id: m.id,
        title: m.title,
        stagesCount: m.stages.length
      }))
    })));

    res.json(transformedPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ 
      error: 'Failed to fetch learning paths',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get a specific learning path
router.get('/:pathId', requireAuth, async (req, res) => {
  const { squadId, pathId } = req.params;

  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: {
        id: parseInt(pathId)
      },
      include: {
        materials: {
          include: {
            stages: {
              orderBy: {
                order: 'asc'
              }
            },
            category: true
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

    // Transform stages to include properly formatted contents
    const transformedPath = {
      ...learningPath,
      materials: learningPath.materials.map(material => ({
        ...material,
        stages: material.stages.map(stage => {
          let contents = [];
          try {
            contents = stage.contents ? 
              (typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents) :
              (stage.content ? JSON.parse(stage.content) : []);
            
            if (!Array.isArray(contents)) {
              contents = [];
            }
            
            contents.sort((a, b) => (a.order || 0) - (b.order || 0));
          } catch (error) {
            console.error('Error parsing stage contents:', error);
            contents = [];
          }

          return {
            ...stage,
            contents
          };
        })
      }))
    };

    console.log('Sending transformed learning path:', {
      id: transformedPath.id,
      title: transformedPath.title,
      materialsCount: transformedPath.materials.length,
      materials: transformedPath.materials.map(m => ({
        id: m.id,
        title: m.title,
        stagesCount: m.stages.length
      }))
    });

    res.json(transformedPath);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ 
      error: 'Failed to fetch learning path',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update a learning path
router.put('/:pathId', requireAuth, checkSquadRole(['ADMIN', 'MODERATOR']), async (req, res) => {
  const { squadId, pathId } = req.params;
  const { title, description, materialIds = [], order } = req.body;

  try {
    const learningPath = await prisma.learningPath.update({
      where: {
        id: parseInt(pathId)
      },
      data: {
        title,
        description,
        materials: {
          set: materialIds.map(id => ({ id: parseInt(id) }))
        },
        order: order || materialIds
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

    res.json(learningPath);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
});

// Delete a learning path
router.delete('/:pathId', requireAuth, checkSquadRole(['ADMIN', 'MODERATOR']), async (req, res) => {
  const { pathId } = req.params;

  try {
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
});

module.exports = router; 