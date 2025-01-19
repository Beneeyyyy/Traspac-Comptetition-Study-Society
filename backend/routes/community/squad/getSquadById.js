const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSquadById = async (req, res) => {
  try {
    console.log('getSquadById called with params:', req.params);
    const { id } = req.params;
    const userId = req.user.id;

    console.log('Finding squad with id:', id);
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

    console.log('Squad found:', squad.name);
    const member = squad.members.find(m => m.user.id === userId);
    const transformedSquad = {
      ...squad,
      isMember: !!member,
      role: member?.role || null,
      memberCount: squad._count.members,
      materialsCount: squad._count.materials,
      discussionsCount: squad._count.discussions
    };

    console.log('Sending transformed squad');
    res.json(transformedSquad);
  } catch (error) {
    console.error('Error in getSquadById:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getSquadById; 