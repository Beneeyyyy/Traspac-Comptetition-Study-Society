import React, { useState, useEffect } from 'react'
import { FiUsers, FiSettings, FiTrash2, FiEdit2, FiShield, FiBook, FiLayout, FiAward, FiInfo, FiMessageSquare, FiX, FiPlus, FiFileText } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getSquadMembers, updateSquad as updateSquadAPI, deleteSquad, manageSquadMember } from '@/api/squad'
import { createLearningPath, getSquadLearningPaths, updateLearningPath, deleteLearningPath } from '@/api/learningPath'
import { createMaterial, getSquadMaterials, updateMaterial, deleteMaterial } from '@/api/material'
import axios from 'axios'

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0A0A0A] rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiX className="text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

const AdminSection = ({ squad, setSquad }) => {
  const [activeModal, setActiveModal] = useState(null)
  const [formData, setFormData] = useState({
    about: '',
    rules: [],
    newRule: '',
    learningPath: {
      title: '',
      description: '',
      materialIds: []
    },
    material: {
      title: '',
      description: '',
      xp_reward: 0,
      estimated_time: 30,
      learningPathId: null,
      stages: [{
        title: 'Introduction',
        content: 'Welcome to this material'
      }]
    }
  })
  const navigate = useNavigate()

  // Add state for materials
  const [materials, setMaterials] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [availableMaterials, setAvailableMaterials] = useState([])

  // Add state for learning paths
  const [learningPaths, setLearningPaths] = useState([])
  const [selectedPath, setSelectedPath] = useState(null)
  const [view, setView] = useState('list')

  // Add state for categories
  const [categories, setCategories] = useState([])

  // Load materials when component mounts
  useEffect(() => {
    if (squad?.id) {
    const loadMaterials = async () => {
      try {
        const squadMaterials = await getSquadMaterials(squad.id);
        setMaterials(squadMaterials);
        setAvailableMaterials(squadMaterials);
      } catch (error) {
          console.error('Failed to load materials:', error);
        toast.error('Failed to load materials');
      }
    };
    loadMaterials();
    }
  }, [squad?.id]);

  // Load learning paths
  useEffect(() => {
    if (squad?.id) {
    const loadLearningPaths = async () => {
      try {
        const paths = await getSquadLearningPaths(squad.id);
        setLearningPaths(paths);
      } catch (error) {
          console.error('Failed to load learning paths:', error);
        toast.error('Failed to load learning paths');
      }
    };
    loadLearningPaths();
    }
  }, [squad?.id]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Update formData when squad changes
  useEffect(() => {
    if (squad) {
      setFormData(prev => ({
        ...prev,
        about: squad.about || '',
        rules: squad.rules || []
      }))
    }
  }, [squad])

  if (!squad) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleUpdateSquad = async (type) => {
    try {
      let updateData = {};
      
      switch (type) {
        case 'about':
          updateData = { about: formData.about };
          break;
        case 'rules':
          updateData = { rules: formData.rules };
          break;
        case 'settings':
          updateData = { settings: formData.settings };
          break;
        default:
          console.warn('Unknown update type:', type);
          return;
      }

      const updatedSquad = await updateSquadAPI(squad.id, updateData);
      
      // Update context with new data
      setSquad(updatedSquad);
      toast.success('Squad updated successfully');
      setActiveModal(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update squad');
    }
  };

  const handleManageMembers = async (memberId, action, role) => {
    try {
      await manageSquadMember(squad.id, memberId, { action, role });
      
      // Refresh squad data to get updated member list
      const updatedSquad = await getSquadMembers(squad.id);
      setSquad(updatedSquad);
      
      toast.success(action === 'remove' ? 'Member removed successfully' : 'Member role updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to manage member');
    }
  };

  const handleDeleteSquad = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this squad? This action cannot be undone.')) {
        await deleteSquad(squad.id);
        toast.success('Squad deleted successfully');
        navigate('/community'); // Redirect to community page
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete squad');
    }
  };

  // Form handlers
  const handleInputChange = (e, type = null) => {
    const { name, value } = e.target;
    
    if (type === 'material') {
      setFormData(prev => ({
        ...prev,
        material: {
          ...prev.material,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddRule = () => {
    if (formData.newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, prev.newRule.trim()],
        newRule: ''
      }))
    }
  }

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (type) => {
    handleUpdateSquad(type);
  }

  const overviewActions = [
    {
      id: 'edit-about',
      label: 'Edit About',
      description: 'Update squad description and basic information',
      icon: FiInfo,
      onClick: () => setActiveModal('about'),
      color: 'blue'
    },
    {
      id: 'manage-rules',
      label: 'Squad Rules',
      description: 'Set and modify squad rules and guidelines',
      icon: FiShield,
      onClick: () => setActiveModal('rules'),
      color: 'purple'
    },
    {
      id: 'manage-members',
      label: 'Manage Members',
      description: 'View, add, remove, or modify member roles',
      icon: FiUsers,
      onClick: () => setActiveModal('members'),
      color: 'emerald'
    }
  ]

  const learningActions = [
    {
      id: 'learning-path',
      label: 'Learning Paths',
      description: 'Create and manage learning paths, modules, and lessons',
      icon: FiBook,
      onClick: () => setActiveModal('learning-path'),
      color: 'blue'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      description: 'Set up badges, rewards, and milestones for members',
      icon: FiAward,
      onClick: () => setActiveModal('achievements'),
      color: 'amber'
    }
  ]

  const discussionActions = [
    {
      id: 'discussion-settings',
      label: 'Discussion Settings',
      description: 'Configure discussion rules and permissions',
      icon: FiMessageSquare,
      onClick: () => setActiveModal('discussion-settings'),
      color: 'blue'
    },
    {
      id: 'squad-settings',
      label: 'Squad Settings',
      description: 'Update squad information and preferences',
      icon: FiSettings,
      onClick: () => setActiveModal('squad-settings'),
      color: 'purple'
    }
  ]

  // Add Members Modal Content
  const MembersModal = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          // Assuming we have this endpoint
          const response = await getSquadMembers(squad.id);
          setMembers(response);
        } catch (error) {
          toast.error('Failed to fetch members');
        } finally {
          setLoading(false);
        }
      };

      fetchMembers();
    }, [squad.id]);

    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src={member.image || '/default-avatar.jpg'}
                alt={member.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-white font-medium">{member.name}</h4>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            </div>
            
            {member.role !== 'admin' && (
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => handleManageMembers(member.id, 'update', e.target.value)}
                  className="bg-black border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white"
                >
                  <option value="member">Member</option>
                  <option value="moderator">Moderator</option>
                </select>
                
                <button
                  onClick={() => handleManageMembers(member.id, 'remove')}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Update handleCreatePath
  const handleCreatePath = async (e) => {
    e.preventDefault();
    try {
      const newPath = await createLearningPath(squad.id, {
        title: formData.learningPath.title,
        description: formData.learningPath.description,
        materialIds: formData.learningPath.materialIds || []
      });
      setLearningPaths(prev => [...prev, newPath]);
      setFormData(prev => ({
        ...prev,
        learningPath: { title: '', description: '', materialIds: [] }
      }));
      setView('list');
      toast.success('Learning path created successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to create learning path');
    }
  };

  // Add handleUpdatePath
  const handleUpdatePath = async (pathId) => {
    try {
      const updatedPath = await updateLearningPath(squad.id, pathId, {
        title: selectedPath.title,
        description: selectedPath.description,
        materialIds: selectedPath.materialIds || [],
        order: selectedPath.order
      });
      setLearningPaths(prev => prev.map(p => p.id === pathId ? updatedPath : p));
      setView('list');
      toast.success('Learning path updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update learning path');
    }
  };

  // Add handleDeletePath
  const handleDeletePath = async (pathId) => {
    if (!window.confirm('Are you sure you want to delete this learning path?')) return;
    try {
      await deleteLearningPath(squad.id, pathId);
      setLearningPaths(prev => prev.filter(p => p.id !== pathId));
      toast.success('Learning path deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete learning path');
    }
  };

  // Update LearningPathModal to include material selection
  const LearningPathModal = () => {
    const [availableMaterials, setAvailableMaterials] = useState(squad.materials || []);

    return (
      <div className="space-y-6">
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Learning Paths</h3>
              <button
                onClick={() => setView('create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiPlus /> Create New Path
              </button>
            </div>
            
            <div className="space-y-4">
              {learningPaths.map(path => (
                <div key={path.id} className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-white">{path.title}</h4>
                      <p className="text-gray-400 mt-1">{path.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {path.materials?.length || 0} materials
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPath(path);
                          setView('edit');
                        }}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeletePath(path.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {(view === 'create' || view === 'edit') && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (view === 'edit') {
              handleUpdatePath(selectedPath.id);
            } else {
              handleCreatePath(e);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={view === 'edit' ? selectedPath.title : formData.learningPath.title}
                onChange={e => {
                  if (view === 'edit') {
                    setSelectedPath(prev => ({ ...prev, title: e.target.value }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      learningPath: { ...prev.learningPath, title: e.target.value }
                    }));
                  }
                }}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={view === 'edit' ? selectedPath.description : formData.learningPath.description}
                onChange={e => {
                  if (view === 'edit') {
                    setSelectedPath(prev => ({ ...prev, description: e.target.value }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      learningPath: { ...prev.learningPath, description: e.target.value }
                    }));
                  }
                }}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Materials</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableMaterials.map(material => (
                  <label key={material.id} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={view === 'edit' 
                        ? selectedPath.materialIds?.includes(material.id)
                        : formData.learningPath.materialIds?.includes(material.id)
                      }
                      onChange={e => {
                        const materialId = material.id;
                        if (view === 'edit') {
                          setSelectedPath(prev => ({
                            ...prev,
                            materialIds: e.target.checked
                              ? [...(prev.materialIds || []), materialId]
                              : (prev.materialIds || []).filter(id => id !== materialId)
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            learningPath: {
                              ...prev.learningPath,
                              materialIds: e.target.checked
                                ? [...(prev.learningPath.materialIds || []), materialId]
                                : (prev.learningPath.materialIds || []).filter(id => id !== materialId)
                            }
                          }));
                        }
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white">{material.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  if (view === 'edit') {
                    setSelectedPath(null);
                  }
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {view === 'edit' ? 'Update' : 'Create'} Path
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  // Add material handlers
  const handleCreateMaterial = async () => {
    try {
      // Validate stages
      if (!formData.material.stages || formData.material.stages.length === 0) {
        toast.error('Material must have at least one stage');
        return;
      }

      // Validate stage data
      for (const stage of formData.material.stages) {
        if (!stage.title || !stage.content) {
          toast.error('Each stage must have a title and content');
          return;
        }
      }

      const newMaterial = await createMaterial(squad.id, formData.material);
      setMaterials(prev => [...prev, newMaterial]);
      toast.success('Material created successfully');
      setActiveModal(null);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        material: {
          title: '',
          description: '',
          xp_reward: 0,
          estimated_time: 30,
          learningPathId: null,
          stages: [{
            title: 'Introduction',
            content: 'Welcome to this material'
          }]
        }
      }));
    } catch (error) {
      console.error('Error creating material:', error);
      toast.error(error.response?.data?.error || 'Failed to create material');
    }
  };

  const handleUpdateMaterial = async (materialData) => {
    if (!selectedMaterial) return;
    try {
      const updatedMaterial = await updateMaterial(squad.id, selectedMaterial.id, materialData);
      
      // Update materials list
      setMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
      setAvailableMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
      
      // Handle learning path assignment changes
      const oldPathId = selectedMaterial.learningPathId;
      const newPathId = materialData.learningPathId;
      
      if (oldPathId !== newPathId) {
        // Remove from old path if exists
        if (oldPathId) {
          const oldPath = learningPaths.find(p => p.id === oldPathId);
          if (oldPath) {
            await updateLearningPath(squad.id, oldPathId, {
              materialIds: oldPath.materialIds.filter(id => id !== selectedMaterial.id)
            });
          }
        }
        
        // Add to new path if exists
        if (newPathId) {
          const newPath = learningPaths.find(p => p.id === newPathId);
          if (newPath) {
            await updateLearningPath(squad.id, newPathId, {
              materialIds: [...(newPath.materialIds || []), selectedMaterial.id]
            });
          }
        }
        
        // Refresh learning paths
        const paths = await getSquadLearningPaths(squad.id);
        setLearningPaths(paths);
      }

      toast.success('Material updated successfully');
      setActiveModal(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update material');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteMaterial(squad.id, materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      setAvailableMaterials(prev => prev.filter(m => m.id !== materialId));
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete material');
    }
  };

  // Add stage handling functions
  const handleAddStage = () => {
    setFormData(prev => ({
      ...prev,
      material: {
        ...prev.material,
        stages: [
          ...prev.material.stages,
          {
            title: `Stage ${prev.material.stages.length + 1}`,
            content: ''
          }
        ]
      }
    }));
  };

  const handleRemoveStage = (index) => {
    setFormData(prev => ({
      ...prev,
      material: {
        ...prev.material,
        stages: prev.material.stages.filter((_, i) => i !== index)
      }
    }));
  };

  const handleStageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      material: {
        ...prev.material,
        stages: prev.material.stages.map((stage, i) => 
          i === index ? { ...stage, [field]: value } : stage
        )
      }
    }));
  };

  // Add material actions
  const materialActions = [
    {
      id: 'create-material',
      label: 'Create Material',
      description: 'Create new learning material for the squad',
      icon: FiFileText,
      onClick: () => {
        setSelectedMaterial(null);
        setFormData(prev => ({
          ...prev,
          material: {
            title: '',
            description: '',
            xp_reward: 0,
            estimated_time: 30,
            learningPathId: null,
            categoryId: null,
            stages: [{
              title: 'Introduction',
              content: 'Welcome to this material'
            }]
          }
        }));
        setActiveModal('material');
      },
      color: 'emerald'
    },
    {
      id: 'manage-materials',
      label: 'Manage Materials',
      description: 'View and manage existing materials',
      icon: FiBook,
      onClick: () => setActiveModal('materials-list'),
      color: 'blue'
    }
  ];

  // Update MaterialModal component
  const MaterialModal = () => {
    const [materialForm, setMaterialForm] = useState({
      title: '',
      description: '',
      xp_reward: 0,
      estimated_time: 30,
      learningPathId: null,
      categoryId: null,
      stages: [{
        title: 'Introduction',
        contents: [{
          type: 'text',
          content: 'Welcome to this material',
          order: 0
        }]
      }]
    });

    useEffect(() => {
      if (selectedMaterial) {
        setMaterialForm({
          title: selectedMaterial.title,
          description: selectedMaterial.description,
          xp_reward: selectedMaterial.xp_reward,
          estimated_time: selectedMaterial.estimated_time,
          learningPathId: selectedMaterial.learningPathId,
          categoryId: selectedMaterial.categoryId,
          stages: selectedMaterial.stages.map(stage => ({
            title: stage.title,
            contents: stage.contents.map(content => ({
              type: content.type,
              content: content.content,
              order: content.order
            }))
          }))
        });
      }
    }, [selectedMaterial]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setMaterialForm(prev => ({
        ...prev,
        [name]: name === 'xp_reward' || name === 'estimated_time' ? Number(value) : value
      }));
    };

    const handleAddStage = () => {
      setMaterialForm(prev => ({
        ...prev,
        stages: [...prev.stages, {
          title: `Stage ${prev.stages.length + 1}`,
          contents: [{
            type: 'text',
            content: '',
            order: 0
          }]
        }]
      }));
    };

    const handleRemoveStage = (stageIndex) => {
      setMaterialForm(prev => ({
        ...prev,
        stages: prev.stages.filter((_, idx) => idx !== stageIndex)
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
                    type: 'text',
                    content: '',
                    order: stage.contents.length
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
                contents: stage.contents.filter((_, i) => i !== contentIndex).map((content, i) => ({
                  ...content,
                  order: i
                }))
              }
            : stage
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
                contents: stage.contents.map((content, i) => 
                  i === contentIndex 
                    ? { ...content, [field]: value }
                    : content
                )
              }
            : stage
        )
      }));
    };

    const handleSubmit = async (e) => {
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
          stages: materialForm.stages.map(stage => ({
            ...stage,
            contents: stage.contents.map(content => ({
              ...content,
              type: content.type,
              content: content.content
            }))
          }))
        };

        if (selectedMaterial) {
          await handleUpdateMaterial(materialData);
        } else {
          const newMaterial = await createMaterial(squad.id, materialData);
          setMaterials(prev => [...prev, newMaterial]);
          toast.success('Material created successfully');
          setActiveModal(null);
        }
      } catch (error) {
        console.error('Failed to save material:', error);
        toast.error('Failed to save material');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Category</label>
          <select
            name="categoryId"
            value={materialForm.categoryId || ''}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Learning Path Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Learning Path</label>
          <select
            name="learningPathId"
            value={materialForm.learningPathId || ''}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
          >
            <option value="">Select a learning path (optional)</option>
            {learningPaths.map(path => (
              <option key={path.id} value={path.id}>{path.title}</option>
            ))}
          </select>
        </div>

        {/* Material Title */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={materialForm.title}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter material title"
            required
          />
        </div>

        {/* Material Description */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
          <textarea
            name="description"
            value={materialForm.description}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter material description"
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
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
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
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
              min="0"
              required
            />
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
              <input
                type="text"
                value={stage.title}
                onChange={e => handleStageChange(stageIndex, 'title', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
                placeholder="Stage title"
                required
              />
              
              {/* Contents */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h6 className="text-sm font-medium text-gray-400">Contents</h6>
                  <button
                    type="button"
                    onClick={() => handleAddContent(stageIndex)}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200"
                  >
                    <FiPlus className="w-3 h-3" />
                    <span>Add Content</span>
                  </button>
                </div>
                {stage.contents.map((content, contentIndex) => (
                  <div key={contentIndex} className="space-y-2 p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Content {contentIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveContent(stageIndex, contentIndex)}
                        className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                    <select
                      value={content.type}
                      onChange={e => handleContentChange(stageIndex, contentIndex, 'type', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-gray-100"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <textarea
                      value={content.content}
                      onChange={e => handleContentChange(stageIndex, contentIndex, 'content', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-100"
                      placeholder="Content"
                      rows="3"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
          >
            {selectedMaterial ? 'Update' : 'Create'} Material
          </button>
        </div>
      </form>
    );
  };

  // Add materials list modal content
  const MaterialsListModal = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {materials.map(material => (
          <div key={material.id} className="p-4 bg-gray-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-100">{material.title}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedMaterial(material);
                    setFormData(prev => ({
                      ...prev,
                      material: {
                        ...material,
                        stages: material.stages.map(stage => ({
                          ...stage,
                          content: stage.contents
                        }))
                      }
                    }));
                    setActiveModal('material');
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-200"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-200"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">{material.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{material.xp_reward} XP</span>
              <span>{material.estimated_time} minutes</span>
              <span>{material.stages.length} stages</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overview Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Overview Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overviewActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                <action.icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{action.label}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Learning Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <button
              onClick={() => setActiveModal('learning-path')}
              className="w-full flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors text-left"
            >
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <FiBook size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Learning Paths</h3>
                <p className="text-gray-400 text-sm">Create and manage learning paths</p>
              </div>
            </button>
          </div>

          {/* Material Management */}
          <div className="space-y-4">
            {materialActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`w-full flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
              >
                <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                  <action.icon size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{action.label}</h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discussion Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Discussion Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discussionActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                <action.icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{action.label}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)}
        title="Edit Squad Information"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('about'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Squad Description</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              rows={4}
              placeholder="Enter squad description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'rules'} 
        onClose={() => setActiveModal(null)}
        title="Manage Squad Rules"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('rules'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Current Rules</label>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <span className="flex-1 p-2 rounded-lg bg-gray-900 text-white">{rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(index)}
                    className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Add New Rule</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="newRule"
                value={formData.newRule}
                onChange={handleInputChange}
                className="flex-1 bg-black rounded-lg border border-gray-800 p-3 text-white"
                placeholder="Enter new rule..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddRule()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Rules
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'learning-path'} 
        onClose={() => setActiveModal(null)}
        title="Learning Path Management"
      >
        <LearningPathModal />
      </Modal>

      <Modal 
        isOpen={activeModal === 'members'} 
        onClose={() => setActiveModal(null)}
        title="Manage Members"
      >
        <MembersModal />
      </Modal>

      {/* Danger Zone */}
      <div className="border border-red-500/10 rounded-xl p-6">
        <h3 className="text-red-500 font-medium mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Delete Squad</h4>
              <p className="text-gray-400 text-sm">
                Permanently delete this squad and all its data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeleteSquad}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Delete Squad
            </button>
          </div>
        </div>
      </div>

      {/* Material Management */}
      <Modal isOpen={activeModal === 'material'} onClose={() => setActiveModal(null)} title={selectedMaterial ? 'Edit Material' : 'Create Material'}>
        <MaterialModal />
      </Modal>

      <Modal isOpen={activeModal === 'materials-list'} onClose={() => setActiveModal(null)} title="Manage Materials">
        <MaterialsListModal />
      </Modal>
    </div>
  )
}

export default AdminSection 