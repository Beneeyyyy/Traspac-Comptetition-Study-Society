const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Login controller
const login = async (req, res) => {
  try {
    console.log('=== LOGIN START ===');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

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
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated:', token.substring(0, 20) + '...');

    console.log('Setting cookie with options:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const { password: _, ...userData } = user;
    console.log('Sending response with user data');
    console.log('=== LOGIN END ===');

    res.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Signup controller
const signup = async (req, res) => {
  try {
    console.log('=== SIGNUP START ===');
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
    console.log('Signup attempt for email:', email);

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    console.log('Existing user found:', existingUser ? 'Yes' : 'No');

    if (existingUser) {
      console.log('Email already registered');
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    console.log('Creating user...');
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
    console.log('User created successfully');

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated:', token.substring(0, 20) + '...');

    console.log('Setting cookie with options:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const { password: _, ...userData } = user;
    console.log('Sending response with user data');
    console.log('=== SIGNUP END ===');

    res.json({
      message: 'Signup successful',
      user: userData
    });
  } catch (error) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Check auth status controller (as endpoint)
const checkAuth = async (req, res, next) => {
  try {
    console.log('=== CHECK-AUTH START ===');
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: jwtError.message 
      });
    }

    if (!decoded.userId) {
      console.error('No userId in decoded token');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    console.log('Looking up user with ID:', decoded.userId);
    
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

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    const userData = {
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    };

    console.log('Sending response with user data');
    console.log('=== CHECK-AUTH END ===');

    return res.json({ user: userData });
  } catch (error) {
    console.error('=== CHECK-AUTH ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Auth middleware for protected routes
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: jwtError.message 
      });
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: parseInt(decoded.userId)
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Signout controller
const signout = (req, res) => {
  try {
    console.log('=== SIGNOUT START ===');
    console.log('Clearing cookie with options:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    });

    console.log('Cookie cleared successfully');
    console.log('=== SIGNOUT END ===');

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('=== SIGNOUT ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  login,
  signup,
  checkAuth,
  requireAuth,
  signout
}; 