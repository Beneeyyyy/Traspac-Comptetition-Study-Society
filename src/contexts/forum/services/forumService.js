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

  async addQuestion(title, blocks, tags) {
    try {
      console.log('Sending question data:', {
        title,
        blocksCount: blocks?.length,
        tags
      });
      
      // Send to backend
      const response = await api.post('/api/forum/posts', {
        title,
        blocks,
        tags: tags || ['general']
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to create question');
      }

      console.log('Question created successfully:', response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error('Error creating question:', {
        message: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  },

  async addAnswer(postId, blocks) {
    try {
      console.log('Adding answer:', {
        postId,
        blocksCount: blocks?.length
      });

      const response = await api.post(`/api/forum/posts/${postId}/answers`, {
        blocks
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to create answer');
      }

      console.log('Answer created successfully:', response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
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