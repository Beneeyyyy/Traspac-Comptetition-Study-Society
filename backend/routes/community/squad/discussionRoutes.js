const express = require('express');
const router = express.Router({ mergeParams: true }); // To access squadId from parent router
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('../../../routes/usersManagement/controllers/authController');
const { isSquadMember, isSquadModOrAdmin } = require('./squadMiddleware');
const {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  deleteReply
} = require('./discussionController');

// Apply auth middleware to all routes
router.use(requireAuth);

// Apply squad member check to all routes
router.use(isSquadMember);

// Get all discussions
router.get('/', getDiscussions);

// Create new discussion
router.post('/', createDiscussion);

// Get specific discussion
router.get('/:discussionId', getDiscussion);

// Add reply to discussion
router.post('/:discussionId/replies', addReply);

// Update own discussion or any discussion if mod/admin
router.put('/:discussionId', async (req, res, next) => {
  try {
    const discussion = await prisma.squadDiscussion.findUnique({
      where: { id: parseInt(req.params.discussionId) }
    });
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    if (discussion.userId === req.user.id) {
      return next();
    }
    
    return isSquadModOrAdmin(req, res, next);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}, updateDiscussion);

// Delete own discussion or any discussion if mod/admin
router.delete('/:discussionId', async (req, res, next) => {
  try {
    const discussion = await prisma.squadDiscussion.findUnique({
      where: { id: parseInt(req.params.discussionId) }
    });
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    if (discussion.userId === req.user.id) {
      return next();
    }
    
    return isSquadModOrAdmin(req, res, next);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}, deleteDiscussion);

// Delete own reply or any reply if mod/admin
router.delete('/:discussionId/replies/:replyId', async (req, res, next) => {
  try {
    const reply = await prisma.squadDiscussionReply.findUnique({
      where: { id: parseInt(req.params.replyId) }
    });
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    if (reply.userId === req.user.id) {
      return next();
    }
    
    return isSquadModOrAdmin(req, res, next);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}, deleteReply);

module.exports = router; 