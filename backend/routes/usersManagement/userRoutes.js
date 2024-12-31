const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uploadImage = require('../../utils/uploadImage');
const authMiddleware = require('../../middleware/auth');

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

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        image: true,
        schoolId: true,
        bio: true,
        interests: true,
        currentGoal: true,
        totalPoints: true,
        level: true,
        rank: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token created');

    // Set token in cookie dengan opsi yang lebih lengkap
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Gunakan HTTPS di production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 jam
      path: '/',
      domain: 'localhost' // Explicitly set domain
    });
    console.log('Cookie set with options:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: '24h',
      path: '/',
      domain: 'localhost'
    });

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    console.log('Sending user data:', userData);
    
    res.json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Detailed login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password,
      schoolId,
      bio,
      interests,
      currentGoal,
      image
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        schoolId: schoolId ? parseInt(schoolId) : null,
        role: 'user',
        bio,
        interests: interests || [],
        currentGoal,
        image,
        totalPoints: 0,
        level: 1,
        rank: 'Pemula'
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    res.json({
      message: 'Signup successful',
      user: userData
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Check auth status endpoint
router.get('/check-auth', async (req, res, next) => {
  try {
    console.log('=== CHECK-AUTH DEBUG START ===');
    console.log('Cookies received:', req.cookies);
    console.log('Headers:', req.headers);
    
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token successfully decoded:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: jwtError.message 
      });
    }
    
    console.log('Attempting to find user with id:', decoded.userId);
    
    const user = await prisma.user.findUnique({
      where: { 
        id: parseInt(decoded.userId)
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        schoolId: true,
        bio: true,
        interests: true,
        currentGoal: true,
        totalPoints: true,
        level: true,
        rank: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Database query result:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    const transformedUser = {
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    };

    console.log('Sending response with user:', transformedUser);
    console.log('=== CHECK-AUTH DEBUG END ===');

    res.json({ user: transformedUser });

  } catch (error) {
    console.error('=== CHECK-AUTH ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    next(error);
  }
});


module.exports = router; 