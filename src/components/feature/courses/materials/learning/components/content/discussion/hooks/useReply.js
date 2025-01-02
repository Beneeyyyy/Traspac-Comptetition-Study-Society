import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useReply = (discussionId, initialReplies = []) => {
  const [replies, setReplies] = useState(initialReplies);
  const [error, setError] = useState(null);

  const handleSubmitReply = async (content, parentId = null) => {
    console.log('=== handleSubmitReply START ===');
    console.log('Content:', content);
    console.log('Parent ID:', parentId);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: content.trim(),
          parentId: parentId ? parseInt(parentId) : null
        })
      });

      console.log('Response status:', response.status);
      
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
        console.log('Reply submitted successfully');
        return data.data;
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError(err.message || 'Failed to submit reply');
      throw err;
    }
    console.log('=== handleSubmitReply END ===');
  };

  const handleLike = async (replyId) => {
    console.log('=== handleLike START ===');
    console.log('Reply ID:', replyId);
    
    try {
      const response = await fetch(`${API_URL}/api/replies/${replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response type:', contentType);
        throw new Error('Invalid response type from server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to like reply');
      }

      if (data.success) {
        console.log('Reply liked/unliked successfully');
        setReplies(prevReplies =>
          prevReplies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isLiked: data.data.isLiked,
                _count: {
                  ...reply._count,
                  likes: data.data.likesCount
                }
              };
            }
            return reply;
          })
        );
      }
    } catch (err) {
      console.error('Error liking reply:', err);
      setError(err.message || 'Failed to like reply');
    }
    console.log('=== handleLike END ===');
  };

  const handleResolve = async (discussionId, replyId, pointAmount) => {
    console.log('=== handleResolve START ===');
    console.log('Resolving reply:', { discussionId, replyId, pointAmount });
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/resolve/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ pointAmount })
      });

      console.log('Response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response type:', contentType);
        throw new Error('Invalid response type from server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark as solution');
      }

      if (data.success || data.data) {
        console.log('Reply marked as solution successfully');
        // Update all replies to reflect the change
        setReplies(prevReplies =>
          prevReplies.map(reply => ({
            ...reply,
            isResolved: reply.id === replyId,
            pointReceived: reply.id === replyId ? pointAmount : reply.pointReceived,
            resolvedAt: reply.id === replyId ? new Date().toISOString() : null
          }))
        );
        return data.data;
      }
    } catch (err) {
      console.error('Error marking as solution:', err);
      setError(err.message || 'Failed to mark as solution');
      throw err;
    }
    console.log('=== handleResolve END ===');
  };

  return {
    replies,
    setReplies,
    handleSubmitReply,
    handleLike,
    handleResolve,
    error
  };
};

export default useReply; 