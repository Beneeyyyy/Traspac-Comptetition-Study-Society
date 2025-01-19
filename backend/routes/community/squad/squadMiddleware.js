const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Check if user is squad member
const isSquadMember = async (req, res, next) => {
  try {
    const squadId = parseInt(req.params.id || req.params.squadId);
    const userId = req.user.id;

    const member = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId,
          userId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'You are not a member of this squad' });
    }

    req.squadMember = member;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if user is squad admin
const isSquadAdmin = async (req, res, next) => {
  try {
    const squadId = parseInt(req.params.id || req.params.squadId);
    const userId = req.user.id;

    const member = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId,
          userId
        }
      }
    });

    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'You are not an admin of this squad' });
    }

    req.squadMember = member;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if user is squad moderator or admin
const isSquadModOrAdmin = async (req, res, next) => {
  try {
    const squadId = parseInt(req.params.id || req.params.squadId);
    const userId = req.user.id;

    const member = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId,
          userId
        }
      }
    });

    if (!member || (member.role !== 'admin' && member.role !== 'moderator')) {
      return res.status(403).json({ error: 'You need to be a moderator or admin to perform this action' });
    }

    req.squadMember = member;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if squad is public or user is member
const canViewSquad = async (req, res, next) => {
  try {
    const squadId = parseInt(req.params.id || req.params.squadId);
    const userId = req.user.id;

    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!squad) {
      return res.status(404).json({ error: 'Squad not found' });
    }

    if (!squad.isPublic && squad.members.length === 0) {
      return res.status(403).json({ error: 'This is a private squad' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to check if user has required role in squad
const checkSquadRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { squadId } = req.params;
      const userId = req.user.id;

      const member = await prisma.squadMember.findFirst({
        where: {
          squadId: parseInt(squadId),
          userId: userId,
          role: {
            in: allowedRoles
          }
        }
      });

      if (!member) {
        return res.status(403).json({ 
          error: 'You do not have permission to perform this action' 
        });
      }

      next();
    } catch (error) {
      console.error('Error checking squad role:', error);
      res.status(500).json({ error: 'Failed to verify permissions' });
    }
  };
};

module.exports = {
  isSquadMember,
  isSquadAdmin,
  isSquadModOrAdmin,
  canViewSquad,
  checkSquadRole
}; 