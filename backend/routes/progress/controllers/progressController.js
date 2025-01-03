const { PrismaClient } = require('@prisma/client');
const { createNotification } = require('../helpers/notificationHelper');
const { calculateLevel, calculateRank } = require('../helpers/levelHelper');
const prisma = new PrismaClient();

const progressController = {
  // Get progress for specific material
  getMaterialProgress: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      console.log('📥 Get Progress Request:', { userId, materialId });

      const parsedUserId = parseInt(userId);
      const parsedMaterialId = parseInt(materialId);

      // Get material first to validate it exists
      const material = await prisma.material.findUnique({
        where: { id: parsedMaterialId },
        select: {
          id: true,
          title: true,
          xp_reward: true,
          stages: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      if (!material) {
        console.log('❌ Material not found:', materialId);
        return res.status(404).json({
          success: false,
          error: 'Material not found'
        });
      }

      console.log('📚 Material found:', {
        id: material.id,
        title: material.title,
        xp_reward: material.xp_reward,
        totalStages: material.stages.length
      });

      // Get progress
      const progress = await prisma.materialProgress.findUnique({
        where: {
          userId_materialId: {
            userId: parsedUserId,
            materialId: parsedMaterialId
          }
        }
      });

      console.log('🔍 Raw progress data from database:', progress);

      // If no progress found, return default values
      if (!progress) {
        const defaultResponse = {
          userId: parsedUserId,
          materialId: parsedMaterialId,
          progress: 0,
          completed: false,
          stageProgress: '{}',
          completedStages: [],
          activeStage: 0,
          lastAccessed: new Date()
        };
        console.log('📤 Sending default response:', defaultResponse);
        return res.json({
          success: true,
          data: defaultResponse
        });
      }

      // Prepare response data with proper parsing
      let parsedStageProgress;
      try {
        parsedStageProgress = progress.stageProgress ? JSON.parse(progress.stageProgress) : {};
      } catch (e) {
        console.warn('⚠️ Failed to parse stageProgress:', e);
        parsedStageProgress = {};
      }

      const responseData = {
        ...progress,
        stageProgress: parsedStageProgress,
        completedStages: Array.isArray(progress.completedStages) ? progress.completedStages : [],
        activeStage: typeof progress.activeStage === 'number' ? progress.activeStage : 0
      };

      console.log('📤 Sending formatted response:', {
        userId: responseData.userId,
        materialId: responseData.materialId,
        progress: responseData.progress,
        completed: responseData.completed,
        stageProgress: responseData.stageProgress,
        completedStages: responseData.completedStages,
        activeStage: responseData.activeStage,
        lastAccessed: responseData.lastAccessed
      });

      res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      console.error('❌ Error in getMaterialProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get material progress',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Update progress for specific material
  updateProgress: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      const { progress, completed, stageIndex, stageProgress, completedStages, activeStage } = req.body;
      
      // Log incoming data
      console.log('📝 Update Progress Request:', {
        userId, materialId, progress, completed, stageIndex,
        stageProgress, completedStages, activeStage,
        body: req.body
      });

      // Validate and convert data
      const parsedUserId = parseInt(userId);
      const parsedMaterialId = parseInt(materialId);
      const parsedProgress = parseFloat(progress);
      const parsedActiveStage = parseInt(activeStage) || 0;
      const parsedStageIndex = parseInt(stageIndex);
      
      // Convert stageProgress to JSON string if it's an object
      const parsedStageProgress = typeof stageProgress === 'object' 
        ? JSON.stringify(stageProgress)
        : '{}';
      
      // Ensure completedStages is an array of integers
      const parsedCompletedStages = Array.isArray(completedStages)
        ? completedStages.map(stage => parseInt(stage))
        : [];

      // Get material details first
      const material = await prisma.material.findUnique({
        where: { id: parsedMaterialId },
        include: {
          subcategory: {
            include: {
              category: true
            }
          },
          stages: true
        }
      });

      if (!material) {
        console.log('❌ Material not found:', materialId);
        return res.status(404).json({
          success: false,
          error: 'Material not found'
        });
      }

      if (!material.subcategory?.categoryId || !material.subcategoryId) {
        console.log('❌ Material is missing category or subcategory:', {
          categoryId: material.subcategory?.categoryId,
          subcategoryId: material.subcategoryId
        });
        return res.status(400).json({
          success: false,
          error: 'Material is missing required category information'
        });
      }

      console.log('📚 Material found:', {
        id: material.id,
        title: material.title,
        xp_reward: material.xp_reward,
        stages: material.stages.length,
        categoryId: material.subcategory.categoryId,
        subcategoryId: material.subcategoryId
      });

      // Calculate XP per stage
      const stageXP = Math.floor(material.xp_reward / material.stages.length);
      console.log('💰 XP per stage:', stageXP);

      try {
        // Start transaction
        const result = await prisma.$transaction(async (prisma) => {
          console.log('🔄 Starting transaction...');

          // Update progress
          const updatedProgress = await prisma.materialProgress.upsert({
            where: {
              userId_materialId: {
                userId: parsedUserId,
                materialId: parsedMaterialId
              }
            },
            update: {
              progress: parsedProgress,
              completed,
              lastAccessed: new Date(),
              stageProgress: parsedStageProgress,
              completedStages: parsedCompletedStages,
              activeStage: parsedActiveStage
            },
            create: {
              userId: parsedUserId,
              materialId: parsedMaterialId,
              progress: parsedProgress,
              completed,
              lastAccessed: new Date(),
              stageProgress: parsedStageProgress,
              completedStages: parsedCompletedStages,
              activeStage: parsedActiveStage
            }
          });

          console.log('✅ Progress updated:', updatedProgress);

          // Check if this stage was just completed (100% progress)
          const currentStageProgress = stageProgress?.[parsedStageIndex];
          const isStageCompleted = currentStageProgress === 100 && 
            !parsedCompletedStages.includes(parsedStageIndex);

          console.log('🔍 Stage completion check:', {
            stageIndex: parsedStageIndex,
            currentProgress: currentStageProgress,
            completedStages: parsedCompletedStages,
            isStageCompleted,
            currentTime: new Date().toISOString()
          });

          // Create point record for newly completed stage
          if (isStageCompleted) {
            // Calculate XP per stage
            const totalStages = material.stages.length;
            const stageXP = Math.floor(material.xp_reward / totalStages);
            
            console.log('🎯 Stage completion details:', {
              stageIndex: parsedStageIndex,
              materialId: parsedMaterialId,
              materialTitle: material.title,
              totalXPReward: material.xp_reward,
              totalStages,
              xpPerStage: stageXP,
              categoryId: material.subcategory.categoryId,
              subcategoryId: material.subcategoryId,
              currentTime: new Date().toISOString()
            });

            try {
              // Create point record
              const point = await prisma.point.create({
                data: {
                  userId: parsedUserId,
                  materialId: parsedMaterialId,
                  categoryId: material.subcategory.categoryId,
                  subcategoryId: material.subcategoryId,
                  value: stageXP,
                  createdAt: new Date() // Explicitly set creation time
                },
                include: {
                  material: true,
                  category: true,
                  subcategory: true
                }
              });

              console.log('💰 Point record created:', {
                pointId: point.id,
                value: point.value,
                userId: point.userId,
                materialId: point.materialId,
                materialTitle: point.material.title,
                categoryId: point.categoryId,
                categoryName: point.category.name,
                createdAt: point.createdAt,
                currentTime: new Date().toISOString()
              });

              // Update user's total points and XP
              const updatedUser = await prisma.user.update({
                where: { id: parsedUserId },
                data: {
                  totalPoints: {
                    increment: stageXP
                  },
                  totalXP: {
                    increment: stageXP
                  }
                }
              });

              console.log('👤 User stats updated:', {
                userId: updatedUser.id,
                totalPoints: updatedUser.totalPoints,
                totalXP: updatedUser.totalXP,
                addedXP: stageXP,
                currentTime: new Date().toISOString()
              });

              // Create notification for stage completion
              await createNotification(parsedUserId, 'XP_EARNED',
                `Selamat! Anda mendapatkan ${stageXP} XP dari stage ${parsedStageIndex + 1} materi "${material.title}"`,
                { xp: stageXP, materialTitle: material.title, stage: parsedStageIndex + 1 }
              );

              console.log('🔔 Notification created for stage completion');
            } catch (pointError) {
              console.error('❌ Error in point creation process:', {
                error: pointError.message,
                stack: pointError.stack,
                userId: parsedUserId,
                materialId: parsedMaterialId,
                stageXP,
                currentTime: new Date().toISOString()
              });
              throw new Error(`Failed to create point: ${pointError.message}`);
            }
          }

          return updatedProgress;
        });

        console.log('✅ Transaction completed successfully');

        // Prepare response data
        const responseData = {
          ...result,
          stageProgress: JSON.parse(result.stageProgress || '{}'),
          completedStages: result.completedStages || [],
          activeStage: result.activeStage || 0
        };

        console.log('📤 Sending response:', responseData);

        res.json({
          success: true,
          data: responseData
        });
      } catch (txError) {
        console.error('❌ Transaction failed:', txError);
        throw new Error(`Transaction failed: ${txError.message}`);
      }
    } catch (error) {
      console.error('❌ Error in updateProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update progress',
        message: error.message,
        details: error.stack
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