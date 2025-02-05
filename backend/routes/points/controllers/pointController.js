const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pointController = {
  createPoint: async (req, res) => {
    try {
      const { userId, materialId, value, stageIndex } = req.body;
      
      console.log('Creating point:', { userId, materialId, stageIndex });

      // 1. Check if point already exists for this stage
      const existingPoint = await prisma.point.findFirst({
        where: {
          userId: parseInt(userId),
          materialId: parseInt(materialId),
          stageIndex: parseInt(stageIndex)
        }
      });

      // 2. If point exists, return error
      if (existingPoint) {
        console.log('Point already exists for stage:', stageIndex);
        return res.status(400).json({
          success: false,
          message: 'Points already awarded for this stage'
        });
      }

      // 3. Get material with category info
      const material = await prisma.material.findUnique({
        where: { id: parseInt(materialId) },
        include: {
          category: true,
          subcategory: {
            include: {
              category: true
            }
          }
        }
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Material not found'
        });
      }

      // Get the correct categoryId and subcategoryId
      const materialCategoryId = material.categoryId || material.subcategory?.categoryId;
      const materialSubcategoryId = material.subcategoryId;

      if (!materialCategoryId) {
        return res.status(400).json({
          success: false,
          message: 'No category found for this material'
        });
      }

      // Prepare point data
      const pointData = {
        value: parseInt(value),
        stageIndex: parseInt(stageIndex),
        user: {
          connect: { id: parseInt(userId) }
        },
        material: {
          connect: { id: parseInt(materialId) }
        },
        category: {
          connect: { id: materialCategoryId }
        }
      };

      // Only add subcategory connection if materialSubcategoryId exists
      if (materialSubcategoryId) {
        pointData.subcategory = {
          connect: { id: materialSubcategoryId }
        };
      }

      // Create point
      const point = await prisma.point.create({
        data: pointData,
        include: {
          user: true,
          material: true,
          category: true,
          subcategory: true
        }
      });

      // 4. Update user's total points
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          totalPoints: {
            increment: parseInt(value)
          }
        }
      });

      console.log('Point created successfully:', point);

      return res.status(201).json({
        success: true,
        message: 'Point created successfully',
        point: point
      });

    } catch (error) {
      console.error('Error creating point:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create point',
        error: error.message
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
  },

  getMaterialPoints: async (req, res) => {
    const { materialId, userId } = req.params;

    try {
      console.log('Fetching points for:', { materialId, userId });

      // Parse ID ke integer
      const parsedMaterialId = parseInt(materialId);
      const parsedUserId = parseInt(userId);

      // Cek apakah ID valid
      if (isNaN(parsedMaterialId) || isNaN(parsedUserId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid materialId or userId'
        });
      }

      const points = await prisma.point.findMany({
        where: {
          materialId: parsedMaterialId,
          userId: parsedUserId
        }
      });

      const total = points.reduce((sum, point) => sum + point.value, 0);

      console.log('Found points:', { points, total });

      return res.json({
        success: true,
        total: total,
        points: points,
        completedStages: points.map(p => p.stageIndex)
      });

    } catch (error) {
      console.error('Error in getMaterialPoints:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const { timeframe, scope } = req.params;
      
      // For all-time, use totalPoints from user table
      if (timeframe === 'all') {
        // Build where clause based on scope
        const whereClause = {
          role: 'user',  // Only get students
          ...(scope && scope !== 'national' ? {
            school: {
              province: scope
            }
          } : {})
        };

        console.log('All-time leaderboard where clause:', whereClause);

        const users = await prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            image: true,
            totalPoints: true,
            totalStudyTime: true,
            completedMaterials: true,
            school: {
              select: {
                id: true,
                name: true,
                image: true,
                city: true,
                province: true
              }
            }
          },
          orderBy: {
            totalPoints: 'desc'
          },
          take: 10
        });

        console.log('All-time leaderboard users found:', users.length);

        const leaderboardWithDetails = users.map(user => {
          // Format study time
          const hours = Math.floor(user.totalStudyTime / 60);
          const minutes = user.totalStudyTime % 60;
          const timeSpent = `${hours}h ${minutes}m`;

          return {
            userId: user.id,
            user: user.name,
            points: user.totalPoints,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
            timeSpent,
            coursesCount: user.completedMaterials,
            school: {
              name: user.school?.name || 'Unknown School',
              image: user.school?.image || `https://ui-avatars.com/api/?name=School&background=0D8ABC&color=fff`,
              city: user.school?.city || 'Unknown City',
              province: user.school?.province || 'Unknown Region'
            }
          };
        });

        return res.json({
          success: true,
          data: leaderboardWithDetails
        });
      }

      // Calculate date range for weekly rankings
      const now = new Date();
      let startDate = new Date();
      
      if (timeframe === 'weekly') {
        // Set to start of current week (Sunday)
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid timeframe. Use: weekly or all'
        });
      }

      // For weekly, use points table to sum points within the timeframe
      const leaderboard = await prisma.point.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        _sum: {
          value: true
        },
        orderBy: {
          _sum: {
            value: 'desc'
          }
        },
        take: 10
      });

      console.log('Weekly leaderboard query result:', leaderboard);

      // Get user details for each leaderboard entry
      const leaderboardWithDetails = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await prisma.user.findUnique({
            where: { id: entry.userId },
            select: {
              id: true,
              name: true,
              image: true,
              totalStudyTime: true,
              completedMaterials: true,
              school: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  city: true,
                  province: true
                }
              }
            }
          });

          if (!user) {
            console.log('User not found for entry:', entry);
            return null;
          }

          // For now, use totalStudyTime as we don't have weekly study time
          const hours = Math.floor(user.totalStudyTime / 60);
          const minutes = user.totalStudyTime % 60;
          const timeSpent = `${hours}h ${minutes}m`;

          return {
            userId: entry.userId,
            user: user.name,
            points: entry._sum.value || 0,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
            timeSpent,
            coursesCount: user.completedMaterials || 0,
            school: {
              name: user.school?.name || 'Unknown School',
              image: user.school?.image || `https://ui-avatars.com/api/?name=School&background=0D8ABC&color=fff`,
              city: user.school?.city || 'Unknown City',
              province: user.school?.province || 'Unknown Region'
            }
          };
        })
      );

      // Filter out null entries (users not found)
      const filteredLeaderboard = leaderboardWithDetails.filter(entry => entry !== null);

      console.log('Weekly leaderboard response:', filteredLeaderboard);

      return res.json({
        success: true,
        data: filteredLeaderboard
      });

    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get leaderboard',
        details: error.message
      });
    }
  },

  getLeaderboardByScope: async (req, res) => {
    try {
      const { timeframe, scope } = req.params;
      
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate = new Date();
      
      switch(timeframe) {
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'all-time':
          startDate = new Date(0);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid timeframe. Use: weekly, monthly, or all-time'
          });
      }

      // Build where clause based on scope
      let whereClause = {
        createdAt: {
          gte: startDate,
          lte: now
        }
      };

      if (scope !== 'national') {
        // Add region/province filtering
        whereClause = {
          ...whereClause,
          user: {
            school: {
              province: scope
            }
          }
        };
      }

      const leaderboard = await prisma.point.groupBy({
        by: ['userId'],
        where: whereClause,
        _sum: {
          value: true
        },
        orderBy: {
          _sum: {
            value: 'desc'
          }
        },
        take: 10
      });

      // Get user details for each leaderboard entry
      const leaderboardWithDetails = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await prisma.user.findUnique({
            where: { id: entry.userId },
            select: {
              id: true,
              name: true,
              image: true,
              school: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  city: true,
                  province: true
                }
              },
              totalStudyTime: true,
              completedMaterials: true
            }
          });

          // Format study time
          const hours = Math.floor(user.totalStudyTime / 60);
          const minutes = user.totalStudyTime % 60;
          const timeSpent = `${hours}h ${minutes}m`;

          return {
            userId: entry.userId,
            user: user.name,
            points: entry._sum.value,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
            timeSpent,
            coursesCount: user.completedMaterials,
            school: {
              name: user.school?.name || 'Unknown School',
              image: user.school?.image || `https://ui-avatars.com/api/?name=School&background=0D8ABC&color=fff`,
              city: user.school?.city || 'Unknown City',
              province: user.school?.province || 'Unknown Region'
            }
          };
        })
      );

      return res.json({
        success: true,
        data: leaderboardWithDetails
      });
    } catch (error) {
      console.error('Error in getLeaderboardByScope:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard',
        details: error.message
      });
    }
  },

  getSchoolRankings: async (req, res) => {
    try {
      const { scope } = req.query;

      // Build where clause based on scope
      const whereClause = scope && scope !== 'national' 
        ? { province: scope }
        : {};

      // Get all schools with their students
      const schoolsWithPoints = await prisma.school.findMany({
        where: whereClause,
        include: {
          students: {
            select: {
              id: true,
              name: true,
              totalStudyTime: true,
              completedMaterials: true
            }
          }
        }
      });

      // Calculate total points per school
      const rankings = await Promise.all(
        schoolsWithPoints.map(async (school) => {
          const studentIds = school.students.map(student => student.id);
          
          // Get total points for all students in this school
          const totalPoints = await prisma.point.aggregate({
            where: {
              userId: { in: studentIds }
            },
            _sum: {
              value: true
            }
          });

          // Calculate school statistics
          const totalStudyTime = school.students.reduce((sum, student) => sum + student.totalStudyTime, 0);
          const totalCompletedMaterials = school.students.reduce((sum, student) => sum + student.completedMaterials, 0);
          const averageStudyTime = Math.round(totalStudyTime / school.students.length || 0);
          
          return {
            schoolId: school.id,
            name: school.name,
            city: school.city,
            province: school.province,
            totalPoints: totalPoints._sum.value || 0,
            studentCount: school.students.length,
            averagePoints: Math.round((totalPoints._sum.value || 0) / (school.students.length || 1)),
            totalStudyTime: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
            averageStudyTime: `${Math.floor(averageStudyTime / 60)}h ${averageStudyTime % 60}m`,
            totalCompletedMaterials,
            averageCompletedMaterials: Math.round(totalCompletedMaterials / (school.students.length || 1))
          };
        })
      );

      // Sort schools by total points
      const sortedRankings = rankings.sort((a, b) => b.totalPoints - a.totalPoints);

      return res.json({
        success: true,
        data: sortedRankings
      });
    } catch (error) {
      console.error('Error in getSchoolRankings:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch school rankings',
        details: error.message
      });
    }
  },

  recalculateUserPoints: async (req, res) => {
    try {
      // Get all users
      const users = await prisma.user.findMany({
        where: {
          role: 'user'
        },
        select: {
          id: true,
          name: true
        }
      });

      // Update each user's totalPoints
      const updates = await Promise.all(
        users.map(async (user) => {
          // Get sum of all points for this user
          const pointsSum = await prisma.point.aggregate({
            where: {
              userId: user.id
            },
            _sum: {
              value: true
            }
          });

          // Update user's totalPoints
          return prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              totalPoints: pointsSum._sum.value || 0
            }
          });
        })
      );

      return res.json({
        success: true,
        message: `Updated totalPoints for ${updates.length} users`,
        data: updates
      });
    } catch (error) {
      console.error('Error recalculating points:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to recalculate points',
        details: error.message
      });
    }
  },

  checkStagePoints: async (req, res) => {
    const { userId, materialId, stageIndex } = req.params;

    try {
      console.log('Checking points for:', { userId, materialId, stageIndex });

      // Parse parameters to integers
      const parsedUserId = parseInt(userId);
      const parsedMaterialId = parseInt(materialId);
      const parsedStageIndex = parseInt(stageIndex);

      // Find any existing points for this user, material, and stage
      const existingPoints = await prisma.point.findFirst({
        where: {
          AND: [
            { userId: parsedUserId },
            { materialId: parsedMaterialId },
            { stageIndex: parsedStageIndex }
          ]
        }
      });

      console.log('Existing points found:', existingPoints);

      return res.json({
        success: true,
        hasPoints: !!existingPoints,
        points: existingPoints
      });
    } catch (error) {
      console.error('Error checking points:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to check points',
        details: error.message
      });
    }
  }
};

module.exports = pointController; 