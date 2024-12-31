const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const cookieParser = require('cookie-parser')

// Import routes
const authRoutes = require('../routes/usersManagement/routes/authRoutes');
const userRoutes = require('../routes/usersManagement/routes/userRoutes');
const categoryRoutes = require('../routes/coursesManagement/categoryRoutes');
const subcategoryRoutes = require('../routes/coursesManagement/subcategoryRoutes');
const materialRoutes = require('../routes/coursesManagement/materialRoutes');
const pointRoutes = require('../routes/leaderBoard/pointRoutes');
const schoolRoutes = require('../routes/usersManagement/leaderboard/school/schoolRoutes');



// Test Cloudinary connection
const cloudinary = require('./cloudinary')
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary connection failed:', error);
  } else {
    console.log('Cloudinary connected successfully:', result);
  }
});

// Inisialisasi Prisma dan Express
const prisma = new PrismaClient()
const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'Cookie']
}))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/schools', schoolRoutes);

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
const PORT = process.env.PORT || 3000
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })

module.exports = app