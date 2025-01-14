import api from '@/utils/api';

export const communityService = {
  fetchCommunities: async () => {
    const response = await api.get('/api/communities');
    return response.data;
  },

  joinCommunity: async (communityId) => {
    const response = await api.post(`/api/communities/${communityId}/join`);
    return response.data;
  },

  leaveCommunity: async (communityId) => {
    const response = await api.post(`/api/communities/${communityId}/leave`);
    return response.data;
  }
}; 