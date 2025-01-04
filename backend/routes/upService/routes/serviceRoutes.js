const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../usersManagement/controllers/authController');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  bookService,
  addReview
} = require('../controllers/serviceController');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.post('/', requireAuth, createService);
router.put('/:id', requireAuth, updateService);
router.delete('/:id', requireAuth, deleteService);
router.post('/:id/book', requireAuth, bookService);
router.post('/:id/review', requireAuth, addReview);

module.exports = router; 