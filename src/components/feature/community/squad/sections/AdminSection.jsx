import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MaterialModal = () => {
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    xp_reward: 0,
    estimated_time: 30,
    learningPathId: null,
    categoryId: '',
    stages: [{
      title: 'Introduction',
      content: 'Welcome to this material'
    }]
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories when component mounts
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

  useEffect(() => {
    if (selectedMaterial) {
      setMaterialForm({
        title: selectedMaterial.title,
        description: selectedMaterial.description,
        xp_reward: selectedMaterial.xp_reward,
        estimated_time: selectedMaterial.estimated_time,
        learningPathId: selectedMaterial.learningPathId,
        categoryId: selectedMaterial.categoryId || '',
        stages: selectedMaterial.stages.map(stage => ({
          title: stage.title,
          content: stage.contents || ''
        }))
      });
    }
  }, [selectedMaterial]);

  // ... existing handleChange, handleAddStage, handleRemoveStage, handleStageChange ...

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    try {
      // Validate stages
      if (!materialForm.stages || materialForm.stages.length === 0) {
        toast.error('Material must have at least one stage');
        return;
      }

      // Validate category
      if (!materialForm.categoryId) {
        toast.error('Please select a category');
        return;
      }

      // Validate stage data
      for (const stage of materialForm.stages) {
        if (!stage.title || !stage.content) {
          toast.error('Each stage must have a title and content');
          return;
        }
      }

      const materialData = {
        ...materialForm,
        stages: materialForm.stages.map(stage => ({
          ...stage,
          contents: stage.content // Convert content to contents for backend
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
          value={materialForm.categoryId}
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
      {/* ... rest of existing form fields ... */}
    </form>
  );
};

export default MaterialModal; 