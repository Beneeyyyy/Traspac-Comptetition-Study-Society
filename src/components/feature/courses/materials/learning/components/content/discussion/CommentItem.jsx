import React, { useState, useEffect } from 'react';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import ReplyList from './ReplyList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommentItem = ({ 
  commentId, 
  userId, 
  currentUserId, 
  isResolved, 
  canResolve, 
  initialReplies,
  isLiked: initialIsLiked = false,
  likeCount: initialLikeCount = 0,
  onResolve,
  onLike 
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(initialReplies || []);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);

  // Debug logs
  useEffect(() => {
    console.log('=== CommentItem Mount/Update ===');
    console.log('Props:', {
      commentId,
      userId,
      currentUserId,
      isResolved,
      canResolve,
      initialReplies,
      initialIsLiked,
      initialLikeCount
    });
    console.log('State:', {
      showReplies,
      repliesCount: replies.length,
      isLiked,
      likeCount
    });
  }, [commentId, isLiked, replies, showReplies, likeCount]);

  // Update isLiked when prop changes
  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // Update likeCount when prop changes
  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  // Fetch replies when showReplies is toggled to true
  const handleToggleReplies = async () => {
    console.log('=== handleToggleReplies START ===');
    console.log('Current showReplies:', showReplies);
    
    if (!showReplies) {
      try {
        console.log('Fetching replies for comment:', commentId);
        const response = await fetch(`${API_URL}/api/discussions/${commentId}`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch discussion details');
        }

        console.log('Fetched replies:', data.data.replies);
        setReplies(data.data.replies || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching replies:', err);
      }
    }
    setShowReplies(!showReplies);
    console.log('=== handleToggleReplies END ===');
  };

  const handleLike = async () => {
    console.log('=== handleLike START ===');
    console.log('Current like state:', isLiked);
    
    try {
      // Call parent's onLike function
      const updatedDiscussion = await onLike(commentId);
      if (updatedDiscussion) {
        setLikeCount(updatedDiscussion.likeCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(err.message);
    }
    console.log('=== handleLike END ===');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 ${isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likeCount}</span>
        </button>
        
        <button 
          onClick={handleToggleReplies}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
        >
          <FiMessageSquare className="w-4 h-4" />
          <span className="text-sm">
            {showReplies ? 'Hide Replies' : `Show Replies (${replies.length})`}
          </span>
        </button>
      </div>

      {showReplies && (
        <ReplyList
          discussionId={commentId}
          replies={replies}
          currentUser={{ id: currentUserId }}
          isCreator={userId === currentUserId}
          onResolve={onResolve}
        />
      )}
    </div>
  );
};

export default CommentItem; 