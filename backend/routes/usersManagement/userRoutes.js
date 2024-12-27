const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    
    // Transform users untuk menangani gambar
    const transformedUsers = users.map(user => {
      // Jika user memiliki gambar dalam format base64, upload ke Cloudinary
      if (user.image && user.image.startsWith('data:image')) {
        return {
          ...user,
          image: uploadImage(user.image) // Upload ke Cloudinary
        };
      }
      
      // Jika user memiliki gambar URL (termasuk Cloudinary atau avatar), gunakan apa adanya
      if (user.image) {
        return user;
      }
      
      // Jika tidak ada gambar, gunakan default avatar
      return {
        ...user,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
      };
    });

    // Tunggu semua proses upload selesai
    const finalUsers = await Promise.all(transformedUsers.map(async (user) => {
      if (user.image && user.image instanceof Promise) {
        const imageUrl = await user.image;
        return { ...user, image: imageUrl };
      }
      return user;
    }));

    res.json(finalUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Gagal mengambil data users' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    let imageUrl = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        image: imageUrl
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email sudah terdaftar' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Gagal membuat user' });
    }
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, image } = req.body;

    let imageUrl = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        ...(password && { password }),
        ...(imageUrl && { image: imageUrl })
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal mengupdate user' });
    }
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus user' });
  }
});

module.exports = router; 