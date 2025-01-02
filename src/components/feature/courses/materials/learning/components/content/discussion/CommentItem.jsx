import React, { useState, useEffect } from 'react';
import { FiHeart, FiMessageSquare, FiSend } from 'react-icons/fi';
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
  onLike,
  comment
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState(initialReplies || []);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);
  const [replyCount, setReplyCount] = useState(comment._count?.replies || 0);

  // Find the resolved reply
  const resolvedReply = replies.find(reply => reply.isResolved);

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
      initialLikeCount,
      replyCount: comment._count?.replies
    });
    console.log('State:', {
      showReplies,
      repliesCount: replies.length,
      isLiked,
      likeCount,
      replyCount
    });
  }, [commentId, isLiked, replies, showReplies, likeCount, replyCount]);

  // Update isLiked when prop changes
  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // Update likeCount when prop changes
  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  // Update replies when initialReplies changes
  useEffect(() => {
    if (initialReplies) {
      setReplies(initialReplies);
    }
  }, [initialReplies]);

  // Update reply count when comment changes
  useEffect(() => {
    if (comment._count?.replies !== undefined) {
      setReplyCount(comment._count.replies);
    }
  }, [comment._count?.replies]);

  // Fetch replies when showReplies is toggled to true
  const handleToggleReplies = async () => {
    console.log('=== handleToggleReplies START ===');
    console.log('Discussion ID:', commentId);
    console.log('API URL:', `${API_URL}/api/discussions/${commentId}`);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${commentId}`, {
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
        throw new Error(data.error || 'Failed to fetch discussion details');
      }

      if (data.success && data.data) {
        console.log('Setting replies:', data.data.replies);
        setReplies(data.data.replies || []);
        setShowReplies(true);
      } else {
        console.log('No replies data in response');
        setReplies([]);
        setShowReplies(true);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
      setError(err.message || 'Failed to fetch replies');
      // Still show replies section but empty
      setReplies([]);
      setShowReplies(true);
    }
    console.log('=== handleToggleReplies END ===');
  };

  const handleShowReplyForm = () => {
    console.log('=== handleShowReplyForm START ===');
    setShowReplyForm(true);
    if (!showReplies) {
      handleToggleReplies();
    }
    console.log('=== handleShowReplyForm END ===');
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
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
    <div className={`bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden ${
      isResolved ? 'border-green-500/20' : ''
    }`}>
      {/* Discussion Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="relative">
            <img 
              src={comment.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}`}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full bg-white/[0.02] border-2 border-white/[0.05] flex-shrink-0 object-cover"
            />
            {comment.user.role === 'teacher' && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-4 h-4 border-2 border-black/90 flex items-center justify-center">
                <span className="text-[8px] text-white">✓</span>
              </div>
            )}
          </div>

          {/* User Info & Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-semibold text-white truncate">
                {comment.user.name}
              </h4>
              <div className="flex items-center gap-2">
                {comment.user.role === 'teacher' && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs border border-blue-500/20">
                    Guru
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs border border-white/[0.05]">
                  {comment.user.rank}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-white/40 mb-3">
              {new Date(comment.createdAt).toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Content */}
            <div className="text-white/80 leading-relaxed mb-4">
              {comment.content}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked 
                    ? 'text-white' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">
                  {likeCount > 0 ? likeCount : 'Like'}
                </span>
              </button>
              
              <button 
                onClick={handleToggleReplies}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <FiMessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {replyCount} {replyCount === 1 ? 'Answer' : 'Answers'}
                </span>
              </button>

              <button 
                onClick={handleShowReplyForm}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <FiSend className="w-5 h-5" />
                <span className="text-sm font-medium">Answer</span>
              </button>

              {isResolved && (
                <div className="flex items-center gap-2 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium">
                    Solved by {resolvedReply?.user?.name || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {(showReplies || showReplyForm) && (
        <div className="border-t border-white/[0.05] bg-white/[0.01]">
          <ReplyList
            discussionId={commentId}
            replies={replies}
            currentUser={{ id: currentUserId }}
            isCreator={userId === currentUserId}
            onResolve={onResolve}
            showForm={showReplyForm}
            onCancelReply={handleCancelReply}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CommentItem; 