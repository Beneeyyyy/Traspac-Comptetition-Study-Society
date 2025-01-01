const { PrismaClient } = require('@prisma/client');
const { createNotification } = require('../helpers/notificationHelper');
const { calculateLevel, calculateRank } = require('../helpers/levelHelper');
const prisma = new PrismaClient();

const progressController = {
  // Get progress for specific material
  getMaterialProgress: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      console.log(`Fetching progress for user ${userId} and material ${materialId}`);
      
      const progress = await prisma.materialProgress.findUnique({
        where: {
          userId_materialId: {
            userId: parseInt(userId),
            materialId: parseInt(materialId)
          }
        },
        include: {
          material: {
            select: {
              title: true,
              xp_reward: true,
              estimated_time: true,
              stages: {
                select: {
                  id: true,
                  title: true,
                  order: true,
                  contents: true
                }
              }
            }
          }
        }
      });

      // If no progress found, create new one
      if (!progress) {
        console.log('No progress found, creating initial progress');
        const newProgress = await prisma.materialProgress.create({
          data: {
            userId: parseInt(userId),
            materialId: parseInt(materialId),
            progress: 0,
            completed: false,
            lastAccessed: new Date()
          },
          include: {
            material: {
              select: {
                title: true,
                xp_reward: true,
                estimated_time: true,
                stages: {
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    contents: true
                  }
                }
              }
            }
          }
        });

        return res.json({
          success: true,
          data: newProgress,
          message: 'Initial progress created'
        });
      }

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error in getMaterialProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get material progress',
        message: error.message
      });
    }
  },

  // Update progress for specific material
  updateProgress: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      const { progress, completed } = req.body;
      console.log(`Updating progress for user ${userId} and material ${materialId}`, {
        progress, completed
      });

      // Update progress
      const updatedProgress = await prisma.materialProgress.upsert({
        where: {
          userId_materialId: {
            userId: parseInt(userId),
            materialId: parseInt(materialId)
          }
        },
        update: {
          progress: parseFloat(progress),
          completed,
          lastAccessed: new Date()
        },
        create: {
          userId: parseInt(userId),
          materialId: parseInt(materialId),
          progress: parseFloat(progress),
          completed,
          lastAccessed: new Date()
        }
      });

      // If material is completed, update user stats and points
      if (completed) {
        // Get material details
        const material = await prisma.material.findUnique({
          where: { id: parseInt(materialId) },
          include: {
            subcategory: true
          }
        });

        // Get user's current data
        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
          select: {
            lastStudyDate: true,
            studyStreak: true,
            totalXP: true,
            level: true,
            rank: true
          }
        });

        // Calculate new XP and level
        const newTotalXP = user.totalXP + material.xp_reward;
        const levelInfo = calculateLevel(newTotalXP);
        const newRank = calculateRank(levelInfo.level);

        // Create XP notification
        await createNotification(userId, 'XP_EARNED', 
          `Selamat! Anda mendapatkan ${material.xp_reward} XP dari materi "${material.title}"`,
          { xp: material.xp_reward, materialTitle: material.title }
        );

        // Check level up
        if (levelInfo.level > user.level) {
          await createNotification(userId, 'LEVEL_UP',
            `Selamat! Anda naik ke Level ${levelInfo.level}`,
            { oldLevel: user.level, newLevel: levelInfo.level }
          );
        }

        // Check rank change
        if (newRank !== user.rank) {
          await createNotification(userId, 'RANK_UP',
            `Selamat! Anda naik ke rank ${newRank}`,
            { oldRank: user.rank, newRank: newRank }
          );
        }

        // Calculate streak
        const now = new Date();
        const lastStudy = user.lastStudyDate;
        let newStreak = user.studyStreak;

        if (lastStudy) {
          const lastStudyDay = new Date(lastStudy).setHours(0, 0, 0, 0);
          const today = new Date(now).setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today - lastStudyDay) / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            newStreak = 1;
          } else if (diffDays === 1) {
            newStreak += 1;
            // Notifikasi untuk streak baru
            await createNotification(userId, 'STREAK_UPDATE',
              `Hebat! Anda telah belajar ${newStreak} hari berturut-turut!`,
              { streak: newStreak }
            );
          }
        } else {
          newStreak = 1;
          await createNotification(userId, 'STREAK_START',
            'Selamat datang! Anda telah memulai streak belajar!',
            { streak: 1 }
          );
        }

        // Update user stats
        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: {
            totalXP: newTotalXP,
            level: levelInfo.level,
            rank: newRank,
            completedMaterials: { increment: 1 },
            lastStudyDate: now,
            studyStreak: newStreak,
            weeklyStudyTime: { increment: material.estimated_time },
            monthlyStudyTime: { increment: material.estimated_time },
            totalStudyTime: { increment: material.estimated_time }
          }
        });

        // Create point record
        await prisma.point.create({
          data: {
            userId: parseInt(userId),
            materialId: parseInt(materialId),
            value: material.xp_reward,
            categoryId: material.subcategory.categoryId,
            subcategoryId: material.subcategoryId
          }
        });

        console.log(`Updated stats and created points for user ${userId}, new level: ${levelInfo.level}, new rank: ${newRank}`);
      }

      res.json({
        success: true,
        data: updatedProgress,
        message: completed ? 'Progress updated and rewards given' : 'Progress updated'
      });
    } catch (error) {
      console.error('Error in updateProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update progress',
        message: error.message
      });
    }
  },

  // Get all progress for a user
  getUserProgress: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(`Fetching all progress for user ${userId}`);

      const progress = await prisma.materialProgress.findMany({
        where: {
          userId: parseInt(userId)
        },
        include: {
          material: {
            select: {
              title: true,
              xp_reward: true,
              estimated_time: true,
              subcategoryId: true,
              subcategory: {
                select: {
                  name: true,
                  categoryId: true,
                  category: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          lastAccessed: 'desc'
        }
      });

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user progress',
        message: error.message
      });
    }
  },

  // Get user stats
  getUserStats: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(`Fetching stats for user ${userId}`);

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          totalXP: true,
          rank: true,
          level: true,
          studyStreak: true,
          lastStudyDate: true,
          weeklyStudyTime: true,
          monthlyStudyTime: true,
          totalStudyTime: true,
          completedMaterials: true,
          completedQuizzes: true,
          completedCourses: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get level info
      const levelInfo = calculateLevel(user.totalXP);

      // Add level info to response
      const userStats = {
        ...user,
        nextLevelXP: levelInfo.nextLevelXP,
        currentLevelXP: levelInfo.currentLevelXP,
        xpNeededForNext: levelInfo.xpNeededForNext
      };

      res.json({
        success: true,
        data: userStats
      });
    } catch (error) {
      console.error('Error in getUserStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user stats',
        message: error.message
      });
    }
  }
};

module.exports = progressController; 