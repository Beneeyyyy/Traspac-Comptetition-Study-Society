import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const questionService = {
  fetchQuestions: async () => {
    const response = await api.get('/api/forum/posts');
    return response.data?.data?.posts || [];
  },

  refreshQuestion: async (questionId) => {
    const response = await api.get(`/api/forum/posts/${questionId}`);
    if (!response.data?.success) {
      throw new Error('Failed to refresh question');
    }
    return response.data.data;
  },

  addQuestion: async (title, content, tags = [], images = []) => {
    const response = await api.post('/api/forum/posts', { 
      title, content, tags, images 
    });
    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Failed to add question');
    }
    return response.data.data;
  }
};

export const voteService = {
  handleVote: async (type, id, isUpvote) => {
    const response = await api.post(`/api/forum/${type}/${id}/vote`, {
      isUpvote
    });
    if (!response.data?.success) {
      throw new Error('Vote failed');
    }
    return response.data.data;
  }
};

export const answerService = {
  addAnswer: async (questionId, content, images = []) => {
    const response = await api.post(`/api/forum/posts/${questionId}/answers`, {
      content,
      images
    });
    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Failed to add answer');
    }
    return response.data.data;
  }
};

export const commentService = {
  addComment: async (questionId, answerId, data) => {
    const endpoint = answerId 
      ? `/api/forum/posts/${questionId}/answers/${answerId}/comments`
      : `/api/forum/posts/${questionId}/comments`;

    const response = await api.post(endpoint, data);
    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Failed to add comment');
    }
    return response.data.data;
  }
}; 