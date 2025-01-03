const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../usersManagement/controllers/authController');
const creationController = require('../controllers/creationController');
const commentController = require('../controllers/commentController');
const replyController = require('../controllers/replyController');

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
router.delete('/:id/comments/:commentId', authenticateToken, commentController.deleteComment);

// Reply routes - all protected with auth
router.get('/:id/comments/:commentId/replies', authenticateToken, replyController.getReplies);
router.post('/:id/comments/:commentId/replies', authenticateToken, replyController.addReply);
router.delete('/:id/comments/replies/:replyId', authenticateToken, replyController.deleteReply);

module.exports = router; 