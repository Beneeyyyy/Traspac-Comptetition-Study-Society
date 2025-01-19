import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // This enables sending cookies
});

// Create a new learning path
export const createLearningPath = async (squadId, data) => {
  try {
    const response = await api.post(`/api/squads/${squadId}/learning-paths`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all learning paths for a squad
export const getSquadLearningPaths = async (squadId) => {
  try {
    const response = await api.get(`/api/squads/${squadId}/learning-paths`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a specific learning path
export const getLearningPath = async (squadId, pathId) => {
  try {
    const response = await api.get(`/api/squads/${squadId}/learning-paths/${pathId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a learning path
export const updateLearningPath = async (squadId, pathId, data) => {
  try {
    const response = await api.put(`/api/squads/${squadId}/learning-paths/${pathId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a learning path
export const deleteLearningPath = async (squadId, pathId) => {
  try {
    const response = await api.delete(`/api/squads/${squadId}/learning-paths/${pathId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new module in a learning path
export const createModule = async (squadId, pathId, data) => {
  try {
    const response = await api.post(
      `/api/squads/${squadId}/learning-paths/${pathId}/modules`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create module';
  }
};

// Update module order
export const updateModuleOrder = async (squadId, pathId, moduleId, newOrder) => {
  try {
    const response = await api.put(
      `/api/squads/${squadId}/learning-paths/${pathId}/modules/${moduleId}/order`,
      { newOrder }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update module order';
  }
}; 