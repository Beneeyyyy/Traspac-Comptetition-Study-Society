const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test endpoint to verify core features
router.post('/verify-core-features', async (req, res) => {
  try {
    const results = {
      databaseSetup: false,
      squadManagement: false,
      memberSystem: false,
      basicContent: false,
      details: {}
    };

    // 1. Test Database Setup
    try {
      // Test Squad Model
      const testSquad = await prisma.squad.create({
        data: {
          name: "Test Squad",
          description: "Test Description",
          isPublic: true
        }
      });
      
      // Test SquadMember Model
      const testMember = await prisma.squadMember.create({
        data: {
          squadId: testSquad.id,
          userId: req.user.id,
          role: 'admin'
        }
      });

      // Test Material Model
      const testMaterial = await prisma.material.create({
        data: {
          title: "Test Material",
          description: "Test Description",
          xp_reward: 100,
          estimated_time: 30,
          type: 'squad',
          squadId: testSquad.id,
          is_published: true,
          stages: {
            create: {
              title: "Test Stage",
              order: 1,
              contents: []
            }
          }
        }
      });

      results.databaseSetup = true;
      results.details.database = {
        squadCreated: !!testSquad,
        memberCreated: !!testMember,
        materialCreated: !!testMaterial
      };

      // Cleanup test data
      await prisma.material.delete({ where: { id: testMaterial.id } });
      await prisma.squadMember.delete({ 
        where: { 
          squadId_userId: {
            squadId: testSquad.id,
            userId: req.user.id
          }
        } 
      });
      await prisma.squad.delete({ where: { id: testSquad.id } });

    } catch (error) {
      results.details.databaseError = error.message;
    }

    // 2. Test Squad Management
    try {
      // Create Squad
      const squad = await prisma.squad.create({
        data: {
          name: "Test Management Squad",
          description: "Test Description",
          isPublic: true,
          members: {
            create: {
              userId: req.user.id,
              role: 'admin'
            }
          }
        }
      });

      // Update Squad
      const updated = await prisma.squad.update({
        where: { id: squad.id },
        data: { name: "Updated Squad Name" }
      });

      // Delete Squad
      await prisma.squad.delete({ where: { id: squad.id } });

      results.squadManagement = true;
      results.details.management = {
        created: !!squad,
        updated: updated.name === "Updated Squad Name",
        deleted: true
      };

    } catch (error) {
      results.details.managementError = error.message;
    }

    // 3. Test Member System
    try {
      // Create Squad for member testing
      const squad = await prisma.squad.create({
        data: {
          name: "Test Member Squad",
          description: "Test Description",
          isPublic: true,
          members: {
            create: {
              userId: req.user.id,
              role: 'admin'
            }
          }
        }
      });

      // Test role update
      const updatedMember = await prisma.squadMember.update({
        where: {
          squadId_userId: {
            squadId: squad.id,
            userId: req.user.id
          }
        },
        data: { role: 'moderator' }
      });

      results.memberSystem = true;
      results.details.memberSystem = {
        memberCreated: true,
        roleUpdated: updatedMember.role === 'moderator'
      };

      // Cleanup
      await prisma.squad.delete({ where: { id: squad.id } });

    } catch (error) {
      results.details.memberError = error.message;
    }

    // 4. Test Basic Content
    try {
      // Create Squad with material
      const squad = await prisma.squad.create({
        data: {
          name: "Test Content Squad",
          description: "Test Description",
          isPublic: true,
          members: {
            create: {
              userId: req.user.id,
              role: 'admin'
            }
          }
        }
      });

      // Create Material with stages
      const material = await prisma.material.create({
        data: {
          title: "Test Content Material",
          description: "Test Description",
          xp_reward: 100,
          estimated_time: 30,
          type: 'squad',
          squadId: squad.id,
          is_published: true,
          stages: {
            create: {
              title: "Test Stage",
              order: 1,
              contents: [
                {
                  type: "text",
                  content: "Test content"
                }
              ]
            }
          }
        },
        include: {
          stages: true
        }
      });

      // Create progress
      const progress = await prisma.materialProgress.create({
        data: {
          userId: req.user.id,
          materialId: material.id,
          progress: 0.5,
          activeStage: 0
        }
      });

      results.basicContent = true;
      results.details.content = {
        materialCreated: !!material,
        hasStages: material.stages.length > 0,
        progressTracked: !!progress
      };

      // Cleanup
      await prisma.squad.delete({ where: { id: squad.id } });

    } catch (error) {
      results.details.contentError = error.message;
    }

    res.json({
      success: true,
      results,
      overallStatus: 
        results.databaseSetup && 
        results.squadManagement && 
        results.memberSystem && 
        results.basicContent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 