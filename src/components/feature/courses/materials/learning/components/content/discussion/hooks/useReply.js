import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useReply = (discussionId, initialReplies = []) => {
  const [replies, setReplies] = useState(initialReplies);
  const [error, setError] = useState(null);

  // Debug log untuk initial state
  useEffect(() => {
    console.log('=== useReply Initial State ===');
    console.log('discussionId:', discussionId);
    console.log('initialReplies:', initialReplies);
    console.log('Initial replies state:', replies);
  }, []);

  // Fetch replies whenever discussionId changes
  const fetchReplies = async () => {
    console.log('=== fetchReplies START ===');
    console.log('Fetching replies for discussion:', discussionId);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      console.log('Replies from server:', data.data.replies);
      
      setReplies(data.data.replies || []);
      console.log('Updated replies state:', data.data.replies);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching replies:', err);
    }
    console.log('=== fetchReplies END ===');
  };

  // Initial fetch and setup
  useEffect(() => {
    console.log('=== discussionId useEffect triggered ===');
    console.log('Current discussionId:', discussionId);
    
    if (discussionId) {
      fetchReplies();
    }
  }, [discussionId]);

  const handleLike = async (replyId) => {
    console.log('=== handleLike START ===');
    console.log('Liking reply:', replyId);
    console.log('Current replies state:', replies);
    
    try {
      // Find current reply state
      const currentReply = replies.find(r => r.id === replyId);
      console.log('Current reply state:', currentReply);

      // Optimistic update
      setReplies(prevReplies => 
        prevReplies.map(reply => {
          if (reply.id === replyId) {
            const updatedReply = {
              ...reply,
              isLiked: !reply.isLiked,
              _count: {
                ...reply._count,
                likes: reply.isLiked ? reply._count.likes - 1 : reply._count.likes + 1
              }
            };
            console.log('Optimistically updated reply:', updatedReply);
            return updatedReply;
          }
          return reply;
        })
      );

      // Make API call
      console.log('Making API call to toggle like');
      const response = await fetch(`${API_URL}/api/discussions/reply/${replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const likeResponse = await response.json();
      console.log('Like API response:', likeResponse);

      // Fetch updated data to ensure sync with server
      console.log('Fetching fresh data from server');
      await fetchReplies();
    } catch (err) {
      setError(err.message);
      console.error('Error toggling like:', err);
      // Revert optimistic update on error by re-fetching
      console.log('Error occurred, reverting changes');
      await fetchReplies();
    }
    console.log('=== handleLike END ===');
  };

  // Debug log untuk replies changes
  useEffect(() => {
    console.log('=== Replies State Updated ===');
    console.log('New replies state:', replies);
  }, [replies]);

  return {
    replies,
    handleLike,
    error
  };
};

export default useReply; 