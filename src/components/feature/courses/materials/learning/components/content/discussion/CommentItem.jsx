import React, { useState, useEffect } from 'react';
import { FiHeart, FiMessageSquare, FiShare2, FiCheck } from 'react-icons/fi';
import ReplyList from './ReplyList';
import CommentForm from './CommentForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommentItem = ({ comment, onLike, onResolve, currentUser }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isResolvingComment, setIsResolvingComment] = useState(false);
  const [pointAmount, setPointAmount] = useState(10);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);

  // Debug logs
  console.log('CommentItem props:', {
    commentId: comment.id,
    userId: comment.userId,
    currentUserId: currentUser?.id,
    isResolved: comment.isResolved,
    canResolve: currentUser?.id === comment.userId && !comment.isResolved,
    showReplies,
    initialReplies: comment.replies,
    isLiked: comment.isLiked
  });

  // Initialize replies with comment.replies when the comment changes
  useEffect(() => {
    if (comment.replies) {
      setReplies(comment.replies);
    }
  }, [comment.replies]);

  // Fetch replies when showReplies is toggled to true
  useEffect(() => {
    if (showReplies) {
      handleFetchReplies();
    }
  }, [showReplies]);

  const handleFetchReplies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/discussions/${comment.id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch discussion details');
      }

      if (data.data.replies) {
        console.log('Fetched replies:', data.data.replies);
        setReplies(data.data.replies);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching replies:', err);
    }
  };

  const handleResolveComment = async (replyId) => {
    try {
      console.log('Resolving comment:', {
        commentId: comment.id,
        replyId,
        currentUser,
        discussionUserId: comment.userId,
        isCreator: currentUser?.id === comment.userId,
        isResolved: comment.isResolved
      });

      if (currentUser?.id !== comment.userId) {
        throw new Error('Only the discussion creator can resolve the discussion');
      }

      // Call the parent's onResolve callback if provided
      if (typeof onResolve === 'function') {
        await onResolve(comment.id, replyId);
      }
    } catch (err) {
      console.error('Error resolving reply:', err);
      setError(err.message);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/discussions/${comment.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: newReply.trim() }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add reply');
      }

      // Fetch updated discussion to get fresh replies
      const discussionResponse = await fetch(`${API_URL}/api/discussions/${comment.id}`, {
        credentials: 'include'
      });
      const discussionData = await discussionResponse.json();

      if (!discussionResponse.ok) {
        throw new Error(discussionData.error || 'Failed to fetch updated discussion');
      }

      setReplies(discussionData.data.replies || []);
      setNewReply('');
      setShowReplyForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error adding reply:', err);
    }
  };

  // Fetch replies when showReplies is toggled to true
  const handleToggleReplies = async () => {
    if (!showReplies) {
      try {
        const response = await fetch(`${API_URL}/api/discussions/${comment.id}`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch discussion details');
        }

        setReplies(data.data.replies || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching replies:', err);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleLike = async () => {
    try {
      // Call parent's onLike
      if (typeof onLike === 'function') {
        await onLike(comment.id);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <img 
          src={comment.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}`}
          alt={comment.user.name}
          className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">{comment.user.name}</span>
            {comment.user.role === 'teacher' && (
              <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/80 text-xs border border-white/[0.05]">
                Guru
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs">
              {comment.user.rank}
            </span>
            <span className="text-white/40 text-sm">{new Date(comment.createdAt).toLocaleString('id-ID')}</span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-4 mb-3">
            <p className="text-white/80 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 ${comment.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiHeart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{comment._count.likes}</span>
            </button>
            <button 
              onClick={handleToggleReplies}
              className={`flex items-center gap-1.5 ${showReplies ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiMessageSquare className="w-4 h-4" />
              <span className="text-sm">{comment._count.replies} {showReplies ? 'Sembunyikan Balasan' : 'Lihat Balasan'}</span>
            </button>
            {!showReplyForm && showReplies && (
              <button 
                onClick={() => setShowReplyForm(true)}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
              >
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm">Balas</span>
              </button>
            )}
            <button className="flex items-center gap-1.5 text-white/40 hover:text-white/60">
              <FiShare2 className="w-4 h-4" />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>

          {/* Resolved Status */}
          {comment.isResolved && comment.resolvedReply && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">Terjawab oleh {comment.resolvedReply.user.name}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Reply Form and Replies */}
      {showReplies && (
        <div className="ml-14 space-y-4">
          {/* Reply Form */}
          {showReplyForm && (
            <CommentForm
              onSubmit={handleSubmitReply}
              newComment={newReply}
              setNewComment={setNewReply}
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {/* Replies List */}
          <ReplyList 
            discussionId={comment.id}
            onResolve={handleResolveComment}
            isResolvingComment={isResolvingComment}
            pointAmount={pointAmount}
            setPointAmount={setPointAmount}
            canResolve={currentUser?.id === comment.userId && !comment.isResolved}
            replies={replies.map(reply => ({
              ...reply,
              discussionId: {
                ...comment,
                resolvedReplyId: comment.resolvedReplyId
              }
            }))}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem; 