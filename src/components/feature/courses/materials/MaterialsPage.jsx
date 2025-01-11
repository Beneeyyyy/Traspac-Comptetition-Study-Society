import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourse } from '../../../../contexts/CourseContext';

const MaterialsPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const { getMaterials, loading, error } = useCourse();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getMaterials(categoryId, subcategoryId);
        setMaterials(data);
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    };

    fetchMaterials();
  }, [categoryId, subcategoryId, getMaterials]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Course Materials</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Learn at your own pace with our comprehensive course materials
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
          >
            {/* Material Image */}
            <div className="relative aspect-video">
              <img
                src={material.thumbnail || 'https://via.placeholder.com/400x225'}
                alt={material.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-medium text-white">{material.title}</h3>
                <p className="text-sm text-gray-300">{material.duration} minutes</p>
              </div>
            </div>

            {/* Material Info */}
            <div className="p-6">
              <p className="text-gray-300 mb-4 line-clamp-2">{material.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {material.type}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {material.completions} completions
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/courses/${categoryId}/${subcategoryId}/learn/${material.id}`)}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {materials.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>No materials available for this course yet.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Go Back
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MaterialsPage; 