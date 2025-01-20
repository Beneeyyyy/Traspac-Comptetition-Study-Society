const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadImage = require('../utils/uploadImage');
const { requireAuth } = require('../routes/usersManagement/controllers/authController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Debug middleware
router.use((req, res, next) => {
  console.log('[Upload Route] Request received');
  next();
});

router.post('/', requireAuth, upload.single('image'), async function(req, res) {
  try {
    console.log('Received upload request');
    
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', {
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    console.log('Attempting to upload image to Cloudinary...');
    const imageUrl = await uploadImage(dataURI);
    
    if (!imageUrl) {
      console.error('Failed to get URL from Cloudinary');
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    console.log('Successfully uploaded image:', imageUrl);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router; 