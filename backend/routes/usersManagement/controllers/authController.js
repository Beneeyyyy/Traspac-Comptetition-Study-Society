const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Login controller
const login = async (req, res) => {
  try {
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

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      domain: 'localhost'
    });

    const { password: _, ...userData } = user;
    res.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Signup controller
const signup = async (req, res) => {
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

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      domain: 'localhost'
    });

    const { password: _, ...userData } = user;
    res.json({
      message: 'Signup successful',
      user: userData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Check auth status controller
const checkAuth = async (req, res, next) => {
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

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userData = {
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    };

    res.json({ user: userData });
  } catch (error) {
    next(error);
  }
};

// Signout controller
const signout = (req, res) => {
  res.clearCookie('token', {
    path: '/',
    domain: 'localhost'
  });
  res.json({ message: 'Signed out successfully' });
};

module.exports = {
  login,
  signup,
  checkAuth,
  signout
}; 