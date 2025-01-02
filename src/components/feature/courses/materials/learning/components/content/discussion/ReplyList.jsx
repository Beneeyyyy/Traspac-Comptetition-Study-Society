import React, { useState, useEffect } from 'react';
import { FiHeart, FiCheck, FiCornerDownRight, FiX } from 'react-icons/fi';
import CommentForm from './CommentForm';
import { useReply } from './hooks/useReply';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReplyList = ({ 
  discussionId, 
  replies: initialReplies, 
  currentUser, 
  isCreator, 
  onResolve, 
  showForm = false, 
  onCancelReply,
  comment
}) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    replies,
    setReplies,
    handleSubmitReply,
    handleLike,
    error
  } = useReply(discussionId, initialReplies);

  // Update replies when initialReplies changes
  useEffect(() => {
    console.log('=== ReplyList useEffect START ===');
    console.log('Initial replies:', initialReplies);
    console.log('Discussion ID:', discussionId);
    console.log('Resolved Reply ID:', comment?.resolvedReplyId);
    
    if (initialReplies && Array.isArray(initialReplies)) {
      console.log('Setting replies from initialReplies');
      // Mark the resolved reply
      const updatedReplies = initialReplies.map(reply => ({
        ...reply,
        isResolved: reply.id === comment?.resolvedReplyId
      }));
      setReplies(updatedReplies);
    } else {
      console.log('No valid initialReplies, setting empty array');
      setReplies([]);
    }
    console.log('=== ReplyList useEffect END ===');
  }, [initialReplies, setReplies, comment?.resolvedReplyId]);

  // Check if any reply is marked as resolved
  const resolvedReply = replies.find(reply => reply.isResolved || reply.id === comment?.resolvedReplyId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== handleSubmit START ===');
    console.log('Reply text:', replyText);
    
    if (!replyText.trim() || isSubmitting) {
      console.log('Invalid reply text or already submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting reply to discussion:', discussionId);
      const newReply = await handleSubmitReply(replyText);
      console.log('New reply:', newReply);
      
      if (newReply) {
        console.log('Adding new reply to list');
        setReplies(prevReplies => {
          console.log('Previous replies:', prevReplies);
          const updatedReplies = [newReply, ...prevReplies];
          console.log('Updated replies:', updatedReplies);
          return updatedReplies;
        });
        setReplyText('');
        onCancelReply();
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
    console.log('=== handleSubmit END ===');
  };

  const handleResolve = async (discussionId, replyId) => {
    console.log('=== handleResolve START ===');
    console.log('Resolving reply:', { discussionId, replyId });
    console.log('API URL:', `${API_URL}/api/discussions/${discussionId}/resolve/${replyId}`);
    
    try {
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/resolve/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ pointAmount: 10 })
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
            resolvedAt: reply.id === replyId ? new Date().toISOString() : null
          }))
        );
        
        // Call the parent's onResolve callback with the updated data
        if (onResolve) {
          onResolve(discussionId, replyId);
        }
      }
    } catch (err) {
      console.error('Error marking as solution:', err);
      setError(err.message || 'Failed to mark as solution');
    }
    console.log('=== handleResolve END ===');
  };

  return (
    <div className="divide-y divide-white/[0.05]">
      {/* Total Replies Count */}
      <div className="p-4 flex items-center justify-between bg-white/[0.01]">
        <span className="text-sm text-white/60">
          {replies.length} {replies.length === 1 ? 'Answer' : 'Answers'}
        </span>
        {showForm && (
          <button
            onClick={onCancelReply}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Reply Form - Only show when showForm is true */}
      {showForm && (
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 flex justify-center">
              <FiCornerDownRight className="w-5 h-5 text-white/20" />
            </div>
            <div className="flex-1">
              <CommentForm
                onSubmit={handleSubmit}
                newComment={replyText}
                setNewComment={setReplyText}
                placeholder="Write your answer..."
                submitLabel="Submit Answer"
                isLoading={isSubmitting}
                onCancel={onCancelReply}
              />
            </div>
          </div>
        </div>
      )}

      {/* Replies List */}
      <div className="divide-y divide-white/[0.05]">
        {replies.map(reply => {
          // Check if this reply is resolved either from its own state or from parent discussion
          const isResolved = reply.isResolved || comment?.resolvedReplyId === reply.id;
          
          return (
            <div key={reply.id} className="relative">
              {/* Thread line */}
              <div className="absolute left-10 top-0 bottom-0 w-px bg-white/[0.05]"></div>
              
              <div className={`relative p-6 ${
                isResolved 
                  ? 'bg-green-500/[0.08] border-y border-green-500/20' 
                  : ''
              }`}>
                {/* Solution Button or Status - Positioned at top right */}
                {isCreator && 
                 reply.userId !== currentUser?.id && 
                 !resolvedReply && (
                  <button
                    onClick={() => handleResolve(discussionId, reply.id)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-white/40 hover:text-green-500 transition-colors bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/[0.05]"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span className="text-sm">Mark as Solution</span>
                  </button>
                )}
                {isResolved && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-green-500 bg-green-500/10 rounded-lg border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium">Solution</span>
                  </div>
                )}

                <div className="flex gap-4">
                  {/* Reply indicator and avatar */}
                  <div className="flex-shrink-0 flex items-start gap-3">
                    <FiCornerDownRight className="w-5 h-5 text-white/20 mt-1.5" />
                    <div className="relative">
                      <img
                        src={reply.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}`}
                        alt={reply.user.name}
                        className="w-8 h-8 rounded-full bg-white/[0.02] border-2 border-white/[0.05] flex-shrink-0 object-cover"
                      />
                      {reply.user.role === 'teacher' && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 border-2 border-black/90 flex items-center justify-center">
                          <span className="text-[6px] text-white">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Content */}
                  <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">
                        {reply.user.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {reply.user.role === 'teacher' && (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs border border-blue-500/20">
                            Guru
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs border border-white/[0.05]">
                          {reply.user.rank}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-white/40 mb-2">
                      {new Date(reply.createdAt).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Content */}
                    <div className="text-white/80 leading-relaxed mb-3">
                      {reply.content}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(reply.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          reply.isLiked 
                            ? 'text-white' 
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">
                          {reply._count?.likes > 0 ? reply._count.likes : 'Like'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* No Replies Message */}
        {replies.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-white/40">Belum ada jawaban untuk diskusi ini.</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ReplyList; 