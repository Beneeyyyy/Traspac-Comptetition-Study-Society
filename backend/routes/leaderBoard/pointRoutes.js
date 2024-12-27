const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all points
router.get('/', async (req, res) => {
  try {
    const points = await prisma.point.findMany({
      include: {
        User: true,
        Category: true,
        Subcategory: true,
        Material: true
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
        User: true,
        Category: true,
        Subcategory: true,
        Material: true
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
    const points = await prisma.point.findMany({
      where: { userId: parseInt(userId) },
      include: {
        Category: true,
        Subcategory: true,
        Material: true
      }
    });
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data point' });
  }
});

// Get points by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const points = await prisma.point.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: {
        User: true,
        Subcategory: true,
        Material: true
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

module.exports = router; 