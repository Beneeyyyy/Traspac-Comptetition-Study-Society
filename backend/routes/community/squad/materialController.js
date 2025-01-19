const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get squad materials
const getSquadMaterials = async (req, res) => {
  try {
    console.log('\n=== GET SQUAD MATERIALS START ===');
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

    const materials = await prisma.material.findMany({
      where: {
        squadId,
        type: "squad"
      },
      include: {
        stages: {
          orderBy: {
            order: "asc"
          }
        },
        progress: {
          where: {
            completed: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    console.log(`Found ${materials.length} materials`);

    // Transform data
    const transformedMaterials = materials.map(material => ({
      id: material.id,
      title: material.title,
      description: material.description,
      image: material.image,
      xp_reward: material.xp_reward,
      estimated_time: material.estimated_time,
      stages: material.stages,
      completionCount: material.progress.length,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt
    }));

    console.log('=== GET SQUAD MATERIALS END ===\n');
    res.json(transformedMaterials);
  } catch (error) {
    console.error('\n=== GET SQUAD MATERIALS ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

// Create squad material
const createSquadMaterial = async (req, res) => {
  try {
    console.log('\n=== CREATE SQUAD MATERIAL START ===');
    const squadId = parseInt(req.params.id);
    const { title, description, image, xp_reward, estimated_time, stages } = req.body;

    console.log('Creating material:', { squadId, title });

    const material = await prisma.material.create({
      data: {
        title,
        description,
        image,
        xp_reward,
        estimated_time,
        type: "squad",
        squad: {
          connect: { id: squadId }
        },
        stages: {
          create: stages.map((stage, index) => ({
            title: stage.title,
            order: index + 1,
            contents: stage.contents
          }))
        }
      },
      include: {
        stages: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    console.log('Material created:', material.id);
    console.log('=== CREATE SQUAD MATERIAL END ===\n');

    res.json({
      ...material,
      completionCount: 0
    });
  } catch (error) {
    console.error('\n=== CREATE SQUAD MATERIAL ERROR ===');
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
  getSquadMaterials,
  createSquadMaterial
}; 