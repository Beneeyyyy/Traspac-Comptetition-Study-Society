const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../middleware/auth');
const { canViewSquad, isSquadMember, isSquadAdmin } = require('./squadMiddleware');

// Detailed debugging for controller import
try {
  const squadController = require('./squadController');
  console.log('Loading squadRoutes.js...');
  console.log('squadController type:', typeof squadController);
  console.log('squadController keys:', Object.keys(squadController));
  console.log('getSquads type:', typeof squadController.getSquads);
  
  // Squad routes
  router.get('/', authenticateToken, (req, res, next) => {
    console.log('Executing getSquads...');
    return squadController.getSquads(req, res, next);
  });
  
  router.get('/:id', authenticateToken, canViewSquad, (req, res, next) => {
    return squadController.getSquadById(req, res, next);
  });
  
  router.post('/', authenticateToken, (req, res, next) => {
    return squadController.createSquad(req, res, next);
  });
  
  router.put('/:id', authenticateToken, isSquadAdmin, (req, res, next) => {
    return squadController.updateSquad(req, res, next);
  });
  
  router.delete('/:id', authenticateToken, isSquadAdmin, (req, res, next) => {
    return squadController.deleteSquad(req, res, next);
  });
  
  // Member routes
  router.post('/:id/join', authenticateToken, (req, res, next) => {
    return squadController.joinSquad(req, res, next);
  });
  
  router.post('/:id/leave', authenticateToken, isSquadMember, (req, res, next) => {
    return squadController.leaveSquad(req, res, next);
  });
  
  router.put('/:id/member/:memberId/role', authenticateToken, isSquadAdmin, (req, res, next) => {
    return squadController.updateMemberRole(req, res, next);
  });

} catch (error) {
  console.error('Error loading squadController:', error);
}

console.log('Squad routes initialized');
module.exports = router; 