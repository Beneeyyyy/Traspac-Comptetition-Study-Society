import axios from './axios';

// Create a new material
export const createMaterial = async (squadId, materialData) => {
  try {
    const response = await axios.post(`/api/squads/${squadId}/materials`, materialData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create material';
  }
};

// Get all materials for a squad
export const getSquadMaterials = async (squadId) => {
  try {
    const response = await axios.get(`/api/squads/${squadId}/materials`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch materials';
  }
};

// Update a material
export const updateMaterial = async (squadId, materialId, materialData) => {
  try {
    const response = await axios.put(`/api/squads/${squadId}/materials/${materialId}`, materialData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update material';
  }
};

// Delete a material
export const deleteMaterial = async (squadId, materialId) => {
  try {
    const response = await axios.delete(`/api/squads/${squadId}/materials/${materialId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete material';
  }
}; 