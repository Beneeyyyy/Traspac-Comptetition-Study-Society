const express = require('express');
const router = express.Router();
const progressController = require('./controllers/progressController');

// Routes
router.get('/material/:userId/:materialId', progressController.getMaterialProgress);
router.post('/material/:userId/:materialId', progressController.updateProgress);
router.get('/user/:userId', progressController.getUserProgress);
router.get('/stats/:userId', progressController.getUserStats);

module.exports = router; 