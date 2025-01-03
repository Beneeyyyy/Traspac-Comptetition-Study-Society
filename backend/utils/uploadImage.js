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
      console.error('Invalid base64 format:', base64Image.substring(0, 50) + '...');
      throw new Error('Invalid image format: Must be base64 data URL');
    }

    // Extract MIME type
    const mimeType = base64Image.split(';')[0].split(':')[1];
    console.log('Image MIME type:', mimeType);

    // Validate file size (base64 is ~33% larger than binary)
    const base64WithoutHeader = base64Image.split(',')[1];
    const fileSizeInBytes = (base64WithoutHeader.length * 3) / 4;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    if (fileSizeInMB > 15) {
      throw new Error('Image size exceeds 15MB limit');
    }

    console.log('Image size:', fileSizeInMB.toFixed(2) + 'MB');
    
    try {
      // Upload ke Cloudinary dengan base64 string
      console.log('Uploading to Cloudinary...');
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'study-society',
        resource_type: 'auto',
        transformation: [
          { width: 1200, crop: 'limit' }, // Increase max width
          { quality: 'auto:good' }, // Optimize quality
          { fetch_format: 'auto' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        max_bytes: 15 * 1024 * 1024
      });

      console.log('Upload successful:', {
        public_id: result.public_id,
        format: result.format,
        size: Math.round(result.bytes / 1024) + 'KB',
        dimensions: `${result.width}x${result.height}`,
        url: result.secure_url
      });

      return result.secure_url;
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', {
        error: cloudinaryError.message,
        code: cloudinaryError.http_code,
        details: cloudinaryError.error?.message
      });
      
      if (cloudinaryError.http_code === 400) {
        throw new Error('Format gambar tidak valid atau ukuran terlalu besar');
      }
      
      throw new Error('Gagal mengupload gambar ke server');
    }
  } catch (error) {
    console.error('Image upload error:', {
      message: error.message,
      type: error.name,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = uploadImage; 

