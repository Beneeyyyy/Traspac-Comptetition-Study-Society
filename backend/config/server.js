const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

// Import routes
const userRoutes = require('../routes/usersManagement/userRoutes')
const categoryRoutes = require('../routes/coursesManagement/categoryRoutes')
const subcategoryRoutes = require('../routes/coursesManagement/subcategoryRoutes')
const materialRoutes = require('../routes/coursesManagement/materialRoutes')
const pointRoutes = require('../routes/leaderBoard/pointRoutes')
const schoolRoutes = require('../routes/usersManagement/leaderboard/school/schoolRoutes')


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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept']
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/subcategories', subcategoryRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/points', pointRoutes)
app.use('/api/schools', schoolRoutes)





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