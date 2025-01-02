import React, { useState } from 'react';
import { FiHeart, FiCheck, FiCornerDownRight, FiMessageSquare } from 'react-icons/fi';
import CommentForm from './CommentForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReplyItem = ({
  reply,
  level,
  discussionId,
  currentUser,
  isCreator,
  onResolve,
  resolvedReply,
  comment,
  onLike,
  onSubmitReply,
  allReplies,
  setReplies
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get child replies for this reply
  const childReplies = allReplies.filter(r => r.parentId === reply.id);
  
  // Check if this reply is resolved
  const isResolved = reply.isResolved || comment?.resolvedReplyId === reply.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newReply = await onSubmitReply(replyText, reply.id); // Pass parentId
      
      if (newReply) {
        setReplies(prevReplies => [...prevReplies, newReply]);
        setReplyText('');
        setShowReplyForm(false);
      }
    } catch (err) {
      console.error('Error submitting nested reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    try {
      await onResolve(discussionId, reply.id);
    } catch (err) {
      console.error('Error marking as solution:', err);
    }
  };

  return (
    <div className="relative">
      {/* Thread line */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-white/[0.05]"></div>
      
      {/* Reply Content */}
      <div 
        className={`relative p-6 ${level > 0 ? 'pl-16' : ''} ${
          isResolved 
            ? 'bg-green-500/[0.08] border-y border-green-500/20' 
            : ''
        }`}
      >
        {/* Solution Button or Status - Positioned at top right */}
        {level === 0 && isCreator && 
         reply.userId !== currentUser?.id && 
         !resolvedReply && (
          <button
            onClick={handleResolve}
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
                onClick={() => onLike(reply.id)}
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

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className={`flex items-center gap-1.5 transition-colors ${
                  showReplyForm 
                    ? 'text-blue-500 hover:text-blue-400' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm">Reply</span>
              </button>
            </div>

            {/* Nested Reply Form */}
            {showReplyForm && (
              <div className="mt-4">
                <CommentForm
                  onSubmit={handleSubmit}
                  newComment={replyText}
                  setNewComment={setReplyText}
                  placeholder="Write your reply..."
                  submitLabel="Reply"
                  isLoading={isSubmitting}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {childReplies.length > 0 && (
        <div className="ml-12">
          {childReplies.map(childReply => (
            <ReplyItem
              key={childReply.id}
              reply={childReply}
              level={level + 1}
              discussionId={discussionId}
              currentUser={currentUser}
              isCreator={isCreator}
              onResolve={onResolve}
              resolvedReply={resolvedReply}
              comment={comment}
              onLike={onLike}
              onSubmitReply={onSubmitReply}
              allReplies={allReplies}
              setReplies={setReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyItem; 