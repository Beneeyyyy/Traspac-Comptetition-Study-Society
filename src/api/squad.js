import axios from './axios';

// Squad Management
export const createSquad = async (data) => {
  const response = await axios.post('/api/squads', data);
  return response.data;
};

export const getSquads = async (filters = {}) => {
  const response = await axios.get('/api/squads', { params: filters });
  return response.data;
};

export const getSquadById = async (id) => {
  const response = await axios.get(`/api/squads/${id}`);
  return response.data;
};

export const updateSquad = async (squadId, data) => {
  const response = await axios.put(`/api/squads/${squadId}`, data);
  return response.data;
};

export const deleteSquad = async (squadId) => {
  const response = await axios.delete(`/api/squads/${squadId}`);
  return response.data;
};

// Squad Membership
export const joinSquad = async (squadId) => {
  const response = await axios.post(`/api/squads/${squadId}/join`);
  return response.data;
};

export const leaveSquad = async (squadId) => {
  const response = await axios.post(`/api/squads/${squadId}/leave`);
  return response.data;
};

export const updateMemberRole = async (squadId, memberId, role) => {
  try {
    const response = await axios.put(`/api/squads/${squadId}/members/${memberId}`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update member role';
  }
};

// Squad Materials
export const createSquadMaterial = async (squadId, data) => {
  const response = await axios.post(`/api/squads/${squadId}/materials`, data);
  return response.data;
};

export const getSquadMaterials = async (squadId) => {
  const response = await axios.get(`/api/squads/${squadId}/materials`);
  return response.data;
};

export const updateSquadMaterial = async (squadId, materialId, data) => {
  const response = await axios.put(`/api/squads/${squadId}/materials/${materialId}`, data);
  return response.data;
};

export const deleteSquadMaterial = async (squadId, materialId) => {
  const response = await axios.delete(`/api/squads/${squadId}/materials/${materialId}`);
  return response.data;
};

// Squad Discussions
export const createDiscussion = async (squadId, data) => {
  try {
    const response = await axios.post(`/api/squads/${squadId}/discussions`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create discussion';
  }
};

export const getDiscussions = async (squadId) => {
  const response = await axios.get(`/api/squads/${squadId}/discussions`);
  return response.data;
};

export const updateDiscussion = async (squadId, discussionId, data) => {
  try {
    const response = await axios.put(`/api/squads/${squadId}/discussions/${discussionId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update discussion';
  }
};

export const deleteDiscussion = async (squadId, discussionId) => {
  try {
    await axios.delete(`/api/squads/${squadId}/discussions/${discussionId}`);
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete discussion';
  }
};

export const addDiscussionReply = async (squadId, discussionId, data) => {
  const response = await axios.post(`/api/squads/${squadId}/discussions/${discussionId}/replies`, data);
  return response.data;
};

// Manage squad member
export const manageSquadMember = async (squadId, memberId, data) => {
  const response = await axios.put(`/api/squads/${squadId}/members/${memberId}`, data);
  return response.data;
};

// Get squad members
export const getSquadMembers = async (squadId) => {
  const response = await axios.get(`/api/squads/${squadId}/members`);
  return response.data;
};

// Create new material
export const createMaterial = async (squadId, data) => {
  try {
    const response = await axios.post(`/api/squads/${squadId}/materials`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create material';
  }
};

// Update material
export const updateMaterial = async (squadId, materialId, data) => {
  try {
    const response = await axios.put(`/api/squads/${squadId}/materials/${materialId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update material';
  }
};

// Delete material
export const deleteMaterial = async (squadId, materialId) => {
  try {
    await axios.delete(`/api/squads/${squadId}/materials/${materialId}`);
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete material';
  }
};

// Remove member
export const removeMember = async (squadId, memberId) => {
  try {
    await axios.delete(`/api/squads/${squadId}/members/${memberId}`);
  } catch (error) {
    throw error.response?.data?.error || 'Failed to remove member';
  }
}; 