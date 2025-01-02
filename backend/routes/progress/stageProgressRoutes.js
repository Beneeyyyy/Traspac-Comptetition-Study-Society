const express = require('express');
const router = express.Router();
const stageProgressController = require('./controllers/stageProgressController');

// Get current progress for a material
router.get('/material/:userId/:materialId', stageProgressController.getCurrentProgress);

// Complete a stage
router.post('/material/:userId/:materialId/complete', stageProgressController.completeStage);

module.exports = router; 