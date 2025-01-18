import axios from './axios';

// Squad Management
export const createSquad = async (data) => {
  const response = await axios.post('/squads', data);
  return response.data;
};

export const getSquads = async (filters = {}) => {
  const response = await axios.get('/squads', { params: filters });
  return response.data;
};

export const getSquadById = async (id) => {
  const response = await axios.get(`/squads/${id}`);
  return response.data;
};

export const updateSquad = async (id, data) => {
  const response = await axios.put(`/squads/${id}`, data);
  return response.data;
};

export const deleteSquad = async (id) => {
  const response = await axios.delete(`/squads/${id}`);
  return response.data;
};

// Squad Membership
export const joinSquad = async (squadId) => {
  const response = await axios.post(`/squads/${squadId}/join`);
  return response.data;
};

export const leaveSquad = async (squadId) => {
  const response = await axios.post(`/squads/${squadId}/leave`);
  return response.data;
};

export const updateMemberRole = async (squadId, userId, role) => {
  const response = await axios.put(`/squads/${squadId}/members/${userId}`, { role });
  return response.data;
};

// Squad Materials
export const createSquadMaterial = async (squadId, data) => {
  const response = await axios.post(`/squads/${squadId}/materials`, data);
  return response.data;
};

export const getSquadMaterials = async (squadId) => {
  const response = await axios.get(`/squads/${squadId}/materials`);
  return response.data;
};

// Squad Discussions
export const createDiscussion = async (squadId, data) => {
  const response = await axios.post(`/squads/${squadId}/discussions`, data);
  return response.data;
};

export const getDiscussions = async (squadId) => {
  const response = await axios.get(`/squads/${squadId}/discussions`);
  return response.data;
};

export const addDiscussionReply = async (squadId, discussionId, data) => {
  const response = await axios.post(`/squads/${squadId}/discussions/${discussionId}/replies`, data);
  return response.data;
}; 