const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { requireAuth } = require('../../usersManagement/controllers/authController');

// All routes need authentication
router.use(requireAuth);

// Get discussions for a material
router.get('/material/:materialId', discussionController.getMaterialDiscussions);

// Get single discussion with replies
router.get('/:id', discussionController.getDiscussion);

// Create new discussion
router.post('/material/:materialId', discussionController.createDiscussion);

// Add reply to discussion
router.post('/:discussionId/reply', discussionController.addReply);

// Mark reply as resolved (support both PUT and PATCH)
router.put('/:discussionId/resolve/:replyId', discussionController.resolveDiscussion);
router.patch('/:discussionId/resolve/:replyId', discussionController.resolveDiscussion);

// Like/unlike discussion or reply
router.post('/:type/:id/like', discussionController.toggleLike);

module.exports = router; 