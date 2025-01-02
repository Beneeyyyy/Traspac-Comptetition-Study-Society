const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pointController = {
  createPoint: async (req, res) => {
    try {
      const { userId, materialId, categoryId, subcategoryId, value, stageIndex } = req.body;

      console.log('📝 Create Point Request:', {
        userId,
        materialId,
        categoryId,
        subcategoryId,
        value,
        stageIndex
      });

      // Validate required fields
      if (!userId || !materialId || !categoryId || !subcategoryId || !value) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          requiredFields: ['userId', 'materialId', 'categoryId', 'subcategoryId', 'value']
        });
      }

      // Create point record
      const point = await prisma.point.create({
        data: {
          userId: parseInt(userId),
          materialId: parseInt(materialId),
          categoryId: parseInt(categoryId),
          subcategoryId: parseInt(subcategoryId),
          value: parseInt(value)
        }
      });

      // Update user's total points
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          totalPoints: {
            increment: parseInt(value)
          },
          totalXP: {
            increment: parseInt(value)
          }
        }
      });

      console.log('✅ Point created:', {
        pointId: point.id,
        value: point.value,
        userId: point.userId,
        newTotalPoints: user.totalPoints
      });

      res.json({
        success: true,
        data: {
          point,
          user: {
            totalPoints: user.totalPoints,
            totalXP: user.totalXP
          }
        }
      });
    } catch (error) {
      console.error('❌ Error creating point:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create point',
        message: error.message
      });
    }
  },

  getUserPoints: async (req, res) => {
    try {
      const { userId } = req.params;

      const points = await prisma.point.findMany({
        where: {
          userId: parseInt(userId)
        },
        include: {
          material: true,
          category: true,
          subcategory: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: points
      });
    } catch (error) {
      console.error('❌ Error getting user points:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user points',
        message: error.message
      });
    }
  }
};

module.exports = pointController; 