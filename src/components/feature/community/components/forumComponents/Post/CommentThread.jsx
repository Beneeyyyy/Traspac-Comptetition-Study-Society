import { useState } from 'react'
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiCornerUpRight } from 'react-icons/fi'
import { useAuth } from '../../../../../../contexts/AuthContext'
import { useForum } from '../../../../../../contexts/forum/ForumContext'

const CommentThread = ({ comment, questionId, answerId, onCommentSubmit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const { addComment } = useForum()

  const handleSubmitReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      await addComment(questionId, answerId, replyContent.trim(), comment.id)
      setReplyContent('')
      setShowReplyForm(false)
      onCommentSubmit()
    } catch (err) {
      console.error('Error submitting reply:', err)
      setError(err.message || 'Gagal mengirim balasan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Main Comment */}
      <div className="flex gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all group">
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
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white/90 text-sm">
              {comment.user?.name || 'Anonymous'}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-gradient-to-r from-white/[0.03] to-white/[0.02] text-white/50 border border-white/5">
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
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/90 transition-colors"
            >
              <FiCornerUpRight className="text-sm" />
              <span>Balas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 ml-14">
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Tulis balasan..."
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
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
        <div className="mt-3 ml-14 space-y-3">
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