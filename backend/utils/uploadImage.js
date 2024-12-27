const cloudinary = require('../config/cloudinary');

const uploadImage = async (base64Image) => {
  try {
    // Jika tidak ada gambar, return null
    if (!base64Image) {
      console.log('No image provided');
      return null;
    }
    
    // Jika gambar sudah berupa URL Cloudinary, return URL tersebut
    if (base64Image.includes('cloudinary.com')) {
      console.log('Image is already a Cloudinary URL');
      return base64Image;
    }
    
    console.log('Processing image for upload...');
    
    // Validasi format base64
    if (!base64Image.startsWith('data:image')) {
      throw new Error('Invalid image format: Must be base64 data URL');
    }

    // Debug info
    console.log('Base64 string length:', base64Image.length);
    console.log('Base64 string prefix:', base64Image.substring(0, 50));
    
    try {
      // Upload ke Cloudinary dengan base64 string langsung
      console.log('Attempting to upload to Cloudinary...');
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'study-society',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        max_bytes: 15 * 1024 * 1024
      });

      console.log('Cloudinary upload successful');
      console.log('Upload result:', {
        public_id: result.public_id,
        format: result.format,
        secure_url: result.secure_url
      });

      return result.secure_url;
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', {
        name: cloudinaryError.name,
        message: cloudinaryError.message,
        http_code: cloudinaryError.http_code
      });
      throw cloudinaryError;
    }
  } catch (error) {
    console.error('Detailed upload error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    if (error.http_code === 400) {
      throw new Error('Format gambar tidak valid atau ukuran terlalu besar (maksimal 15MB)');
    }
    throw new Error(`Gagal mengupload gambar: ${error.message}`);
  }
};

module.exports = uploadImage; 

