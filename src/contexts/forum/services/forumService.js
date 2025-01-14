import api from '@/utils/api';

export const forumService = {
  async fetchQuestions() {
    try {
      const response = await api.get('/api/forum/posts');
      const posts = response.data?.data?.posts || [];
      
      // Log vote status untuk setiap post
      posts.forEach(post => {
        console.log(`Post ${post.id} vote status:`, {
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          userVote: post.userVote,
          score: (post.upvotes || 0) - (post.downvotes || 0)
        });
      });
      
      return posts;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  },

  async refreshQuestion(id) {
    try {
      const response = await api.get(`/api/forum/posts/${id}`);
      const question = response.data?.data;
      
      // Log vote status setelah refresh
      if (question) {
        console.log(`Refreshed post ${id} vote status:`, {
          upvotes: question.upvotes || 0,
          downvotes: question.downvotes || 0,
          userVote: question.userVote,
          score: (question.upvotes || 0) - (question.downvotes || 0)
        });
      }
      
      return question;
    } catch (error) {
      console.error('Error refreshing question:', error);
      throw error;
    }
  },

  async addQuestion(data) {
    const response = await api.post('/api/forum/posts', data);
    return response.data?.data;
  },

  async addAnswer(questionId, data) {
    const response = await api.post(`/api/forum/posts/${questionId}/answers`, data);
    return response.data?.data;
  },

  async addComment(questionId, answerId, content, parentId = null) {
    try {
      const endpoint = answerId 
        ? `/api/forum/posts/${questionId}/answers/${answerId}/comments`
        : `/api/forum/posts/${questionId}/comments`;

      const response = await api.post(endpoint, { 
        content,
        parentId: parentId ? parseInt(parentId) : null
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to add comment');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async handleVote(type, id, isUpvote) {
    try {
      console.log('Handling vote:', { type, id, isUpvote });
      const response = await api.post(`/api/forum/${type}/${id}/vote`, { isUpvote });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Vote failed');
      }
      
      const updatedItem = response.data?.data?.updatedItem;
      
      // Log vote status setelah voting
      if (updatedItem) {
        console.log(`Updated ${type} ${id} vote status:`, {
          upvotes: updatedItem.upvotes || 0,
          downvotes: updatedItem.downvotes || 0,
          userVote: updatedItem.userVote,
          score: (updatedItem.upvotes || 0) - (updatedItem.downvotes || 0)
        });
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Vote error:', error.response?.data || error.message);
      throw error;
    }
  }
}; 