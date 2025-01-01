import React, { useState } from 'react';
import { FiHeart, FiCheck, FiMessageSquare } from 'react-icons/fi';
import CommentForm from './CommentForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReplyList = ({ 
  discussionId, 
  onResolve, 
  isResolvingComment, 
  pointAmount, 
  setPointAmount,
  canResolve,
  replies,
  currentUser
}) => {
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplyFormFor, setShowReplyFormFor] = useState(null);
  const [showChildrenFor, setShowChildrenFor] = useState(new Set());
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug logs
  console.log('ReplyList props:', {
    discussionId,
    canResolve,
    currentUser,
    replies
  });

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newReply.trim(),
          parentId: replyingTo 
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add reply');
      }

      // Update parent component's replies
      if (typeof onResolve === 'function') {
        onResolve(data.data.id);
      }

      setNewReply('');
      setReplyingTo(null);
      setShowReplyFormFor(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding reply:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (replyId) => {
    try {
      const response = await fetch(`${API_URL}/api/discussions/reply/${replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      // Refresh the discussion to get updated likes
      const discussionResponse = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
        credentials: 'include'
      });
      const discussionData = await discussionResponse.json();

      if (!discussionResponse.ok) {
        throw new Error(discussionData.error || 'Failed to fetch updated discussion');
      }

      // Update the parent component's replies state
      if (typeof onResolve === 'function') {
        onResolve(discussionData.data.replies || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error toggling like:', err);
    }
  };

  const handleResolve = async (replyId) => {
    try {
      if (typeof onResolve === 'function') {
        await onResolve(parseInt(replyId, 10));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error resolving reply:', err);
    }
  };

  const toggleShowChildren = (replyId) => {
    const newSet = new Set(showChildrenFor);
    if (newSet.has(replyId)) {
      newSet.delete(replyId);
    } else {
      newSet.add(replyId);
    }
    setShowChildrenFor(newSet);
  };

  const renderReply = (reply, depth = 0) => {
    // Debug log for each reply
    console.log('Rendering reply:', {
      replyId: reply.id,
      canResolve,
      currentUser,
      isResolved: reply.isResolved,
      replyUserId: reply.userId,
      replyUser: reply.user
    });

    if (!reply.user) {
      console.error('Reply user information missing:', reply);
      return null;
    }

    return (
      <div 
        key={reply.id} 
        className={`flex gap-4 ${depth > 0 ? 'mt-4' : ''} ${
          reply.isResolved ? 'bg-green-500/10 p-4 rounded-lg border border-green-500/20' : ''
        }`}
        style={{ 
          marginLeft: depth > 0 ? `${depth * 2}rem` : '0',
          borderLeft: depth > 0 ? '2px solid rgba(255, 255, 255, 0.05)' : 'none',
          paddingLeft: depth > 0 ? '1rem' : '0'
        }}
      >
        <img 
          src={reply.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}&background=0D8ABC&color=fff`}
          alt={reply.user.name}
          className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">{reply.user.name}</span>
            {reply.user.role === 'teacher' && (
              <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/80 text-xs border border-white/[0.05]">
                Guru
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs">
              {reply.user.rank}
            </span>
            <span className="text-white/40 text-sm">{new Date(reply.createdAt).toLocaleString('id-ID')}</span>
          </div>
          <div className={`rounded-lg p-4 mb-3 ${reply.isResolved ? 'bg-green-500/10' : 'bg-white/[0.02]'}`}>
            <p className="text-white/80 leading-relaxed">{reply.content}</p>
            {reply.isResolved && (
              <div className="mt-3 flex items-center gap-2 text-green-400">
                <FiCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Jawaban Terpilih</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleLike(reply.id)}
              className={`flex items-center gap-1.5 ${reply.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiHeart className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{reply._count?.likes || 0}</span>
            </button>

            {/* View/Hide Replies Button */}
            {reply._count?.children > 0 && (
              <button 
                onClick={() => toggleShowChildren(reply.id)}
                className={`flex items-center gap-1.5 ${showChildrenFor.has(reply.id) ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm">{reply._count?.children} {showChildrenFor.has(reply.id) ? 'Sembunyikan Balasan' : 'Lihat Balasan'}</span>
              </button>
            )}

            {/* Reply Button */}
            {!showReplyFormFor && !reply.isResolved && (
              <button 
                onClick={() => {
                  setReplyingTo(reply.id);
                  setShowReplyFormFor(reply.id);
                }}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
              >
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm">Balas</span>
              </button>
            )}

            {/* Resolve Button */}
            {canResolve && !reply.isResolved && reply.userId !== currentUser?.id && (
              <button
                onClick={() => handleResolve(reply.id)}
                disabled={isResolvingComment}
                className="flex items-center gap-1.5 text-green-400 hover:text-green-300 disabled:opacity-50"
              >
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">Tandai Sebagai Jawaban</span>
              </button>
            )}
          </div>

          {/* Nested Reply Form */}
          {showReplyFormFor === reply.id && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleSubmitReply}
                newComment={newReply}
                setNewComment={setNewReply}
                placeholder={`Balas ke ${reply.user.name}...`}
                submitLabel="Kirim Balasan"
                isLoading={isLoading}
                onCancel={() => {
                  setReplyingTo(null);
                  setShowReplyFormFor(null);
                  setNewReply('');
                }}
              />
            </div>
          )}

          {/* Show nested replies if toggled */}
          <div className={showChildrenFor.has(reply.id) ? 'mt-4 space-y-4' : ''}>
            {showChildrenFor.has(reply.id) && reply.children?.map(childReply => renderReply(childReply, depth + 1))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {replies.map(reply => renderReply(reply))}
    </div>
  );
};

export default ReplyList; 