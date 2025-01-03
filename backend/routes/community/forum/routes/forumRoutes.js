const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { requireAuth } = require('../../../usersManagement/controllers/authController');

// Apply auth middleware to all routes
router.use(requireAuth);

// Post routes
router.get('/posts', forumController.getAllPosts);
router.get('/posts/:id', forumController.getPostById);
router.post('/posts', forumController.createPost);

// Answer routes
router.post('/posts/:postId/answers', forumController.createAnswer);
router.patch('/posts/:postId/answers/:answerId/accept', forumController.acceptAnswer);

// Comment routes
router.post('/posts/:postId/comments', forumController.createComment);
router.post('/answers/:answerId/comments', forumController.createComment);

// Vote routes
router.post('/:type/:id/vote', forumController.handleVote);

module.exports = router; 