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
  },

  getMaterialPoints: async (req, res) => {
    const { materialId, userId } = req.params;

    try {
      console.log('Fetching points for:', { materialId, userId });

      // Validasi input
      if (!materialId || !userId) {
        return res.status(400).json({
          success: false,
          error: 'Missing materialId or userId'
        });
      }

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
        },
        select: {
          id: true,
          value: true,
          materialId: true,
          userId: true,
          createdAt: true
        }
      });

      console.log('Found points:', points);

      // Selalu kembalikan response sukses
      return res.json({
        success: true,
        points: points || [],
        total: points ? points.reduce((sum, point) => sum + point.value, 0) : 0
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
      const { timeframe } = req.params;
      
      // For all-time, use totalPoints from user table
      if (timeframe === 'all') {
        const users = await prisma.user.findMany({
          where: {
            role: 'user'  // Only get students
          },
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
  }
};

module.exports = pointController; 