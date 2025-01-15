import { useState } from 'react'
import { FiMessageSquare, FiArrowUp, FiArrowDown, FiCornerUpRight } from 'react-icons/fi'
import { useAuth } from '../../../../../../contexts/AuthContext'
import { useForum } from '../../../../../../contexts/forum/ForumContext'
import CommentThread from './CommentThread'

const AnswerCard = ({ answer, isQuestioner, isLastAnswer, questionId }) => {
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState(null)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const { user } = useAuth()
  const { handleVote, refreshQuestion, addComment } = useForum()

  const handleVoteClick = async (type, id, isUpvote) => {
    if (!user) {
      setError('Silakan login terlebih dahulu untuk memberikan vote');
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    setError(null);
    
    try {
      const result = await handleVote(type, id, isUpvote);
      await refreshQuestion(questionId);
    } catch (error) {
      console.error('Error voting:', error);
      setError('Gagal memberikan vote. Silakan coba lagi.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Silakan login terlebih dahulu untuk mengomentari');
      return;
    }

    if (!commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    setError(null);

    try {
      await addComment(questionId, answer.id, commentContent);
      setCommentContent('');
      setShowCommentForm(false);
      await refreshQuestion(questionId);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div 
      key={`answer-${answer.id}`} 
      id={`answer-${answer.id}`}
      className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden"
    >
      <div className="flex">
        {/* Vote Column */}
        <div className="py-6 px-4 flex flex-col items-center gap-2 border-r border-white/10 min-w-[80px]">
          <button
            onClick={() => handleVoteClick('answer', answer.id, true)}
            disabled={isVoting}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              answer.userVote === 'upvote'
                ? 'text-green-500 bg-green-500/10 fill-current' 
                : 'text-gray-400 hover:text-green-500 hover:bg-green-500/5'
            } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiArrowUp className="text-xl" />
            <span className="text-sm font-medium">{answer.upvotes || 0}</span>
          </button>

          <div className="w-8 h-[2px] bg-white/5 rounded-full"></div>

          <button
            onClick={() => handleVoteClick('answer', answer.id, false)}
            disabled={isVoting}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              answer.userVote === 'downvote'
                ? 'text-red-500 bg-red-500/10 fill-current' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-500/5'
            } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiArrowDown className="text-xl" />
            <span className="text-sm font-medium">{answer.downvotes || 0}</span>
          </button>
        </div>

        {/* Content Column */}
        <div className="flex-1 p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
            <div className="relative group">
              <img
                src={answer.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(answer.user?.name)}&background=0D8ABC&color=fff`}
                alt={answer.user?.name || 'User'}
                className="w-14 h-14 rounded-xl ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500/20 to-blue-400/10 rounded-lg flex items-center justify-center ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300">
                <span className="text-[11px] font-medium text-blue-400">{answer.user?.level || 1}</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-white/90 text-lg group-hover:text-white transition-colors">
                {answer.user?.name || 'Anonymous'}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-3 py-1 rounded-lg text-xs bg-black/40 text-white/50 border border-white/5 hover:text-white/70 transition-all">
                  {answer.user?.rank || 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Answer Content */}
          <div className="mt-6 text-white/80">
            {answer.blocks?.sort((a, b) => a.order - b.order).map((block, index) => (
              <div key={index}>
                {block.type === 'text' ? (
                  <p className="whitespace-pre-wrap mb-4">{block.content}</p>
                ) : block.type === 'image' && (
                  <div className={`${block.isFullWidth ? 'w-full' : 'w-1/2 float-left mr-4 mb-4'}`}>
                    <img 
                      src={block.content}
                      alt={`Content ${index + 1}`}
                      className="w-full rounded-xl border border-white/10"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">
              {error}
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white/70">
                Komentar ({answer.comments?.length || 0})
              </h4>
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/40 text-white/60 hover:text-white/90 transition-all border border-white/5 hover:border-white/10 text-sm"
              >
                <FiMessageSquare className="text-base" />
                <span>Tambah Komentar</span>
              </button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <div className="mb-6">
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Tulis komentar..."
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommentForm(false);
                        setCommentContent('');
                        setError(null);
                      }}
                      className="px-4 py-2 text-xs text-white/50 hover:text-white/70 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!commentContent.trim() || isSubmittingComment}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Comment Threads */}
            <div className="space-y-4">
              {answer.comments?.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  questionId={questionId}
                  answerId={answer.id}
                  onCommentSubmit={async () => {
                    await refreshQuestion(questionId);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard 