import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiX, FiCircle, FiImage, FiVideo, FiType, FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Modal from '../../../../../../components/common/Modal';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { createLearningPath, updateLearningPath, deleteLearningPath, createMaterial, getLearningPaths } from '../../../../../../api/squad';
import axios from 'axios';

const MaterialsSection = ({ squad }) => {
  const auth = useAuth();
  const user = auth?.user;  // Safely access user from auth
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    xp_reward: 0,
    estimated_time: 30,
    categoryId: '',
    stages: [{
      title: 'Introduction',
      contents: [{
        id: 1,
        text: 'Welcome to this material',
        media: [] // Array of {type: 'image'|'video', url: string}
      }]
    }]
  });
  const [formData, setFormData] = useState({
    pathTitle: '',
    pathDescription: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [paths, categoriesRes] = await Promise.all([
          getLearningPaths(squad.id),
          axios.get('/api/categories')
        ]);
        
        console.log('Fetched learning paths:', paths);
        console.log('Fetched categories:', categoriesRes.data);
        
        setLearningPaths(paths);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (squad?.id) {
      fetchData();
    }
  }, [squad?.id]);

  const isAdminOrModerator = squad?.members?.some(
    member => member.userId === user?.id && ['ADMIN', 'MODERATOR'].includes(member.role)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialFormChange = (e) => {
    const { name, value } = e.target;
    setMaterialForm(prev => ({
      ...prev,
      [name]: name === 'xp_reward' || name === 'estimated_time' ? Number(value) : value
    }));
  };

  const handleCreatePath = async (e) => {
    e.preventDefault();
    try {
      const newPath = await createLearningPath(squad.id, {
        title: formData.pathTitle,
        description: formData.pathDescription
      });
      
      setLearningPaths([...learningPaths, newPath]);
      setActiveModal(null);
      setFormData(prev => ({ ...prev, pathTitle: '', pathDescription: '' }));
      toast.success('Learning path created successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to create learning path');
    }
  };

  const handleAddStage = () => {
    setMaterialForm(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          title: `Stage ${prev.stages.length + 1}`,
          contents: [{
            id: 1,
            text: '',
            media: []
          }],
          media: []
        }
      ]
    }));
  };

  const handleRemoveStage = (stageIndex) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.filter((_, idx) => idx !== stageIndex)
    }));
  };

  const handleStageChange = (stageIndex, field, value) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.map((stage, idx) => 
        idx === stageIndex ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const handleContentChange = (stageIndex, contentIndex, field, value) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.map((stage, idx) => 
        idx === stageIndex 
          ? {
              ...stage,
              contents: stage.contents.map((content, cIdx) =>
                cIdx === contentIndex 
                  ? { ...content, [field]: value }
                  : content
              )
            }
          : stage
      )
    }));
  };

  const handleAddContent = (stageIndex) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.map((stage, idx) => 
        idx === stageIndex 
          ? {
              ...stage,
              contents: [
                ...stage.contents,
                {
                  id: stage.contents.length + 1,
                  text: '',
                  media: []
                }
              ]
            }
          : stage
      )
    }));
  };

  const handleRemoveContent = (stageIndex, contentIndex) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.map((stage, idx) => 
        idx === stageIndex 
          ? {
              ...stage,
              contents: stage.contents.filter((_, cIdx) => cIdx !== contentIndex)
            }
          : stage
      )
    }));
  };

  const handleAddMedia = (stageIndex, contentIndex, type) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'image' ? 'image/*' : 'video/*';
    
    fileInput.onchange = async (e) => {
      if (e.target.files?.[0]) {
        const loadingToast = toast.loading(`Uploading ${type}...`);
        try {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          reader.onload = async () => {
            try {
              const response = await axios.post('/api/upload', { 
                image: reader.result 
              }, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              });
              
              if (response.data.url) {
                setMaterialForm(prev => ({
                  ...prev,
                  stages: prev.stages.map((stage, idx) => 
                    idx === stageIndex 
                      ? {
                          ...stage,
                          contents: stage.contents.map((content, cIdx) =>
                            cIdx === contentIndex 
                              ? {
                                  ...content,
                                  media: [...content.media, { type, url: response.data.url }]
                                }
                              : content
                          )
                        }
                      : stage
                  )
                }));
                toast.dismiss(loadingToast);
                toast.success(`${type} uploaded successfully`);
              }
            } catch (error) {
              console.error('Upload error:', error);
              toast.dismiss(loadingToast);
              toast.error(error.response?.data?.message || `Failed to upload ${type}`);
            }
          };
        } catch (error) {
          console.error('File read error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to read file');
        }
      }
    };
    
    fileInput.click();
  };

  const handleRemoveMedia = (stageIndex, contentIndex, mediaIndex) => {
    setMaterialForm(prev => ({
      ...prev,
      stages: prev.stages.map((stage, idx) => 
        idx === stageIndex 
          ? {
              ...stage,
              contents: stage.contents.map((content, cIdx) =>
                cIdx === contentIndex 
                  ? {
                      ...content,
                      media: content.media.filter((_, mIdx) => mIdx !== mediaIndex)
                    }
                  : content
              )
            }
          : stage
      )
    }));
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      // Validate stages
      if (!materialForm.stages || materialForm.stages.length === 0) {
        toast.error('Material must have at least one stage');
        return;
      }

      // Validate stage data
      for (const stage of materialForm.stages) {
        if (!stage.title || !stage.contents || stage.contents.length === 0) {
          toast.error('Each stage must have a title and at least one content');
          return;
        }
      }

      const materialData = {
        ...materialForm,
        learningPathId: selectedPath.id
      };

      const newMaterial = await createMaterial(squad.id, materialData);

      // Update the learning path's materials
      const updatedPaths = learningPaths.map(path => {
        if (path.id === selectedPath.id) {
          return {
            ...path,
            materials: [...(path.materials || []), newMaterial]
          };
        }
        return path;
      });
      
      setLearningPaths(updatedPaths);
      setActiveModal(null);
      setMaterialForm({
        title: '',
        description: '',
        xp_reward: 0,
        estimated_time: 30,
        categoryId: '',
        stages: [{
          title: 'Introduction',
          contents: [{
            id: 1,
            text: 'Welcome to this material',
            media: []
          }],
          media: []
        }]
      });
      toast.success('Material created successfully');
    } catch (error) {
      console.error('Error creating material:', error);
      toast.error(error.message || 'Failed to create material');
    }
  };

  const handleUpdatePath = async (e) => {
    e.preventDefault();
    if (!selectedPath) return;

    try {
      const updatedPath = await updateLearningPath(squad.id, selectedPath.id, {
        title: formData.pathTitle,
        description: formData.pathDescription,
        materialIds: selectedPath.materials?.map(m => m.id) || []
      });

      setLearningPaths(prev => prev.map(p => 
        p.id === selectedPath.id ? updatedPath : p
      ));
      setActiveModal(null);
      setSelectedPath(null);
      toast.success('Learning path updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update learning path');
    }
  };

  const handleDeletePath = async (pathId) => {
    if (!window.confirm('Are you sure you want to delete this learning path?')) return;

    try {
      await deleteLearningPath(squad.id, pathId);
      setLearningPaths(prev => prev.filter(p => p.id !== pathId));
      toast.success('Learning path deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete learning path');
    }
  };

  const handleMaterialClick = (material) => {
    navigate(`/squads/${squad.id}/materials/${material.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Learning Paths</h2>
        {isAdminOrModerator && (
          <button
            onClick={() => setActiveModal('path')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus /> Add Learning Path
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Learning Paths List */}
      {!loading && (
        <div className="space-y-6">
          {learningPaths.length > 0 ? (
            learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-[#0A0A0A] border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Learning Path Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                      <p className="text-gray-400">{path.description}</p>
                    </div>
                    {isAdminOrModerator && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPath(path);
                            setFormData({
                              ...formData,
                              pathTitle: path.title,
                              pathDescription: path.description
                            });
                            setActiveModal('editPath');
                          }}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeletePath(path.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Materials List */}
                <div className="divide-y divide-gray-800">
                  {path.materials?.length > 0 ? (
                    path.materials.map((material) => (
                      <div 
                        key={material.id} 
                        className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
                        onClick={() => handleMaterialClick(material)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <FiBook className="text-purple-500" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{material.title}</h4>
                              {material.description && (
                                <p className="text-sm text-gray-400 mt-1">{material.description}</p>
                              )}
                            </div>
                          </div>
                          {isAdminOrModerator && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                              <button className="p-2 text-blue-500 hover:text-blue-600">
                                <FiEdit2 />
                              </button>
                              <button className="p-2 text-red-500 hover:text-red-600">
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No materials yet in this learning path
                    </div>
                  )}
                </div>

                {/* Add Material Button */}
                {isAdminOrModerator && (
                  <div className="p-4 border-t border-gray-800">
                    <button
                      onClick={() => {
                        setSelectedPath(path);
                        setMaterialForm({
                          title: '',
                          description: '',
                          xp_reward: 0,
                          estimated_time: 30,
                          categoryId: '',
                          stages: [{
                            title: 'Introduction',
                            contents: [{
                              id: 1,
                              text: '',
                              media: []
                            }],
                            media: []
                          }]
                        });
                        setActiveModal('material');
                      }}
                      className="w-full py-2 flex items-center justify-center gap-2 text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                    >
                      <FiPlus /> Add Material
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#0A0A0A] border border-gray-800 rounded-xl">
              <p className="text-gray-500">No learning paths found</p>
              <p className="text-sm text-gray-600 mt-1">Create your first learning path to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Create Learning Path Modal */}
      <Modal
        isOpen={activeModal === 'path'}
        onClose={() => setActiveModal(null)}
        title="Create Learning Path"
      >
        <form onSubmit={handleCreatePath} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              name="pathTitle"
              value={formData.pathTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Enter path title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              name="pathDescription"
              value={formData.pathDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
              placeholder="Enter path description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Path
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Learning Path Modal */}
      <Modal
        isOpen={activeModal === 'editPath'}
        onClose={() => {
          setActiveModal(null);
          setSelectedPath(null);
        }}
        title="Edit Learning Path"
      >
        <form onSubmit={handleUpdatePath} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              name="pathTitle"
              value={formData.pathTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Enter path title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              name="pathDescription"
              value={formData.pathDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
              placeholder="Enter path description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                setSelectedPath(null);
              }}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Path
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Material Modal */}
      <Modal
        isOpen={activeModal === 'material'}
        onClose={() => setActiveModal(null)}
        title="Create Material"
      >
        <form onSubmit={handleCreateMaterial} className="flex flex-col h-[calc(100vh-200px)]">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={materialForm.categoryId}
                onChange={handleMaterialFormChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Title */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={materialForm.title}
                onChange={handleMaterialFormChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                placeholder="Enter material title..."
                required
              />
            </div>

            {/* Material Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={materialForm.description}
                onChange={handleMaterialFormChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                placeholder="Enter material description..."
                rows="3"
                required
              />
            </div>

            {/* XP and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">XP Reward</label>
                <input
                  type="number"
                  name="xp_reward"
                  value={materialForm.xp_reward}
                  onChange={handleMaterialFormChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Estimated Time (minutes)</label>
                <input
                  type="number"
                  name="estimated_time"
                  value={materialForm.estimated_time}
                  onChange={handleMaterialFormChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-sm py-2 -mx-2 px-2 z-10">
                <h4 className="text-lg font-medium text-gray-100">Stages</h4>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-200"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Stage</span>
                </button>
              </div>
              {materialForm.stages.map((stage, stageIndex) => (
                <div key={stageIndex} className="space-y-3 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-200">Stage {stageIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(stageIndex)}
                      className="p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-200"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Stage Title */}
                  <input
                    type="text"
                    value={stage.title}
                    onChange={e => handleStageChange(stageIndex, 'title', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
                    placeholder="Stage title"
                    required
                  />
                  
                  {/* Contents */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h6 className="text-sm font-medium text-gray-400">Contents</h6>
                      <button
                        type="button"
                        onClick={() => handleAddContent(stageIndex)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200"
                      >
                        <FiPlus className="w-3 h-3" />
                        Add Content
                      </button>
                    </div>

                    {stage.contents.map((content, contentIndex) => (
                      <div key={content.id} className="space-y-3 p-3 bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Content {contentIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveContent(stageIndex, contentIndex)}
                            className="p-1 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-200"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Text Content */}
                        <textarea
                          value={content.text}
                          onChange={e => handleContentChange(stageIndex, contentIndex, 'text', e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
                          placeholder="Enter content text..."
                          rows="4"
                          required
                        />

                        {/* Media Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'image')}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200"
                          >
                            <FiImage className="w-3 h-3" />
                            Add Image
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'video')}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200"
                          >
                            <FiVideo className="w-3 h-3" />
                            Add Video
                          </button>
                        </div>

                        {/* Media Preview */}
                        {content.media.length > 0 && (
                          <div className="grid grid-cols-2 gap-4">
                            {content.media.map((media, mediaIndex) => (
                              <div key={mediaIndex} className="relative group">
                                {media.type === 'image' ? (
                                  <img 
                                    src={media.url}
                                    alt={`Content ${contentIndex + 1} Media ${mediaIndex + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="relative aspect-video">
                                    <iframe
                                      src={media.url}
                                      className="absolute inset-0 w-full h-full rounded-lg"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(stageIndex, contentIndex, mediaIndex)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-800 bg-black sticky bottom-0">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaterialsSection; 