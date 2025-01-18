const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../routes/usersManagement/controllers/authController');

// Load environment variables with correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Prisma
const prisma = new PrismaClient();

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

// Test Cloudinary connection
const cloudinary = require('./cloudinary');
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary connection failed:', error);
  } else {
    console.log('Cloudinary connected successfully:', result);
  }
});

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Accept', 
    'Authorization', 
    'X-Requested-With', 
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import all routes
const authRoutes = require('../routes/usersManagement/routes/authRoutes');
const categoryRoutes = require('../routes/coursesManagement/routes/categoryRoutes');
const subcategoryRoutes = require('../routes/coursesManagement/routes/subcategoryRoutes');
const materialRoutes = require('../routes/coursesManagement/routes/materialRoutes');
const schoolRoutes = require('../routes/usersManagement/leaderboard/school/schoolRoutes');
const progressRoutes = require('../routes/progress/progressRoutes');
const stageProgressRoutes = require('../routes/progress/stageProgressRoutes');
const notificationRoutes = require('../routes/progress/routes/notificationRoutes');
const discussionRoutes = require('../routes/coursesManagement/routes/discussionRoutes');
const forumRoutes = require('../routes/community/forum/routes/forumRoutes');
const creationRoutes = require('../routes/upCreation/routes/creationRoutes');
const serviceRoutes = require('../routes/upService/routes/serviceRoutes');
const squadRoutes = require('../routes/community/squad/squadRoutes');
const pointController = require('../routes/points/controllers/pointController');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stage-progress', stageProgressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/creations', creationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/squads', squadRoutes);

// Points routes
app.post('/api/points', pointController.createPoint);
app.get('/api/points/user/:userId', pointController.getUserPoints);
app.get('/api/points/material/:materialId/:userId', pointController.getMaterialPoints);
app.get('/api/points/check/:userId/:materialId/:stageIndex', pointController.checkStagePoints);
app.get('/api/points/leaderboard/:timeframe', pointController.getLeaderboard);
app.get('/api/points/leaderboard/:timeframe/:scope', pointController.getLeaderboard);
app.get('/api/points/schools/rankings', pointController.getSchoolRankings);
app.get('/api/points/recalculate', pointController.recalculateUserPoints);

// Global error handling
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error type:', err.constructor.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  console.error('Request headers:', req.headers);
  console.error('=== END GLOBAL ERROR ===');
  
  // Prisma error handling
  if (err.code) {
    if (err.code.startsWith('P')) {
      return res.status(400).json({
        message: 'Database error',
        error: err.message,
        code: err.code
      });
    }
  }

  // JWT error handling
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: err.message 
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expired',
      error: err.message 
    });
  }

  // Default error response
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

module.exports = app;