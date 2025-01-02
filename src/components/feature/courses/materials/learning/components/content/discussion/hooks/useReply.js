import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useReply = (discussionId, initialReplies = []) => {
  const [replies, setReplies] = useState(initialReplies);
  const [error, setError] = useState(null);

  console.log('=== useReply hook initialized ===');
  console.log('Discussion ID:', discussionId);
  console.log('Initial replies:', initialReplies);

  const handleSubmitReply = async (content) => {
    console.log('=== handleSubmitReply START ===');
    console.log('Submitting reply:', { discussionId, content });
    console.log('API URL:', `${API_URL}/api/discussions/${discussionId}/reply`);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: content.trim() })
      });

      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response type:', contentType);
        throw new Error('Invalid response type from server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit reply');
      }

      if (data.success && data.data) {
        console.log('Reply submitted successfully:', data.data);
        return data.data;
      }
      
      throw new Error('Invalid response format');
    } catch (err) {
      console.error('Error in handleSubmitReply:', err);
      setError(err.message || 'Failed to submit reply');
      return null;
    }
  };

  const handleLike = async (replyId) => {
    console.log('=== handleLike START ===');
    console.log('Liking reply:', { discussionId, replyId });
    console.log('API URL:', `${API_URL}/api/discussions/reply/${replyId}/like`);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/reply/${replyId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response type:', contentType);
        throw new Error('Invalid response type from server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      if (data.success) {
        console.log('Like toggled successfully');
        setReplies(prevReplies =>
          prevReplies.map(reply =>
            reply.id === replyId
              ? {
                  ...reply,
                  isLiked: data.data.isLiked,
                  _count: {
                    ...reply._count,
                    likes: data.data.likesCount
                  }
                }
              : reply
          )
        );
      }
    } catch (err) {
      console.error('Error in handleLike:', err);
      setError(err.message || 'Failed to toggle like');
    }
  };

  return {
    replies,
    setReplies,
    handleSubmitReply,
    handleLike,
    error
  };
};

export default useReply; 