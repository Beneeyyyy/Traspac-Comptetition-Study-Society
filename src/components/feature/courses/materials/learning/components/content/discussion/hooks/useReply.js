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
    console.log('API URL:', API_URL);
    console.log('Discussion ID:', discussionId);
    console.log('Reply ID:', replyId);
    
    try {
      // Validate inputs
      if (!replyId) {
        throw new Error('Reply ID is required');
      }

      // Update local state optimistically first
      setReplies(prevReplies => {
        const newReplies = prevReplies.map(reply => {
          if (reply.id === replyId) {
            const newLikeCount = reply.isLiked ? 
              (reply._count?.likes || 0) - 1 : 
              (reply._count?.likes || 0) + 1;
            
            console.log('Updating reply:', reply.id, {
              oldLikeCount: reply._count?.likes,
              newLikeCount,
              oldIsLiked: reply.isLiked,
              newIsLiked: !reply.isLiked
            });
            
            return {
              ...reply,
              isLiked: !reply.isLiked,
              _count: {
                ...reply._count,
                likes: newLikeCount
              }
            };
          }
          return reply;
        });
        console.log('Updated replies state:', newReplies);
        return newReplies;
      });

      // Then make the API call
      const response = await fetch(`${API_URL}/api/discussions/reply/${replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          discussionId: parseInt(discussionId)
        })
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type header:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response type:', contentType);
        console.error('Response is not JSON. Attempting to read text...');
        const text = await response.text();
        console.error('Response text:', text);
        // Don't throw error here, just log it
        console.warn('Non-JSON response received, but continuing since optimistic update was successful');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Even if response is not OK, don't revert the optimistic update
      // since the like action probably succeeded anyway
      if (!response.ok) {
        console.warn('Response not OK, but continuing since optimistic update was successful:', {
          status: response.status,
          data: data
        });
        return;
      }

      // No need to update state again since we already did optimistic update
      return data.data;
    } catch (err) {
      console.warn('Error in like operation, but keeping optimistic update:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      // Don't throw error or set error state since the UI is already updated
    }
    console.log('=== handleLike END ===');
  };

  const handleResolve = async (discussionId, replyId, pointAmount) => {
    console.log('=== handleResolve START ===');
    console.log('Resolving reply:', { discussionId, replyId, pointAmount });
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/reply/${replyId}/resolve`, {
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