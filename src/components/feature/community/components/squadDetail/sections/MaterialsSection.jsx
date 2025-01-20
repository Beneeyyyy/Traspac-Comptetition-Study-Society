import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiX, FiCircle, FiImage, FiVideo, FiType, FiUpload, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';
import Modal from '../../../../../../components/common/Modal';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { createLearningPath, updateLearningPath, deleteLearningPath, createMaterial, getLearningPaths, getSquadMaterials, updateMaterial, deleteMaterial } from '../../../../../../api/squad';
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
  const [materials, setMaterials] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    xp_reward: 0,
    estimated_time: 30,
    categoryId: '',
    stages: []
  });
  const [isDragging, setIsDragging] = useState(false);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [paths, categoriesRes] = await Promise.all([
          getLearningPaths(squad.id),
          axios.get('/api/categories')
        ]);
        
      // Sort materials by order if exists
      const pathsWithSortedMaterials = paths.map(path => ({
        ...path,
        materials: path.materials?.sort((a, b) => (a.order || 0) - (b.order || 0))
      }));
      
      setLearningPaths(pathsWithSortedMaterials);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (squad?.id) {
      fetchData();
    }
  }, [squad?.id]);

  useEffect(() => {
    fetchMaterials();
  }, [squad.id]);

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

  const handleEditorChange = (stageIndex, contentIndex, content) => {
    handleContentChange(stageIndex, contentIndex, 'text', content);
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

  const handleAddMedia = async (stageIndex, contentIndex, type) => {
    const newMedia = {
      type,
      content: type === 'text' ? '' : null,
      url: null
    };

    if (type === 'image') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          // Show loading toast
          const loadingToast = toast.loading('Uploading image...');
          
          try {
            const formData = new FormData();
            formData.append('image', file);

            console.log('Uploading file:', {
              name: file.name,
              type: file.type,
              size: file.size
            });

            const response = await axios.post(
              'http://localhost:3000/api/upload',
              formData,
              {
                headers: { 
                  'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
              }
            );

            console.log('Upload response:', response.data);

            if (response.data.url) {
              newMedia.url = response.data.url;
              
              // Update form data
              const updatedStages = [...materialForm.stages];
              updatedStages[stageIndex].contents[contentIndex].media.push(newMedia);
              setMaterialForm(prev => ({
                ...prev,
                stages: updatedStages
              }));

              toast.dismiss(loadingToast);
              toast.success('Image uploaded successfully');
            } else {
              throw new Error('No URL returned from upload');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            toast.dismiss(loadingToast);
            if (error.response?.status === 404) {
              toast.error('Upload endpoint not found. Please check server configuration.');
            } else if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error('Failed to upload image. Please try again.');
            }
          }
        };

        input.click();
      } catch (error) {
        console.error('Error handling image upload:', error);
        toast.error('Failed to handle image upload');
      }
    } else if (type === 'video') {
      const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
      if (url) {
        try {
          // For YouTube videos, ensure we're using the embed URL
          let embedUrl = url;
          if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }

          newMedia.url = embedUrl;
          const updatedStages = [...materialForm.stages];
          updatedStages[stageIndex].contents[contentIndex].media.push(newMedia);
          setMaterialForm(prev => ({
            ...prev,
            stages: updatedStages
          }));
          
          toast.success('Video added successfully');
        } catch (error) {
          console.error('Error adding video:', error);
          toast.error('Failed to add video. Please check the URL and try again.');
        }
      }
    } else if (type === 'text') {
      const updatedStages = [...materialForm.stages];
      updatedStages[stageIndex].contents[contentIndex].media.push(newMedia);
      setMaterialForm(prev => ({
        ...prev,
        stages: updatedStages
      }));
    }
  };

  const handleMediaChange = (stageIndex, contentIndex, mediaIndex, field, value) => {
    const updatedStages = [...materialForm.stages];
    updatedStages[stageIndex].contents[contentIndex].media[mediaIndex][field] = value;
    setMaterialForm(prev => ({
      ...prev,
      stages: updatedStages
    }));
  };

  const handleRemoveMedia = (stageIndex, contentIndex, mediaIndex) => {
    const updatedStages = [...materialForm.stages];
    updatedStages[stageIndex].contents[contentIndex].media.splice(mediaIndex, 1);
    setMaterialForm(prev => ({
      ...prev,
      stages: updatedStages
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

  const fetchMaterials = async () => {
    try {
      const data = await getSquadMaterials(squad.id);
      setMaterials(data);
    } catch (error) {
      toast.error('Failed to fetch materials');
    }
  };

  const handleEditClick = async (material) => {
    try {
      const loadingToast = toast.loading('Loading material data...');

      // Fetch complete material data including stages and contents
      const response = await axios.get(`/api/squads/${squad.id}/materials/${material.id}`);
      const materialData = response.data.material || response.data;

      console.log('Raw material data:', materialData);

      if (!materialData) {
        throw new Error('No material data received');
      }

      // Format stages and contents exactly as they appear in SquadMaterialView
      const formattedStages = materialData.stages?.map(stage => {
        // Ensure contents is properly formatted
        const contents = stage.contents?.map(content => {
          if (typeof content === 'string') {
        try {
              return JSON.parse(content);
        } catch (e) {
              console.error('Error parsing content:', e);
              return null;
        }
          }
          return content;
        }).filter(Boolean) || [];

          return {
          ...stage,
          title: stage.title || '',
          contents: contents.map(content => ({
            type: content.type || 'text',
            content: content.content || content.text || '',
            text: content.text || content.content || '',
            url: content.url || '',
            media: Array.isArray(content.media) ? content.media : [],
            order: content.order || 0
          }))
        };
      }) || [];

      console.log('Formatted stages:', formattedStages);

      // Set form data with complete material information
      setSelectedMaterial(materialData);
      setEditForm({
        title: materialData.title || '',
        description: materialData.description || '',
        xp_reward: materialData.xp_reward || 0,
        estimated_time: materialData.estimated_time || 30,
        categoryId: materialData.categoryId || '',
        stages: formattedStages
      });

      setIsEditModalOpen(true);
      toast.dismiss(loadingToast);
      toast.success('Material data loaded successfully');
    } catch (error) {
      console.error('Error fetching material data:', error);
      toast.error('Failed to load material data. Please try again.');
      toast.dismiss();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    try {
      // Prepare the update data
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        xp_reward: parseInt(editForm.xp_reward),
        estimated_time: parseInt(editForm.estimated_time),
        categoryId: parseInt(editForm.categoryId),
        stages: editForm.stages.map((stage, index) => ({
          title: stage.title,
          order: index + 1,
          contents: JSON.stringify(stage.contents.map(content => ({
            type: content.type || 'text',
            content: content.content || content.text || '',
            order: content.order || index + 1,
            url: content.url || content.content || ''
          })))
        }))
      };

      // Call the update endpoint
      const updatedMaterial = await updateMaterial(squad.id, selectedMaterial.id, updateData);
      
      // Update materials in state
      setMaterials(prevMaterials => 
        prevMaterials.map(m => m.id === selectedMaterial.id ? updatedMaterial : m)
      );

      // Update learning paths
      setLearningPaths(prevPaths => 
        prevPaths.map(path => {
          if (path.materials?.some(m => m.id === selectedMaterial.id)) {
            return {
              ...path,
              materials: path.materials.map(m => 
                m.id === selectedMaterial.id ? updatedMaterial : m
              )
            };
          }
          return path;
        })
      );

      setIsEditModalOpen(false);
      setSelectedMaterial(null);
      toast.success('Material updated successfully');
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error(error.response?.data?.error || 'Failed to update material');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteMaterial(squad.id, materialId);
      setMaterials(prev => prev.filter(material => material.id !== materialId));
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleMoveMaterial = async (materialId, direction) => {
    const currentIndex = materials.findIndex(m => m.id === materialId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === materials.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newMaterials = [...materials];
    const [movedMaterial] = newMaterials.splice(currentIndex, 1);
    newMaterials.splice(newIndex, 0, movedMaterial);

    // Update local state immediately for smooth UI
    setMaterials(newMaterials);

    try {
      // Update order in backend
      await updateMaterial(squad.id, materialId, {
        order: newIndex
      });
    } catch (error) {
      // Revert on error
      toast.error('Failed to update material order');
      setMaterials(materials);
    }
  };

  const onDragEnd = async (result) => {
    setIsDragging(false);
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.index === destination.index) return;

    try {
      const pathId = parseInt(result.draggableId.split('-')[0]);
      const materialId = parseInt(result.draggableId.split('-')[1]);
      
      const path = learningPaths.find(p => p.id === pathId);
      if (!path) return;

      // Create new array of materials with updated order
      const newMaterials = Array.from(path.materials);
      const [removed] = newMaterials.splice(source.index, 1);
      newMaterials.splice(destination.index, 0, removed);

      // Update orders for all affected materials
      const updatedMaterials = newMaterials.map((material, index) => ({
        ...material,
        order: index
      }));

      // Optimistic update
      const newPaths = learningPaths.map(p => {
        if (p.id === pathId) {
          return { ...p, materials: updatedMaterials };
        }
        return p;
      });
      setLearningPaths(newPaths);

      // Update in backend
      await updateMaterial(squad.id, materialId, {
        order: destination.index,
        pathId: pathId
      });

    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to reorder materials');
      // Reload data if error
      fetchData();
    }
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
        <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setIsDragging(true)}>
        <div className="space-y-6">
            {learningPaths.map((path) => (
              <div key={path.id} className="bg-[#0A0A0A] border border-gray-800 rounded-xl overflow-hidden">
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

                {/* Materials List with Drag and Drop */}
                <Droppable droppableId={`path-${path.id}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="divide-y divide-gray-800"
                    >
                      {path.materials?.map((material, index) => (
                        <Draggable
                        key={material.id} 
                          draggableId={`${path.id}-${material.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => !isDragging && handleMaterialClick(material)}
                              className={`group p-4 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                                snapshot.isDragging ? 'bg-gray-800 shadow-lg' : ''
                              }`}
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                        handleEditClick(material);
                                }}
                                className="p-2 text-blue-500 hover:text-blue-600"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMaterial(material.id);
                                }}
                                className="p-2 text-red-500 hover:text-red-600"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                  )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                </div>
                  )}
                </Droppable>

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
            ))}
            </div>
        </DragDropContext>
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
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'text')}
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                          >
                            <FiType className="w-4 h-4" />
                            Add Text
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'image')}
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                          >
                            <FiImage className="w-4 h-4" />
                            Add Image
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'video')}
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                          >
                            <FiVideo className="w-4 h-4" />
                            Add Video
                          </button>
                        </div>

                        {/* Media List */}
                        <div className="space-y-4 mt-4">
                          {content.media.map((media, mediaIndex) => (
                            <div key={mediaIndex} className="relative group">
                              {/* Remove Media Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(stageIndex, contentIndex, mediaIndex)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX className="w-4 h-4" />
                              </button>

                              {/* Text Content */}
                              {media.type === 'text' && (
                                <textarea
                                  value={media.content || ''}
                                  onChange={(e) => handleMediaChange(stageIndex, contentIndex, mediaIndex, 'content', e.target.value)}
                                  placeholder="Enter text content..."
                                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg resize-y min-h-[100px]"
                                />
                              )}

                              {/* Image Content */}
                              {media.type === 'image' && media.url && (
                                <div className="relative aspect-video">
                                  <img
                                    src={media.url}
                                    alt="Content"
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                </div>
                              )}

                              {/* Video Content */}
                              {media.type === 'video' && media.url && (
                                <div className="relative aspect-video">
                                  <iframe
                                    src={media.url}
                                    title="Video content"
                                    className="w-full h-full rounded-lg"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
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

      {/* Edit Material Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaterial(null);
        }}
        title="Edit Material"
        size="7xl"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col h-[95vh]">
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Title
                </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  required
            />
          </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
                  required
            />
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  XP Reward
                </label>
                <input
                  type="number"
                  value={editForm.xp_reward}
                  onChange={(e) => setEditForm(prev => ({ ...prev, xp_reward: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  value={editForm.estimated_time}
                  onChange={(e) => setEditForm(prev => ({ ...prev, estimated_time: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  min="0"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Category
                </label>
                <select
                  value={editForm.categoryId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
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
            </div>

            {/* Stages Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-sm py-4 z-10">
                <h3 className="text-xl font-medium text-white">Stages</h3>
                <button
                  type="button"
                  onClick={() => {
                    const newStages = [...editForm.stages];
                    newStages.push({
                      title: `Stage ${newStages.length + 1}`,
                      contents: []
                    });
                    setEditForm(prev => ({ ...prev, stages: newStages }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiPlus /> Add Stage
                </button>
              </div>

              {editForm.stages?.map((stage, stageIndex) => (
                <div key={stageIndex} className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl space-y-6">
                  {/* Stage Title */}
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="text"
                      value={stage.title}
                      onChange={(e) => {
                        const newStages = [...editForm.stages];
                        newStages[stageIndex].title = e.target.value;
                        setEditForm(prev => ({ ...prev, stages: newStages }));
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-lg font-medium"
                      placeholder="Stage title"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newStages = editForm.stages.filter((_, idx) => idx !== stageIndex);
                        setEditForm(prev => ({ ...prev, stages: newStages }));
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contents */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-200">Contents</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newStages = [...editForm.stages];
                          if (!newStages[stageIndex].contents) {
                            newStages[stageIndex].contents = [];
                          }
                          newStages[stageIndex].contents.push({
                            type: 'text',
                            content: '',
                            order: newStages[stageIndex].contents.length + 1
                          });
                          setEditForm(prev => ({ ...prev, stages: newStages }));
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        <FiPlus /> Add Content
                      </button>
                    </div>

                    {stage.contents?.map((content, contentIndex) => (
                      <div key={contentIndex} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-medium text-white">Content {contentIndex + 1}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newStages = [...editForm.stages];
                              newStages[stageIndex].contents = stage.contents.filter((_, idx) => idx !== contentIndex);
                              setEditForm(prev => ({ ...prev, stages: newStages }));
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">Text Content</label>
                          <textarea
                            value={content.content || content.text || ''}
                            onChange={(e) => {
                              const newStages = [...editForm.stages];
                              newStages[stageIndex].contents[contentIndex].content = e.target.value;
                              newStages[stageIndex].contents[contentIndex].text = e.target.value;
                              setEditForm(prev => ({ ...prev, stages: newStages }));
                            }}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            rows="4"
                            placeholder="Enter text content..."
                          />
                        </div>

                        {/* Image Content - Show directly if exists */}
                        {content.media?.map((media, mediaIndex) => (
                          media.type === 'image' && media.url && (
                            <div key={mediaIndex} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-300">Image</label>
                              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                                <img 
                                  src={media.url} 
                                  alt={`Content ${contentIndex + 1} Image ${mediaIndex + 1}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )
                        ))}

                        {/* Show image if it exists in content directly */}
                        {content.type === 'image' && content.url && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Image</label>
                            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={content.url} 
                                alt={`Content ${contentIndex + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {/* Video Content */}
                        {content.type === 'video' && content.url && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Video</label>
                            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                              <iframe
                                src={content.url}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}

                        {/* Media Controls */}
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'image')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                          >
                            <FiImage /> Add Image
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddMedia(stageIndex, contentIndex, 'video')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                          >
                            <FiVideo /> Add Video
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-800 bg-black sticky bottom-0">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedMaterial(null);
              }}
              className="px-6 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaterialsSection; 