const express = require('express');
const router = express.Router();
const uploadImage = require('../utils/uploadImage');
const { requireAuth } = require('../routes/usersManagement/controllers/authController');

router.post('/', requireAuth, async function(req, res) {
  try {
    console.log('Received upload request');
    const { image } = req.body;

    if (!image) {
      console.error('No image data provided in request');
      return res.status(400).json({ message: 'No image data provided' });
    }

    console.log('Attempting to upload image to Cloudinary...');
    const imageUrl = await uploadImage(image);
    
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