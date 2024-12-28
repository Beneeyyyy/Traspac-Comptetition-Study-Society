import axios from 'axios'

const API_URL = '/api/study-groups'  // You'll need to adjust this to your actual API endpoint

export const studyGroupService = {
  // Get all study groups
  async getAllGroups() {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      console.error('Error fetching study groups:', error)
      throw error
    }
  },

  // Create a new study group
  async createGroup(groupData) {
    try {
      const response = await axios.post(API_URL, groupData)
      return response.data
    } catch (error) {
      console.error('Error creating study group:', error)
      throw error
    }
  },

  // Join a study group
  async joinGroup(groupId, userId) {
    try {
      const response = await axios.post(`${API_URL}/${groupId}/join`, { userId })
      return response.data
    } catch (error) {
      console.error('Error joining study group:', error)
      throw error
    }
  },

  // Leave a study group
  async leaveGroup(groupId, userId) {
    try {
      const response = await axios.post(`${API_URL}/${groupId}/leave`, { userId })
      return response.data
    } catch (error) {
      console.error('Error leaving study group:', error)
      throw error
    }
  },

  // Get group materials
  async getGroupMaterials(groupId) {
    try {
      const response = await axios.get(`${API_URL}/${groupId}/materials`)
      return response.data
    } catch (error) {
      console.error('Error fetching group materials:', error)
      throw error
    }
  },

  // Enroll in material
  async enrollInMaterial(groupId, materialId, userId) {
    try {
      const response = await axios.post(`${API_URL}/${groupId}/materials/${materialId}/enroll`, { userId })
      return response.data
    } catch (error) {
      console.error('Error enrolling in material:', error)
      throw error
    }
  },

  // Get group discussions
  async getGroupDiscussions(groupId) {
    try {
      const response = await axios.get(`${API_URL}/${groupId}/discussions`)
      return response.data
    } catch (error) {
      console.error('Error fetching group discussions:', error)
      throw error
    }
  },

  // Create discussion
  async createDiscussion(groupId, discussionData) {
    try {
      const response = await axios.post(`${API_URL}/${groupId}/discussions`, discussionData)
      return response.data
    } catch (error) {
      console.error('Error creating discussion:', error)
      throw error
    }
  },

  // Get group schedule
  async getGroupSchedule(groupId) {
    try {
      const response = await axios.get(`${API_URL}/${groupId}/schedule`)
      return response.data
    } catch (error) {
      console.error('Error fetching group schedule:', error)
      throw error
    }
  },

  // Update group schedule
  async updateGroupSchedule(groupId, scheduleData) {
    try {
      const response = await axios.put(`${API_URL}/${groupId}/schedule`, scheduleData)
      return response.data
    } catch (error) {
      console.error('Error updating group schedule:', error)
      throw error
    }
  }
} 