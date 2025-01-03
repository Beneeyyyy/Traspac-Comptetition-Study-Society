import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set axios default base URL
axios.defaults.baseURL = 'http://localhost:3000';

const UploadForm = ({ setIsUploadMode }) => {
  const navigate = useNavigate();
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

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Art',
    'Writing',
    'Other'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        setError('Image size should not exceed 15MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      const response = await axios.post('/api/creations', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setIsUploadMode(false);
        navigate('/upcreation');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload creation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-8 shadow-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload Your Creation</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Give your creation a title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Describe your creation"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="web, design, portfolio"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#4B5563] rounded-lg">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-64 w-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="mt-2 text-sm text-red-500 hover:text-red-400"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
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

        {/* File URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project URL (optional)
          </label>
          <input
            type="url"
            value={formData.fileUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://your-project-url.com"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Uploading...' : 'Upload Creation'}
          </button>
          <button
            type="button"
            onClick={() => setIsUploadMode(false)}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm; 