import axios from 'axios';

const API_URL = '/api/progress';

// Get progress for a specific material
export const getMaterialProgress = async (userId, materialId) => {
  try {
    const response = await axios.get(`${API_URL}/material/${userId}/${materialId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching material progress:', error);
    throw error;
  }
};

// Update progress for a specific material
export const updateMaterialProgress = async (userId, materialId, progressData) => {
  try {
    const response = await axios.post(`${API_URL}/material/${userId}/${materialId}`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating material progress:', error);
    throw error;
  }
};

// Get user's overall progress
export const getUserProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Get user's stats and achievements
export const getUserStats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Calculate progress percentage
export const calculateProgress = (currentStage, currentContent, totalStages, stageContents) => {
  const totalContents = stageContents.length;
  const completedContents = currentContent + 1;
  const stageProgress = (completedContents / totalContents) * 100;
  const overallProgress = ((currentStage * 100) + stageProgress) / totalStages;
  
  return Math.min(Math.round(overallProgress), 100);
}; 