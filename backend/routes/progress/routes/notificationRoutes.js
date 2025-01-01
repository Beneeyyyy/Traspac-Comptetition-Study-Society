const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Routes
router.get('/user/:userId', notificationController.getUserNotifications);
router.post('/user/:userId/mark-read', notificationController.markAsRead);
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

module.exports = router; 