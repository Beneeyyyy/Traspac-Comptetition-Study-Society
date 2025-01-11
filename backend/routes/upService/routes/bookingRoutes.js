const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, isAdmin } = require('../../../middleware/authMiddleware');
const {
  getUserBookings,
  getProviderBookings,
  createBooking,
  uploadPaymentProof,
  verifyPayment,
  updateBookingStatus,
  getBookingDetails
} = require('../controllers/bookingController');

// Configure multer for payment proof upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.get('/user', authenticateToken, getUserBookings);
router.get('/provider', authenticateToken, getProviderBookings);
router.post('/', authenticateToken, createBooking);
router.post('/:bookingId/payment-proof', authenticateToken, upload.single('paymentProof'), uploadPaymentProof);
router.post('/:bookingId/verify', authenticateToken, isAdmin, verifyPayment);
router.put('/:bookingId/status', authenticateToken, updateBookingStatus);
router.get('/:bookingId', authenticateToken, getBookingDetails);

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB'
      });
    }
  }
  next(error);
});

module.exports = router; 