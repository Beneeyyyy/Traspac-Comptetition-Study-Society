const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImage = async (image) => {
  try {
    // Jika tidak ada gambar, return null
    if (!image) {
      console.log('No image provided');
      return null;
    }
    
    // Jika gambar sudah berupa URL Cloudinary, return URL tersebut
    if (typeof image === 'string' && image.includes('cloudinary.com')) {
      console.log('Image is already a Cloudinary URL');
      return image;
    }

    console.log('Image type:', {
      isBuffer: Buffer.isBuffer(image),
      hasBuffer: image.buffer ? true : false,
      type: typeof image,
      constructor: image.constructor.name
    });

    let uploadPromise;
    let buffer;

    // Convert ArrayBuffer to Buffer if needed
    if (image instanceof ArrayBuffer) {
      buffer = Buffer.from(image);
    } else if (image.buffer instanceof ArrayBuffer) {
      buffer = Buffer.from(image.buffer);
    } else if (Buffer.isBuffer(image)) {
      buffer = image;
    } else {
      console.error('Invalid image format:', {
        type: typeof image,
        isBuffer: Buffer.isBuffer(image),
        hasBuffer: image.buffer ? true : false,
        constructor: image.constructor.name
      });
      throw new Error('Invalid image format: Must be either a File object, Buffer, or base64 data URL');
    }

    // Handle buffer upload
    if (buffer) {
      console.log('Processing buffer upload...');
      
      uploadPromise = new Promise((resolve, reject) => {
        console.log('Creating upload stream...');
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'study-society',
            resource_type: 'auto',
            transformation: [
              { width: 1200, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ],
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            max_bytes: 15 * 1024 * 1024
          },
          (error, result) => {
            if (error) {
              console.error('Stream upload error:', error);
              reject(error);
            } else {
              console.log('Stream upload successful:', {
                public_id: result.public_id,
                url: result.secure_url
              });
              resolve(result);
            }
          }
        );

        console.log('Piping buffer to upload stream...');
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    } 
    // Handle base64 string
    else if (typeof image === 'string' && image.startsWith('data:image')) {
      console.log('Processing base64 upload...');
      
      uploadPromise = cloudinary.uploader.upload(image, {
        folder: 'study-society',
        resource_type: 'auto',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        max_bytes: 15 * 1024 * 1024
      });
    } else {
      console.error('Invalid image format:', {
        type: typeof image,
        isBuffer: Buffer.isBuffer(image),
        hasBuffer: image.buffer ? true : false,
        constructor: image.constructor.name
      });
      throw new Error('Invalid image format: Must be either a File object, Buffer, or base64 data URL');
    }

    try {
      const result = await uploadPromise;

      console.log('Upload completed:', {
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
        details: cloudinaryError.error?.message,
        stack: cloudinaryError.stack
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

