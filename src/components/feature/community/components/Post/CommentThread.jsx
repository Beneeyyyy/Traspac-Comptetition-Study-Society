import { useState } from 'react'
import { FiMessageSquare, FiSend, FiX, FiLoader } from 'react-icons/fi'
import { useCommunity } from '../../context/CommunityContext'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_COMMENT_LENGTH = 500

const CommentThread = ({ questionId, answerId, comment, level = 0, onCommentSubmit }) => {
  const { addComment } = useCommunity()
  const [showReplyForm, setShowReplyForm] = useState(!comment) // Show form by default if no comment
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return
    if (replyContent.length > MAX_COMMENT_LENGTH) {
      setError(`Komentar tidak boleh lebih dari ${MAX_COMMENT_LENGTH} karakter`)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await addComment(questionId, answerId, {
        content: replyContent.trim(),
        parentId: comment?.id, // undefined for top-level comments
        timeAgo: 'Baru saja'
      })

      setReplyContent('')
      setShowReplyForm(false)
      onCommentSubmit?.() // Call the callback if provided
    } catch (err) {
      setError('Gagal mengirim komentar. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitReply()
    }
  }

  // Limit nesting level to prevent too deep threads
  const canReply = level < 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative space-y-4 ${level > 0 ? 'ml-10 pt-2' : ''}`}
    >
      {/* Thread Line */}
      {level > 0 && (
        <div className="absolute left-[-34px] -top-6 bottom-0">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
          {/* Horizontal line */}
          <div className="absolute left-3 top-[28px] w-7 h-px bg-white/10" />
        </div>
      )}

      {/* Comment Content */}
      {comment && (
        <div className="relative flex gap-3">
          <div className="relative">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-7 h-7 rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-all"
            />
            {/* Vertical line extension below avatar for replies */}
            {(comment.replies?.length > 0 || showReplyForm) && (
              <div className="absolute left-3 top-8 w-px h-full bg-gradient-to-b from-white/10 to-transparent" />
            )}
          </div>
          <div className="flex-1">
            {/* Comment Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                {comment.user.name}
              </span>
              <span className="px-2 py-0.5 bg-white/[0.03] text-white/40 rounded-lg text-xs border border-white/5">
                Komentar
              </span>
              <span className="text-xs text-white/40">
                {comment.timeAgo}
              </span>
            </div>
            <div className="space-y-2">
              <div className="group">
                <p className="text-sm text-white/70 bg-white/[0.02] px-4 py-2.5 rounded-xl border border-transparent group-hover:border-white/5 transition-all">
                  {comment.content}
                </p>
              </div>
              {canReply && (
                <button
                  onClick={() => {
                    setShowReplyForm(!showReplyForm)
                    setError('')
                    setReplyContent('')
                  }}
                  className="text-xs text-white/40 hover:text-white/90 transition-colors flex items-center gap-1.5"
                >
                  <FiMessageSquare className="text-sm" />
                  <span>Balas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reply/Comment Form */}
      <AnimatePresence>
        {(showReplyForm || !comment) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`relative ${comment ? 'ml-10' : ''} ${showReplyForm ? 'mb-8' : ''}`}
          >
            {/* Thread Line for Reply Form */}
            {level > 0 && (
              <div className="absolute left-[-44px] -top-6 bottom-0">
                {/* Vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
                {/* Horizontal line */}
                <div className="absolute left-3 top-[28px] w-7 h-px bg-white/10" />
              </div>
            )}
            <div className="flex items-start gap-3 group">
              <img
                src="/avatars/default.png"
                alt="Your avatar"
                className="w-7 h-7 rounded-full ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => {
                    setReplyContent(e.target.value)
                    if (e.target.value.length > MAX_COMMENT_LENGTH) {
                      setError(`Komentar tidak boleh lebih dari ${MAX_COMMENT_LENGTH} karakter`)
                    } else {
                      setError('')
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={comment ? "Tulis balasan..." : "Tulis komentar..."}
                  className="w-full px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all resize-none min-h-[42px] max-h-32"
                  rows={1}
                />
                {error && (
                  <p className="text-xs text-red-400/90">{error}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/30">
                    {replyContent.length}/{MAX_COMMENT_LENGTH} karakter
                  </span>
                  <div className="flex items-center gap-2">
                    {comment && (
                      <button
                        onClick={() => {
                          setShowReplyForm(false)
                          setError('')
                          setReplyContent('')
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/90 transition-all"
                      >
                        <FiX className="text-lg" />
                      </button>
                    )}
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyContent.trim() || isSubmitting || replyContent.length > MAX_COMMENT_LENGTH}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                        replyContent.trim() && !isSubmitting && replyContent.length <= MAX_COMMENT_LENGTH
                          ? 'text-blue-400 hover:bg-blue-500/10'
                          : 'text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <FiLoader className="text-lg animate-spin" />
                      ) : (
                        <>
                          <FiSend className="text-base" />
                          <span className="text-sm font-medium">Kirim</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested Comments */}
      <AnimatePresence>
        {comment?.replies?.map((reply) => (
          <CommentThread
            key={reply.id}
            questionId={questionId}
            answerId={answerId}
            comment={reply}
            level={level + 1}
            onCommentSubmit={onCommentSubmit}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default CommentThread 