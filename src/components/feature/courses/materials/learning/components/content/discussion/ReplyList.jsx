import React, { useState, useEffect } from 'react';
import { FiHeart, FiCheck } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReplyList = ({ 
  discussionId, 
  onResolve, 
  isResolvingComment,
  pointAmount,
  setPointAmount,
  canResolve
}) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState('');

  // Fetch replies
  const fetchReplies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch replies');
      }

      setReplies(data.data.replies);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching replies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [discussionId]);

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
        body: JSON.stringify({ content: newReply.trim() }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add reply');
      }

      // Add default _count if it doesn't exist
      const replyWithCount = {
        ...data.data,
        _count: data.data._count || { likes: 0, children: 0 }
      };

      setReplies([...replies, replyWithCount]);
      setNewReply('');
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
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to toggle like');
      }

      setReplies(replies.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            _count: {
              ...reply._count,
              likes: reply.isLiked ? reply._count.likes - 1 : reply._count.likes + 1
            },
            isLiked: !reply.isLiked
          };
        }
        return reply;
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="ml-14 space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-white/[0.02] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-14 space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Reply Form */}
      <form onSubmit={handleSubmitReply} className="space-y-3">
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Tulis balasan..."
          className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/10 resize-none"
          rows="3"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg text-sm"
          >
            Kirim Balasan
          </button>
        </div>
      </form>

      {/* Replies List */}
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-4">
          <img 
            src={reply.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}`}
            alt={reply.user.name}
            className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0 object-cover"
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
              <span className="text-white/40 text-sm">
                {new Date(reply.createdAt).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-4 mb-3">
              <p className="text-white/80 leading-relaxed">{reply.content}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleLike(reply.id)}
                className={`flex items-center gap-1.5 ${reply.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <FiHeart className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{(reply._count?.likes || 0)}</span>
              </button>

              {/* Resolve Button */}
              {canResolve && !reply.isResolved && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={pointAmount}
                    onChange={(e) => setPointAmount(Math.min(50, Math.max(10, parseInt(e.target.value) || 10)))}
                    className="w-16 px-2 py-1 bg-white/[0.02] border border-white/[0.05] rounded text-white text-sm"
                  />
                  <button
                    onClick={() => onResolve(reply.id)}
                    disabled={isResolvingComment}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>Tandai Sebagai Jawaban</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyList; 