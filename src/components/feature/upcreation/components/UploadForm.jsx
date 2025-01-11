import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiX } from 'react-icons/fi';

const UploadForm = ({ setIsUploadMode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    image: null,
    fileUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('Image size must be less than 15MB');
      return;
    }

    try {
      const base64 = await compressImage(file);
      console.log('Compressed image size:', Math.round(base64.length * 0.75 / 1024), 'KB');
      
      if (!base64.startsWith('data:image/')) {
        throw new Error('Invalid image format after compression');
      }

      setFormData(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
      setError(null);
    } catch (err) {
      console.error('Image processing error:', err);
      setError('Failed to process image. Please try again.');
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1200px)
          let width = img.width;
          let height = img.height;
          if (width > 1200) {
            height = Math.round((height * 1200) / width);
            width = 1200;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          
          resolve(base64);
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Ensure tags is an array
      const cleanedTags = formData.tags
        .filter(tag => tag.trim() !== '')
        .map(tag => tag.trim());

      if (cleanedTags.length === 0) {
        throw new Error('Please add at least one tag');
      }

      // Prepare payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: cleanedTags,
        image: formData.image,
        fileUrl: formData.fileUrl?.trim()
      };

      // Log the payload for debugging (excluding image data)
      console.log('Sending creation payload:', {
        ...payload,
        image: payload.image ? `${payload.image.substring(0, 50)}...` : null
      });

      const response = await axios.post('/api/creations', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log('Upload successful:', response.data);
      setIsUploadMode(false);
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <select
          name="category"
          required
          value={formData.category}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a category</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="writing">Writing</option>
          <option value="photography">Photography</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags * (comma separated)
        </label>
        <input
          type="text"
          name="tags"
          required
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="art, digital, illustration"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-auto"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      required={!formData.image}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 15MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          File URL (optional)
        </label>
        <input
          type="url"
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleInputChange}
          placeholder="https://example.com/file"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setIsUploadMode(false)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
};

export default UploadForm; 