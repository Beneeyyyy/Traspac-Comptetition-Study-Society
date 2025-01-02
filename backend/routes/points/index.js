const express = require('express');
const router = express.Router();
const pointController = require('./controllers/pointController');

// Create a new point record
router.post('/', pointController.createPoint);

// Get user's points history
router.get('/user/:userId', pointController.getUserPoints);

module.exports = router; 