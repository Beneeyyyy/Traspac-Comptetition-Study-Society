import React, { useState } from 'react';
import { FiHeart, FiMessageSquare, FiShare2, FiCheck } from 'react-icons/fi';
import ReplyList from './ReplyList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommentItem = ({ comment, onLike }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isResolvingComment, setIsResolvingComment] = useState(false);
  const [pointAmount, setPointAmount] = useState(10);
  const [error, setError] = useState(null);

  const handleResolveComment = async (replyId) => {
    try {
      setIsResolvingComment(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/discussions/${comment.id}/resolve/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pointAmount }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resolve discussion');
      }

      // Refresh the discussion (this should be handled by the parent component)
      window.location.reload();
    } catch (err) {
      setError(err.message);
      console.error('Error resolving discussion:', err);
    } finally {
      setIsResolvingComment(false);
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
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1.5 ${comment.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiHeart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{comment._count.likes}</span>
            </button>
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
            >
              <FiMessageSquare className="w-4 h-4" />
              <span className="text-sm">{comment._count.replies} Balasan</span>
            </button>
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

      {/* Replies */}
      {showReplies && comment._count.replies > 0 && (
        <ReplyList 
          discussionId={comment.id}
          onResolve={handleResolveComment}
          isResolvingComment={isResolvingComment}
          pointAmount={pointAmount}
          setPointAmount={setPointAmount}
          canResolve={!comment.isResolved && comment.userId === comment.user.id}
        />
      )}
    </div>
  );
};

export default CommentItem; 