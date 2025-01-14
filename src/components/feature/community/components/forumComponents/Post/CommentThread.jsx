import { useState } from 'react'
import { FiMessageSquare, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiFlag, FiThumbsUp, FiThumbsDown, FiSend } from 'react-icons/fi'
import { useForum } from '../../../../../../contexts/forum/ForumContext'
import { useAuth } from '../../../../../../contexts/AuthContext'
import { timeAgo } from '../../../../../../utils/dateUtils'

const CommentThread = ({ comment, questionId, answerId, onCommentSubmit }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  
  const { addComment, updateComment, deleteComment, handleVote } = useForum();
  const { user } = useAuth();

  const isCommentOwner = user?.id === comment?.user?.id;
  const hasVoted = comment?.votes?.some(vote => vote.userId === user?.id);
  const userVoteType = comment?.votes?.find(vote => vote.userId === user?.id)?.isUpvote ? 'upvote' : 'downvote';
  const voteCount = comment?.votes?.filter(vote => vote.isUpvote).length - comment?.votes?.filter(vote => !vote.isUpvote).length || 0;

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
      setShowReplies(true);
      onCommentSubmit?.();
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    if (editContent.length > 1000) {
      setError('Komentar tidak boleh lebih dari 1000 karakter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await updateComment(comment.id, editContent.trim());
      setIsEditing(false);
      onCommentSubmit?.();
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Gagal memperbarui komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      return;
    }

    try {
      await deleteComment(comment.id);
      onCommentSubmit?.();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Gagal menghapus komentar. Silakan coba lagi.');
    }
  };

  const handleVoteClick = async (isUpvote) => {
    try {
      await handleVote('comment', comment.id, isUpvote);
      onCommentSubmit?.();
    } catch (err) {
      console.error('Error voting:', err);
      alert('Gagal memberikan vote. Silakan coba lagi.');
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

  // Get visible replies based on showAllReplies state
  const visibleReplies = showAllReplies 
    ? comment.replies 
    : comment.replies?.slice(0, 5);

  const hasMoreReplies = comment.replies?.length > 5;

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
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-white/30">(Diperbarui)</span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-lg text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-white/80 mt-1">{comment.content}</p>
          )}
          
          <div className="mt-2 flex items-center gap-4">
            {/* Vote buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVoteClick(true)}
                className={`text-sm flex items-center gap-1 ${
                  userVoteType === 'upvote' ? 'text-green-500' : 'text-white/50 hover:text-white'
                }`}
              >
                <FiThumbsUp className="w-3 h-3" />
              </button>
              <span className={`text-xs ${voteCount > 0 ? 'text-green-500' : voteCount < 0 ? 'text-red-500' : 'text-white/50'}`}>
                {voteCount}
              </span>
              <button
                onClick={() => handleVoteClick(false)}
                className={`text-sm flex items-center gap-1 ${
                  userVoteType === 'downvote' ? 'text-red-500' : 'text-white/50 hover:text-white'
                }`}
              >
                <FiThumbsDown className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1"
            >
              <FiMessageSquare className="w-3 h-3" />
              Balas
            </button>

            {isCommentOwner && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditContent(comment.content);
                  }}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                >
                  <FiEdit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs text-white/50 hover:text-red-500 flex items-center gap-1"
                >
                  <FiTrash2 className="w-3 h-3" />
                  Hapus
                </button>
              </>
            )}

            {!isCommentOwner && (
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-white/50 hover:text-yellow-500 flex items-center gap-1"
              >
                <FiFlag className="w-3 h-3" />
                Laporkan
              </button>
            )}
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
              {visibleReplies.map((reply) => (
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

              {hasMoreReplies && !showAllReplies && (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="text-xs text-blue-500 hover:text-blue-400 mt-2"
                >
                  Lihat {comment.replies.length - 5} balasan lainnya
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-white mb-4">Laporkan Komentar</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Handle report
                  alert('Terima kasih atas laporannya. Tim kami akan meninjau komentar ini.');
                  setShowReportModal(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-gray-700 rounded-lg"
              >
                Konten tidak pantas
              </button>
              <button
                onClick={() => {
                  // Handle report
                  alert('Terima kasih atas laporannya. Tim kami akan meninjau komentar ini.');
                  setShowReportModal(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-gray-700 rounded-lg"
              >
                Spam
              </button>
              <button
                onClick={() => {
                  // Handle report
                  alert('Terima kasih atas laporannya. Tim kami akan meninjau komentar ini.');
                  setShowReportModal(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-gray-700 rounded-lg"
              >
                Pelecehan atau intimidasi
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentThread 