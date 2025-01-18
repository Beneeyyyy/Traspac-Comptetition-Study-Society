const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../routes/usersManagement/controllers/authController');
const { createSquad, getSquads, getSquadById, joinSquad } = require('./squadController');

// Middleware to log requests
router.use('/', (req, res, next) => {
  console.log(`Squad Route: ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('User:', req.user);
  next();
});

// Apply auth middleware to all routes
router.use('/', requireAuth);

// Public routes (still need auth but no squad membership required)
router.get('/', getSquads);
router.post('/', createSquad);
router.get('/:id', getSquadById);
router.post('/:id/join', joinSquad);

module.exports = router; 