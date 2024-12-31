const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
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

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request');
    const {
      name,
      email,
      password,
      schoolId,
      schoolName,
      bio,
      interests,
      currentGoal,
      profilePicture
    } = req.body;

    console.log('Processing signup for:', { email, name, schoolName });

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Upload profile picture to Cloudinary if provided
    let profilePictureUrl = null;
    if (profilePicture) {
      try {
        console.log('Uploading profile picture to Cloudinary');
        profilePictureUrl = await uploadImage(profilePicture);
        console.log('Profile picture uploaded:', profilePictureUrl);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(400).json({ message: 'Failed to upload profile picture: ' + error.message });
      }
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating user in database');
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          ...(schoolId ? {
            school: {
              connect: {
                id: parseInt(schoolId)
              }
            }
          } : {}),
          bio: bio || null,
          interests: interests || [],
          currentGoal: currentGoal || null,
          image: profilePictureUrl,
          role: 'user'
        }
      });

      console.log('User created successfully:', user.id);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }

  } catch (error) {
    console.error('Detailed signup error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message 
    });
  }
});

module.exports = router; 