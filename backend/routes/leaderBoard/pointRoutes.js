const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all points
router.get('/', async (req, res) => {
  try {
    const points = await prisma.point.findMany({
      include: {
        user: true,
        category: true,
        subcategory: true,
        material: true
      }
    });
    res.json(points);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ error: 'Gagal mengambil data point' });
  }
});

// Create point
router.post('/', async (req, res) => {
  try {
    const { value, userId, categoryId, subcategoryId, materialId } = req.body;
    
    if (!value || !userId || !categoryId || !subcategoryId || !materialId) {
      return res.status(400).json({ 
        error: 'Semua field harus diisi (value, userId, categoryId, subcategoryId, materialId)' 
      });
    }

    const point = await prisma.point.create({
      data: {
        value: parseInt(value),
        userId: parseInt(userId),
        categoryId: parseInt(categoryId),
        subcategoryId: parseInt(subcategoryId),
        materialId: parseInt(materialId)
      },
      include: {
        user: true,
        category: true,
        subcategory: true,
        material: true
      }
    });

    res.status(201).json(point);
  } catch (error) {
    console.error('Error creating point:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Salah satu referensi (user/category/subcategory/material) tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal membuat point' });
    }
  }
});

// Get points by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📊 Fetching points for user:', userId);

    // Get today's date for logging
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const points = await prisma.point.findMany({
      where: { 
        userId: parseInt(userId) 
      },
      include: {
        user: true,
        category: true,
        subcategory: true,
        material: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Log points details
    const todayPoints = points.filter(point => {
      const pointDate = new Date(point.createdAt);
      pointDate.setHours(0, 0, 0, 0);
      return pointDate.getTime() === today.getTime();
    });

    console.log('📈 Points summary:', {
      userId,
      totalPoints: points.length,
      todayPoints: todayPoints.length,
      todayTotal: todayPoints.reduce((sum, p) => sum + p.value, 0),
      recentPoints: points.slice(0, 5).map(p => ({
        id: p.id,
        value: p.value,
        createdAt: p.createdAt,
        materialTitle: p.material.title
      }))
    });

    res.json({
      success: true,
      data: points
    });
  } catch (error) {
    console.error('❌ Error fetching points:', {
      error: error.message,
      stack: error.stack,
      userId
    });
    res.status(500).json({ 
      success: false,
      error: 'Gagal mengambil data point',
      message: error.message
    });
  }
});

// Get points by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const points = await prisma.point.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: {
        user: true,
        subcategory: true,
        material: true
      }
    });
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data point' });
  }
});

// Get total points by user ID
router.get('/user/:userId/total', async (req, res) => {
  try {
    const { userId } = req.params;
    const points = await prisma.point.groupBy({
      by: ['userId'],
      where: { userId: parseInt(userId) },
      _sum: {
        value: true
      }
    });
    
    const totalPoints = points[0]?._sum.value || 0;
    res.json({ totalPoints });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil total point' });
  }
});

// Get leaderboard (all categories)
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.point.groupBy({
      by: ['userId'],
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
    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: { name: true, email: true }
        });
        return {
          userId: entry.userId,
          totalPoints: entry._sum.value,
          user
        };
      })
    );

    res.json(leaderboardWithUsers);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data leaderboard' });
  }
});

// Get leaderboard by category
router.get('/leaderboard/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const leaderboard = await prisma.point.groupBy({
      by: ['userId'],
      where: { categoryId: parseInt(categoryId) },
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

    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: { name: true, email: true }
        });
        return {
          userId: entry.userId,
          totalPoints: entry._sum.value,
          user
        };
      })
    );

    res.json(leaderboardWithUsers);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data leaderboard kategori' });
  }
});

// Get top global learners
router.get('/leaderboard/topGlobal', async (req, res) => {
  try {
    const leaderboard = await prisma.point.groupBy({
      by: ['userId'],
      _sum: {
        value: true
      },
      orderBy: {
        _sum: {
          value: 'desc'
        }
      },
      take: 3 // Hanya ambil 3 teratas
    });

    // Get user details for each leaderboard entry
    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: {
            name: true,
            email: true,
            image: true
          }
        });

        // Jika user tidak memiliki gambar, gunakan default avatar
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
        
        return {
          userId: entry.userId,
          user: user.name,
          email: user.email,
          image: user.image || defaultAvatar,
          totalPoint: entry._sum.value || 0
        };
      })
    );

    res.json(leaderboardWithUsers);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ error: 'Gagal mengambil data leaderboard global' });
  }
});

// Get leaderboard with time and category filters
router.get('/leaderboard/:timeframe/:categoryId?', async (req, res) => {
  try {
    const { timeframe, categoryId } = req.params;
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();
    if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Build where clause
    const whereClause = {
      createdAt: {
        gte: startDate,
        lte: now
      },
      ...(categoryId ? { categoryId: parseInt(categoryId) } : {})
    };

    console.log('🔍 Fetching leaderboard with filters:', {
      timeframe,
      categoryId,
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    });

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

    // Get user details and additional stats
    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            school: true,
            totalStudyTime: true
          }
        });

        // Get category distribution
        const categoryPoints = await prisma.point.groupBy({
          by: ['categoryId'],
          where: {
            userId: entry.userId,
            createdAt: whereClause.createdAt
          },
          _sum: {
            value: true
          }
        });

        // Format study time
        const hours = Math.floor(user.totalStudyTime / 60);
        const minutes = user.totalStudyTime % 60;
        const timeSpent = `${hours}h ${minutes}m`;

        // Get completed courses count
        const completedMaterials = await prisma.materialProgress.count({
          where: {
            userId: entry.userId,
            completed: true
          }
        });

        return {
          userId: entry.userId,
          user: user.name,
          email: user.email,
          image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
          points: entry._sum.value,
          timeSpent,
          coursesCount: completedMaterials,
          school: user.school?.name || 'Unknown',
          categoryDistribution: categoryPoints
        };
      })
    );

    console.log(`✅ Found ${leaderboardWithUsers.length} users for leaderboard`);

    res.json({
      success: true,
      data: leaderboardWithUsers
    });
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false,
      error: 'Gagal mengambil data leaderboard',
      message: error.message
    });
  }
});

module.exports = router; 