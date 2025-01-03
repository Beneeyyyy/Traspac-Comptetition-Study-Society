const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pointController = {
  createPoint: async (req, res) => {
    try {
      const { userId, materialId, categoryId, subcategoryId, value } = req.body;

      // Validate required fields
      if (!userId || !materialId || !categoryId || !subcategoryId || !value) {
        console.error('Missing required fields:', { userId, materialId, categoryId, subcategoryId, value });
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      try {
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

        return res.status(201).json({
          success: true,
          data: {
            point,
            user: {
              id: user.id,
              totalPoints: user.totalPoints,
              totalXP: user.totalXP
            }
          }
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          success: false,
          error: 'Database error',
          details: dbError.message
        });
      }

    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error',
        details: error.message
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
        }
      });

      return res.json({
        success: true,
        data: points
      });
    } catch (error) {
      console.error('Error getting points:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get points',
        details: error.message
      });
    }
  }
};

module.exports = pointController; 