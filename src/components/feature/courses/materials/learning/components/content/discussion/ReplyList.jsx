import React, { useState, useEffect } from 'react';
import { FiHeart, FiCheck, FiCornerDownRight, FiX, FiMessageSquare } from 'react-icons/fi';
import CommentForm from './CommentForm';
import { useReply } from './hooks/useReply';
import ReplyItem from './ReplyItem';

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

  // Get top-level replies (no parentId)
  const topLevelReplies = replies.filter(reply => !reply.parentId);
  
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
        {topLevelReplies.map(reply => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            level={0}
            discussionId={discussionId}
            currentUser={currentUser}
            isCreator={isCreator}
            onResolve={onResolve}
            resolvedReply={resolvedReply}
            comment={comment}
            onLike={handleLike}
            onSubmitReply={handleSubmitReply}
            allReplies={replies}
            setReplies={setReplies}
          />
        ))}

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