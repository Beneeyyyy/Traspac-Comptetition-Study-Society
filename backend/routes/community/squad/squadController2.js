const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('\n=== SQUAD CONTROLLER 2: INITIALIZING ===');

// Get squad by ID
const getSquadById = async (req, res) => {
  try {
    console.log('\n=== GET SQUAD BY ID START ===');
    const { id } = req.params;
    const userId = req.user.id;

    console.log('Request params:', { id, userId });

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
      console.log('Squad not found');
      return res.status(404).json({ error: 'Squad not found' });
    }

    console.log('Found squad:', squad.name);

    // Check if user is a member
    const member = squad.members.find(m => m.user.id === userId);
    const isMember = !!member;
    const role = member?.role || null;

    // Transform response
    const transformedSquad = {
      ...squad,
      isMember,
      role,
      memberCount: squad._count.members,
      materialsCount: squad._count.materials,
      discussionsCount: squad._count.discussions
    };

    console.log('Transformed squad data:', {
      id: transformedSquad.id,
      name: transformedSquad.name,
      isMember,
      role,
      memberCount: transformedSquad.memberCount
    });

    console.log('=== GET SQUAD BY ID END ===\n');
    res.json(transformedSquad);
  } catch (error) {
    console.error('\n=== GET SQUAD BY ID ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: error.message });
  }
};

console.log('getSquadById function defined:', !!getSquadById);

module.exports = {
  getSquadById
};

console.log('=== SQUAD CONTROLLER 2: INITIALIZATION COMPLETE ===\n'); 