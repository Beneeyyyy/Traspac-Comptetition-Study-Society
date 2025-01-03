const express = require('express');
const router = express.Router();
const pointController = require('./controllers/pointController');

// Base point routes
router.post('/', pointController.createPoint);
router.get('/user/:userId', pointController.getUserPoints);
router.get('/material/:materialId/:userId', pointController.getMaterialPoints);

// Leaderboard routes
router.get('/leaderboard/:timeframe', pointController.getLeaderboard);
router.get('/leaderboard/:timeframe/:scope', pointController.getLeaderboardByScope);

// School rankings route
router.get('/schools/rankings', pointController.getSchoolRankings);

// Recalculate points route (changed to GET)
router.get('/recalculate', pointController.recalculateUserPoints);

module.exports = router; 