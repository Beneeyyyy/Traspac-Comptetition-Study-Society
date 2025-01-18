const express = require('express');
const router = express.Router({ mergeParams: true }); // To access squadId from parent router
const { requireAuth } = require('../../../routes/usersManagement/controllers/authController');
const { isSquadMember, isSquadModOrAdmin } = require('./squadMiddleware');
const {
  createSquadMaterial,
  getSquadMaterials,
  getSquadMaterial,
  updateSquadMaterial,
  deleteSquadMaterial
} = require('./materialController');

// Apply auth middleware to all routes
router.use(requireAuth);

// Apply squad member check to all routes
router.use(isSquadMember);

// Get all materials in squad
router.get('/', getSquadMaterials);

// Get specific material
router.get('/:materialId', getSquadMaterial);

// Apply moderator/admin check to routes below
router.use(isSquadModOrAdmin);

// Create new material
router.post('/', createSquadMaterial);

// Update material
router.put('/:materialId', updateSquadMaterial);

// Delete material
router.delete('/:materialId', deleteSquadMaterial);

module.exports = router; 