const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../usersManagement/controllers/authController');
const creationController = require('../controllers/creationController');
const commentController = require('../controllers/commentController');

// Creation routes
router.post('/', authenticateToken, creationController.createCreation);
router.get('/', creationController.getCreations);
router.get('/:id', creationController.getCreationById);
router.delete('/:id', authenticateToken, creationController.deleteCreation);
router.post('/:id/like', authenticateToken, creationController.toggleLike);

// Comment routes - protect all comment routes with auth
router.get('/:id/comments', authenticateToken, commentController.getComments);
router.post('/:id/comments', authenticateToken, commentController.addComment);
router.post('/:id/comments/:commentId/like', authenticateToken, commentController.toggleLike);
router.post('/:id/comments/:commentId/replies', authenticateToken, commentController.addReply);
router.delete('/:id/comments/:commentId', authenticateToken, commentController.deleteComment);

module.exports = router; 