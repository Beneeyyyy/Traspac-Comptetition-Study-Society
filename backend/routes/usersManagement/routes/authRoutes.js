const express = require('express');
const router = express.Router();
const { login, signup, checkAuth, signout } = require('../controllers/authController');

// Auth routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/check-auth', checkAuth);
router.post('/signout', signout);

module.exports = router; 