import React, { useState } from 'react';
import { FiHeart, FiCheck, FiMessageSquare } from 'react-icons/fi';
import CommentForm from './CommentForm';
import { useReply } from './hooks/useReply';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReplyList = ({ discussionId, replies: initialReplies, onResolve, currentUser, isCreator, discussion }) => {
  const [showReplyFormFor, setShowReplyFormFor] = useState(null);
  const [newReply, setNewReply] = useState('');
  
  const { replies, handleLike, error } = useReply(discussionId, initialReplies);

  // Cek apakah diskusi sudah memiliki jawaban yang ditandai
  const hasResolvedAnswer = discussion?.isResolved || replies?.some(reply => reply.isResolved);

  // Fungsi untuk mengecek apakah reply ini adalah jawaban yang ditandai
  const isResolvedAnswer = (reply) => {
    return reply.isResolved || discussion?.resolvedReplyId === reply.id;
  };

  const handleSubmitReply = async (e, parentReplyId) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newReply.trim(),
          parentId: parentReplyId 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      setNewReply('');
      setShowReplyFormFor(null);
      // Optionally refresh the discussion to show new reply
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  // Debug log untuk melihat status
  console.log('ReplyList status:', {
    discussionId,
    discussionResolved: discussion?.isResolved,
    hasResolvedAnswer,
    repliesCount: replies?.length,
    resolvedReplies: replies?.filter(r => r.isResolved)
  });

  if (error) {
    console.error('Reply error:', error);
  }

  return (
    <div className="mt-4 space-y-4 pl-4 border-l border-white/10">
      {replies?.map((reply) => {
        const isAnswered = isResolvedAnswer(reply);
        
        return (
          <div key={reply.id} 
            className={`relative rounded-lg p-4 ${
              isAnswered 
                ? 'bg-green-500/5 border border-green-500/20' 
                : 'bg-white/[0.01]'
            }`}
          >
            {/* Resolve button - hanya tampil jika belum ada jawaban yang ditandai */}
            {isCreator && 
             reply.userId !== currentUser?.id && 
             !hasResolvedAnswer && (
              <button
                onClick={() => onResolve(reply.id)}
                className="absolute top-2 right-2 flex items-center gap-2 text-green-400 hover:text-green-300 text-sm bg-green-500/5 hover:bg-green-500/10 px-2 py-1 rounded-lg transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                <span>Tandai Sebagai Jawaban</span>
              </button>
            )}

            {/* Status jawaban terpilih - terlihat oleh semua user */}
            {isAnswered && (
              <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <FiCheck className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Jawaban Terpilih</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <span className="text-white/60 text-sm font-medium">
                    {reply.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">
                    {reply.user?.name || 'Anonymous'}
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-white/40 text-xs">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/80 text-sm mb-2">{reply.content}</p>

                {/* Like and Reply buttons */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(reply.id)}
                    className={`flex items-center gap-1.5 ${reply.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                  >
                    <FiHeart className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{reply._count?.likes || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowReplyFormFor(reply.id)}
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    <span className="text-sm">Balas</span>
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyFormFor === reply.id && (
                  <div className="mt-4">
                    <CommentForm
                      onSubmit={(e) => handleSubmitReply(e, reply.id)}
                      newComment={newReply}
                      setNewComment={setNewReply}
                      onCancel={() => setShowReplyFormFor(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList; 