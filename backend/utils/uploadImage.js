const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (base64Image) => {
  try {
    // Validate input
    if (!base64Image) {
      console.error('No image data provided');
      return null;
    }

    // If already a Cloudinary URL, return as is
    if (base64Image.includes('cloudinary.com')) {
      return base64Image;
    }

    // Log Cloudinary configuration (without sensitive data)
    console.log('Cloudinary Configuration:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      configured: !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET
    });

    console.log('Uploading image to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'study-society/materials',
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
    });

    console.log('Image uploaded successfully. URL:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    // Log detailed error information
    if (error.http_code) {
      console.error('HTTP Status:', error.http_code);
    }
    if (error.error) {
      console.error('Cloudinary Error:', error.error);
    }
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
};

module.exports = uploadImage; 

