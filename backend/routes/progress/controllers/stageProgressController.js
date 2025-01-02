const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stageProgressController = {
  // Get current progress for a material
  getCurrentProgress: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      console.log('📥 Get Progress Request:', { userId, materialId });

      const parsedUserId = parseInt(userId);
      const parsedMaterialId = parseInt(materialId);

      // Get material with its stages
      const material = await prisma.material.findUnique({
        where: { id: parsedMaterialId },
        include: {
          stages: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          error: 'Material not found'
        });
      }

      // Parse contents for each stage
      material.stages = material.stages.map(stage => ({
        ...stage,
        contents: typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents
      }));

      // Get or initialize progress
      const progress = await prisma.materialProgress.findUnique({
        where: {
          userId_materialId: {
            userId: parsedUserId,
            materialId: parsedMaterialId
          }
        }
      });

      // If no progress found, return initial state
      if (!progress) {
        const initialProgress = {
          userId: parsedUserId,
          materialId: parsedMaterialId,
          progress: 0,
          completed: false,
          stageProgress: {},
          completedStages: [],
          activeStage: 0,
          lastAccessed: new Date()
        };

        return res.json({
          success: true,
          data: {
            ...initialProgress,
            material
          }
        });
      }

      // Prepare response with parsed progress
      const responseData = {
        ...progress,
        stageProgress: progress.stageProgress ? JSON.parse(progress.stageProgress) : {},
        completedStages: progress.completedStages || [],
        activeStage: progress.activeStage || 0,
        material
      };

      console.log('📤 Sending response:', {
        progress: responseData.progress,
        stageProgress: responseData.stageProgress,
        completedStages: responseData.completedStages,
        activeStage: responseData.activeStage
      });

      res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      console.error('❌ Error getting progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get progress',
        message: error.message
      });
    }
  },

  // Complete a stage
  completeStage: async (req, res) => {
    try {
      const { userId, materialId } = req.params;
      const { stageIndex, contentIndex, contentProgress } = req.body;

      console.log('🔍 Debug - Request data:', {
        params: { userId, materialId },
        body: { stageIndex, contentIndex, contentProgress },
        rawBody: req.body
      });

      const parsedUserId = parseInt(userId);
      const parsedMaterialId = parseInt(materialId);
      const parsedStageIndex = parseInt(stageIndex);
      const parsedContentIndex = contentIndex !== undefined ? parseInt(contentIndex) : null;

      console.log('🔍 Debug - Parsed values:', {
        parsedUserId,
        parsedMaterialId,
        parsedStageIndex,
        parsedContentIndex,
        contentProgress
      });

      // Get material with stages
      const material = await prisma.material.findUnique({
        where: { id: parsedMaterialId },
        include: {
          stages: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });

      console.log('🔍 Debug - Found material:', {
        materialExists: !!material,
        stageCount: material?.stages?.length,
        materialId: material?.id
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          error: 'Material not found'
        });
      }

      // Validate stage index
      if (parsedStageIndex < 0 || parsedStageIndex >= material.stages.length) {
        return res.status(400).json({
          success: false,
          error: 'Invalid stage index'
        });
      }

      // Get current progress
      const currentProgress = await prisma.materialProgress.findUnique({
        where: {
          userId_materialId: {
            userId: parsedUserId,
            materialId: parsedMaterialId
          }
        }
      });

      console.log('🔍 Debug - Current progress:', {
        exists: !!currentProgress,
        currentStageProgress: currentProgress?.stageProgress,
        completedStages: currentProgress?.completedStages
      });

      // Initialize or parse existing progress
      let stageProgress = {};
      let completedStages = [];
      
      if (currentProgress) {
        try {
          stageProgress = currentProgress.stageProgress ? JSON.parse(currentProgress.stageProgress) : {};
          completedStages = currentProgress.completedStages || [];
          console.log('🔍 Debug - Parsed existing progress:', { stageProgress, completedStages });
        } catch (e) {
          console.error('🔍 Debug - Failed to parse progress:', e);
          stageProgress = {};
          completedStages = [];
        }
      }

      // Initialize stage progress if not exists
      if (!stageProgress[parsedStageIndex]) {
        stageProgress[parsedStageIndex] = {
          progress: 0,
          contents: {}
        };
      } else if (typeof stageProgress[parsedStageIndex] === 'number') {
        // Convert old format to new format
        const oldProgress = stageProgress[parsedStageIndex];
        stageProgress[parsedStageIndex] = {
          progress: oldProgress,
          contents: {}
        };
      }

      // Update content progress if provided
      if (parsedContentIndex !== null && contentProgress !== undefined) {
        // Ensure contents object exists
        if (!stageProgress[parsedStageIndex].contents) {
          stageProgress[parsedStageIndex].contents = {};
        }
        
        stageProgress[parsedStageIndex].contents[parsedContentIndex] = contentProgress;
        
        // Calculate stage progress based on content progress
        const stage = material.stages[parsedStageIndex];
        const contents = typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents;
        const contentCount = Array.isArray(contents) ? contents.length : 1;
        const totalContentProgress = Object.values(stageProgress[parsedStageIndex].contents)
          .reduce((sum, progress) => sum + progress, 0);
        
        stageProgress[parsedStageIndex].progress = Math.round(totalContentProgress / contentCount);
        
        console.log('🔍 Debug - Updated stage progress:', {
          stageIndex: parsedStageIndex,
          contentCount,
          totalContentProgress,
          calculatedProgress: stageProgress[parsedStageIndex].progress,
          stageProgress: stageProgress[parsedStageIndex]
        });
      } else {
        // If no content progress provided, mark entire stage as complete
        stageProgress[parsedStageIndex].progress = 100;
      }

      // Update completed stages if stage is complete
      if (stageProgress[parsedStageIndex].progress === 100 && !completedStages.includes(parsedStageIndex)) {
        completedStages.push(parsedStageIndex);
        console.log('🔍 Debug - Stage completed:', {
          stageIndex: parsedStageIndex,
          completedStages
        });
      }

      // Calculate next stage and overall progress
      const nextStage = parsedStageIndex + 1;
      const hasNextStage = nextStage < material.stages.length;
      const totalProgress = Math.round((completedStages.length / material.stages.length) * 100);

      console.log('🔍 Debug - Final calculations:', {
        nextStage,
        hasNextStage,
        totalProgress,
        stageProgress,
        stageProgressString: JSON.stringify(stageProgress)
      });

      // Update progress in database
      const updatedProgress = await prisma.materialProgress.upsert({
        where: {
          userId_materialId: {
            userId: parsedUserId,
            materialId: parsedMaterialId
          }
        },
        update: {
          progress: totalProgress,
          completed: totalProgress === 100,
          stageProgress: JSON.stringify(stageProgress),
          completedStages,
          activeStage: hasNextStage ? nextStage : parsedStageIndex,
          lastAccessed: new Date()
        },
        create: {
          userId: parsedUserId,
          materialId: parsedMaterialId,
          progress: totalProgress,
          completed: totalProgress === 100,
          stageProgress: JSON.stringify(stageProgress),
          completedStages,
          activeStage: hasNextStage ? nextStage : parsedStageIndex,
          lastAccessed: new Date()
        }
      });

      console.log('🔍 Debug - Progress updated:', {
        id: updatedProgress.id,
        progress: updatedProgress.progress,
        completed: updatedProgress.completed,
        activeStage: updatedProgress.activeStage
      });

      // Prepare response
      const response = {
        ...updatedProgress,
        stageProgress: JSON.parse(updatedProgress.stageProgress || '{}'),
        material
      };

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('❌ Error completing stage:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to complete stage',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = stageProgressController; 