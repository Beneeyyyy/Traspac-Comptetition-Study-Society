import React, { useState, useEffect } from 'react';
import { FiBook, FiClock, FiAward, FiLock, FiPlus, FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { useSquads } from '../../../../../../contexts/community/CommunityContext';
import { createMaterial, updateMaterial, deleteMaterial } from '../../../../../../api/squad';
import { getSquadLearningPaths } from '../../../../../../api/learningPath';
import Modal from '../../../../../../components/common/Modal';
import { Link } from 'react-router-dom';

const LearningSection = ({ squad }) => {
  const { user } = useAuth();
  const { setSquads } = useSquads();
  const [materials, setMaterials] = useState(squad.materials || []);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    xp_reward: 0,
    estimated_time: 0,
    stages: []
  });

  const isAdminOrModerator = squad.members?.some(
    member => member.userId === user?.id && ['ADMIN', 'MODERATOR'].includes(member.role)
  );

  // Load learning paths
  useEffect(() => {
    const loadLearningPaths = async () => {
      try {
        const paths = await getSquadLearningPaths(squad.id);
        setLearningPaths(paths);
      } catch (error) {
        toast.error('Failed to load learning paths');
      }
    };
    loadLearningPaths();
  }, [squad.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMaterial) {
        // Update existing material
        const updatedMaterial = await updateMaterial(squad.id, selectedMaterial.id, formData);
        setMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
        toast.success('Material updated successfully');
      } else {
        // Create new material
        const newMaterial = await createMaterial(squad.id, formData);
        setMaterials(prev => [...prev, newMaterial]);
        toast.success('Material created successfully');
      }
      setIsModalOpen(false);
      setSelectedMaterial(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        xp_reward: 0,
        estimated_time: 0,
        stages: []
      });
    } catch (error) {
      toast.error(error.message || 'Failed to save material');
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      image: material.image,
      xp_reward: material.xp_reward,
      estimated_time: material.estimated_time,
      stages: material.stages
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await deleteMaterial(squad.id, materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete material');
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Paths */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Learning Paths</h2>
        
        {learningPaths.length > 0 ? (
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <div 
                key={path.id} 
                className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FiBook className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{path.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{path.description}</p>
                      
                      {/* Materials in this path */}
                      <div className="mt-4 space-y-2">
                        {path.materials?.map((material, index) => (
                          <Link 
                            key={material.id}
                            to={`/squads/${squad.id}/materials/${material.id}`}
                            className="flex items-center gap-3 p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group"
                          >
                            <span className="text-gray-500 text-sm">{index + 1}</span>
                            <div>
                              <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{material.title}</h4>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                  <FiClock className="text-xs" />
                                  <span className="text-xs">{material.estimated_time} min</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                  <FiAward className="text-xs" />
                                  <span className="text-xs">{material.xp_reward} XP</span>
                                </div>
                              </div>
                            </div>
                            <FiChevronRight className="ml-auto text-gray-600 group-hover:text-blue-400 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="text-2xl text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-medium">No Learning Paths Yet</h3>
            <p className="text-gray-600 text-sm mt-1">Learning paths will appear here once created.</p>
          </div>
        )}
      </div>

      {/* Other Materials */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Other Materials</h2>
        
        {isAdminOrModerator && (
          <button
            onClick={() => {
              setSelectedMaterial(null);
              setFormData({
                title: '',
                description: '',
                image: '',
                xp_reward: 0,
                estimated_time: 0,
                stages: []
              });
              setIsModalOpen(true);
            }}
            className="mb-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FiPlus /> Add Material
          </button>
        )}
        
        {materials.length > 0 ? (
          <div className="space-y-4">
            {materials.map((material) => (
              <div 
                key={material.id} 
                className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FiBook className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{material.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{material.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiClock className="text-sm" />
                          <span className="text-xs">{material.estimated_time} min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiAward className="text-sm" />
                          <span className="text-xs">{material.xp_reward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!material.isPublished && (
                    <div className="p-2">
                      <FiLock className="text-gray-500" />
                    </div>
                  )}
                  {isAdminOrModerator && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="text-2xl text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-medium">No Materials Yet</h3>
            <p className="text-gray-600 text-sm mt-1">Materials will appear here once added.</p>
          </div>
        )}
      </div>

      {/* Material Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedMaterial ? 'Edit Material' : 'Add Material'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">XP Reward</label>
              <input
                type="number"
                name="xp_reward"
                value={formData.xp_reward}
                onChange={handleInputChange}
                min={0}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Time (minutes)</label>
              <input
                type="number"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleInputChange}
                min={0}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {selectedMaterial ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LearningSection; 