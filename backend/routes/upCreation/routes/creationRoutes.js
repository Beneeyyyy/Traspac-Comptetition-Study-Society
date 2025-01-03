const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../usersManagement/controllers/authController');
const {
  getCreations,
  getCreationById,
  createCreation,
  updateCreation,
  deleteCreation,
  toggleLike,
  addComment,
  deleteComment,
  getComments
} = require('../controllers/creationController');

// Public routes
router.get('/', getCreations);
router.get('/:id', getCreationById);

// Protected routes
router.post('/', requireAuth, createCreation);
router.put('/:id', requireAuth, updateCreation);
router.delete('/:id', requireAuth, deleteCreation);

// Like routes
router.post('/:id/like', requireAuth, toggleLike);

// Comment routes
router.get('/:id/comments', getComments);
router.post('/:id/comments', requireAuth, addComment);
router.delete('/:id/comments/:commentId', requireAuth, deleteComment);

module.exports = router; 