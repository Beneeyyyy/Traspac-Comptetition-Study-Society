import { useState } from 'react'
import { FiMessageSquare, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { useCommunity } from '../../../../../../contexts/CommunityContext'
import { useAuth } from '../../../../../../contexts/AuthContext'
import { timeAgo } from '../../../../../../utils/dateUtils'

const CommentThread = ({ comment, questionId, answerId, onCommentSubmit }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const { addComment } = useCommunity();
  const { user } = useAuth();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    if (replyContent.length > 1000) {
      setError('Komentar tidak boleh lebih dari 1000 karakter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addComment(questionId, answerId, {
        content: replyContent.trim(),
        parentId: comment?.id
      });

      setReplyContent('');
      setShowReplyForm(false);
      onCommentSubmit?.();
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If this is a new comment form (no comment prop)
  if (!comment) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Tulis komentar..."
            className="w-full p-2 bg-gray-800 rounded-lg text-sm text-white/90 placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <img 
          src={comment.user?.image || '/assets/images/default-avatar.png'} 
          alt={comment.user?.name || 'User'}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{comment.user?.name || 'Anonymous'}</span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-xs text-white/50">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-white/80 mt-1">{comment.content}</p>
          
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1"
            >
              <FiMessageSquare className="w-3 h-3" />
              Balas
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Tulis balasan..."
                  className="w-full p-2 bg-gray-800 rounded-lg text-sm text-white/90 placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={2}
                  disabled={isSubmitting}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                      setError('');
                    }}
                    className="px-3 py-1 text-sm text-white/50 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="pl-11 border-l border-white/10">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1 mb-3"
          >
            {showReplies ? (
              <>
                <FiChevronUp className="w-4 h-4" />
                Sembunyikan {comment.replies.length} balasan
              </>
            ) : (
              <>
                <FiChevronDown className="w-4 h-4" />
                Lihat {comment.replies.length} balasan
              </>
            )}
          </button>
          
          {showReplies && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="relative">
                  <div className="absolute -left-[41px] top-4 w-8 h-px bg-white/10" />
                  <CommentThread
                    comment={reply}
                    questionId={questionId}
                    answerId={answerId}
                    onCommentSubmit={onCommentSubmit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentThread 