import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`, { withCredentials: true });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}; 