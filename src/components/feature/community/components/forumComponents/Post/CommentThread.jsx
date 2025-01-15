import { useState } from 'react'
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiCornerUpRight, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { useAuth } from '../../../../../../contexts/AuthContext'
import { useForum } from '../../../../../../contexts/forum/ForumContext'

const CommentThread = ({ comment, questionId, answerId, onCommentSubmit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const { user } = useAuth()
  const { handleVote, voteStatus } = useForum()

  const handleVoteClick = async (isUpvote) => {
    if (!user) {
      setError('Silakan login terlebih dahulu untuk memberikan vote');
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    setError(null);
    
    try {
      await handleVote('comment', comment.id, isUpvote);
      onCommentSubmit(); // Refresh data setelah voting
    } catch (error) {
      console.error('Error voting:', error);
      setError('Gagal memberikan vote. Silakan coba lagi.');
    } finally {
      setIsVoting(false);
    }
  };

  // Get current vote status
  const currentVoteStatus = voteStatus[`comment-${comment.id}`];
  const score = comment.upvotes - comment.downvotes;

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Silakan login terlebih dahulu untuk membalas');
      return;
    }

    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const content = replyContent.trim();
      await addComment(questionId, answerId, content, comment.id);
      setReplyContent('');
      setShowReplyForm(false);
      onCommentSubmit();
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Gagal mengirim balasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Comment */}
      <div className="relative flex gap-4 bg-black/40 rounded-lg">
        {/* Vertical Line */}
        <div className="absolute left-5 top-[3.75rem] bottom-0 w-px bg-white/10" />
        
        <div className="flex gap-4 w-full p-4">
          {/* Vote Column */}
          <div className="flex flex-col items-center gap-1 min-w-[40px]">
            <div className={`flex flex-col items-center rounded-lg transition-all ${
              currentVoteStatus === 'upvote' ? 'bg-green-500/10' : ''
            }`}>
              <button
                onClick={() => handleVoteClick(true)}
                disabled={isVoting}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                  currentVoteStatus === 'upvote'
                    ? 'text-green-500 fill-current' 
                    : 'text-gray-400 hover:text-green-500'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiArrowUp className={currentVoteStatus === 'upvote' ? 'text-base fill-current' : 'text-base'} />
              </button>

              <span className={`text-xs font-medium mb-1 ${
                currentVoteStatus === 'upvote' ? 'text-green-500' : 'text-white/40'
              }`}>
                {comment.upvotes || 0}
              </span>
            </div>

            <div className={`flex flex-col items-center rounded-lg transition-all ${
              currentVoteStatus === 'downvote' ? 'bg-red-500/10' : ''
            }`}>
              <button
                onClick={() => handleVoteClick(false)}
                disabled={isVoting}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                  currentVoteStatus === 'downvote'
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 hover:text-red-500'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiArrowDown className={currentVoteStatus === 'downvote' ? 'text-base fill-current' : 'text-base'} />
              </button>

              <span className={`text-xs font-medium mb-1 ${
                currentVoteStatus === 'downvote' ? 'text-red-500' : 'text-white/40'
              }`}>
                {comment.downvotes || 0}
              </span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={comment.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name)}&background=0D8ABC&color=fff`}
                alt={comment.user?.name}
                className="w-10 h-10 rounded-lg ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500/20 to-blue-400/10 rounded-md flex items-center justify-center ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300">
                <span className="text-[10px] font-medium text-blue-400">{comment.user?.level || 1}</span>
              </div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-white/90 text-sm">
                {comment.user?.name || 'Anonymous'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-white/50">
                {comment.user?.rank || 'Member'}
              </span>
              <span className="text-[10px] text-white/40">
                {comment.timeAgo || 'Just now'}
              </span>
            </div>

            <p className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors"
              >
                <FiCornerUpRight className="text-sm" />
                <span>Balas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="relative mt-3 pl-14">
          {/* Horizontal Line */}
          <div className="absolute left-5 top-0 w-9 h-px bg-white/10" />
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Tulis balasan..."
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
              rows={3}
            />
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-xs border border-red-500/20">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!replyContent.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies?.length > 0 && (
        <div className="relative pl-14 mt-3 space-y-3">
          {/* Horizontal Line */}
          <div className="absolute left-5 top-0 w-9 h-px bg-white/10" />
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              questionId={questionId}
              answerId={answerId}
              onCommentSubmit={onCommentSubmit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentThread 