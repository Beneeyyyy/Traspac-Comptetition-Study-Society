import { useState, useRef, useEffect } from 'react'
import { FiHash, FiThumbsUp, FiThumbsDown, FiMessageSquare, FiImage, FiSend, FiX, FiCornerUpRight, FiEdit, FiLoader } from 'react-icons/fi'
import { useCommunity } from '../../../context/CommunityContext'
import CommentThread from './CommentThread'

const QuestionCard = ({ question, expandedQuestion, setExpandedQuestion }) => {
  const { addAnswer, updateVote, refreshQuestion, currentUser } = useCommunity()
  const [answerContent, setAnswerContent] = useState('')
  const [answerImages, setAnswerImages] = useState([])
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [activeAnswerId, setActiveAnswerId] = useState(null)
  const [showAllAnswers, setShowAllAnswers] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const [answersCount, setAnswersCount] = useState(0)
  const answerFileInputRef = useRef(null)
  const [visibleAnswersCount, setVisibleAnswersCount] = useState(4)

  // Fetch answers count when component mounts
  useEffect(() => {
    const fetchAnswersCount = async () => {
      try {
        const updatedQuestion = await refreshQuestion(question.id)
        setAnswersCount(updatedQuestion.answers?.length || 0)
      } catch (err) {
        console.error('Error fetching answers count:', err)
      }
    }
    fetchAnswersCount()
  }, [question.id])

  const handleVote = async (type = 'question', id = question.id, isUpvote) => {
    if (isVoting) return
    setIsVoting(true)
    try {
      await updateVote(type, id, isUpvote)
    } catch (err) {
      console.error('Error voting:', err)
      // Show error message to user
      setError('Gagal memberikan vote. Silakan coba lagi.')
      setTimeout(() => setError(null), 3000) // Clear error after 3 seconds
    } finally {
      setIsVoting(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || isSubmitting) return
    if (!currentUser) {
      setError('Silakan login terlebih dahulu untuk menjawab')
      return
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      await addAnswer(question.id, {
        content: answerContent.trim(),
        images: answerImages.map(img => img.preview)
      })

      // Reset form
      setAnswerContent('')
      setAnswerImages([])
      setShowAnswerForm(false)
    } catch (err) {
      setError(err.message || 'Gagal mengirim jawaban. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setAnswerImages(prev => [...prev, ...newImages].slice(0, 4))
  }

  const removeAnswerImage = (index) => {
    setAnswerImages(prev => prev.filter((_, i) => i !== index))
  }

  const isExpanded = expandedQuestion === question.id

  // Get all answers
  const answers = question.answers || []
  // Sort answers by date (newest first)
  const sortedAnswers = [...answers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  // Get visible answers
  const visibleAnswers = sortedAnswers.slice(0, visibleAnswersCount)
  // Get remaining answers count
  const remainingAnswersCount = sortedAnswers.length - visibleAnswers.length

  // Handler untuk menampilkan lebih banyak jawaban
  const handleShowMoreAnswers = () => {
    setVisibleAnswersCount(prev => prev + 3)
  }

  // Handler untuk menampilkan/menyembunyikan jawaban
  const handleToggleAnswers = async () => {
    if (!showAllAnswers) {
      setIsLoadingAnswers(true)
      try {
        const updatedQuestion = await refreshQuestion(question.id)
        setAnswersCount(updatedQuestion.answers?.length || 0)
        // Reset visible answers count when showing answers
        setVisibleAnswersCount(4)
      } catch (err) {
        console.error('Error loading answers:', err)
        setError('Gagal memuat jawaban. Silakan coba lagi.')
      } finally {
        setIsLoadingAnswers(false)
      }
    } else {
      // Reset visible answers count when hiding answers
      setVisibleAnswersCount(4)
    }
    setShowAllAnswers(!showAllAnswers)
  }

  // Handler for when a comment is successfully submitted
  const handleCommentSubmit = (answerId) => {
    setActiveCommentId(null) // Hide the comment form
    setActiveAnswerId(answerId) // Show comments for this answer
  }

  // Helper function untuk mendapatkan user avatar
  const getUserAvatar = (user) => {
    if (!user) return '/avatars/default.png'
    return user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300">
      <div className="p-8">
        {/* Question Header with improved spacing and hierarchy */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-400 rounded-lg font-medium text-sm border border-blue-500/10">
            Pertanyaan
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/40">•</span>
            <span className="text-white/40">{question.timeAgo}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/40">{question.views} dilihat</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Vote Column with enhanced visuals */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className={`p-2.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-all group ${
                isVoting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isVoting ? (
                <FiLoader className="text-xl animate-spin" />
              ) : (
                <FiThumbsUp className="text-xl group-hover:scale-110 transition-transform" />
              )}
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-green-400/80">
                {question.upvoteCount || 0}
              </span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-sm font-medium text-red-400/80">
                {question.downvoteCount || 0}
              </span>
            </div>
            <button
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className={`p-2.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-all group ${
                isVoting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isVoting ? (
                <FiLoader className="text-xl animate-spin" />
              ) : (
                <FiThumbsDown className="text-xl group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-6">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={getUserAvatar(question.user)}
                  alt={question.user?.name || 'User'}
                  className="w-11 h-11 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all"
                />
                <div>
                  <h3 className="font-medium text-white/90 text-lg">
                    {question.user?.name || 'Anonymous'}
                  </h3>
                  <span className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.03] text-white/40 border border-white/5">
                    {question.user?.rank || 'Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question Content with improved typography */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white/90 leading-relaxed">
                {question.title}
              </h2>
              <p className="text-white/70 leading-relaxed text-[15px] whitespace-pre-wrap">
                {question.content}
              </p>
            </div>

            {/* Question Images with enhanced grid */}
            {question.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {question.images.map((image, index) => (
                  <img
                    key={`question-image-${question.id}-${index}`}
                    src={image}
                    alt={`Question image ${index + 1}`}
                    className="rounded-xl border border-white/10 hover:border-white/20 transition-all w-full h-[300px] object-cover"
                  />
                ))}
              </div>
            )}

            {/* Tags with improved visuals */}
            <div className="flex flex-wrap gap-2">
              {question.tags?.map(tag => (
                <span
                  key={`question-tag-${question.id}-${tag}`}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.03] hover:bg-white/[0.05] text-white/70 flex items-center gap-2 transition-all border border-white/5 hover:border-white/10"
                >
                  <FiHash className="text-white/40" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm mt-4">
                {error}
              </div>
            )}

            {/* Question Footer with enhanced buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAnswerForm(!showAnswerForm)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-400 hover:from-blue-500/30 hover:to-blue-400/20 transition-all border border-blue-500/10 hover:border-blue-500/20"
                >
                  <FiCornerUpRight className="text-lg" />
                  <span className="font-medium">Jawab</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleAnswers}
                  disabled={isLoadingAnswers}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white/90 transition-all"
                >
                  {isLoadingAnswers ? (
                    <FiLoader className="text-lg animate-spin" />
                  ) : (
                    <FiMessageSquare className="text-lg" />
                  )}
                  <span>
                    {showAllAnswers 
                      ? 'Sembunyikan Jawaban' 
                      : answersCount > 0 
                        ? `Lihat ${answersCount} Jawaban`
                        : 'Lihat Jawaban'
                    }
                  </span>
                </button>
              </div>
            </div>

            {/* Answer Form */}
            {showAnswerForm && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  {/* User Profile */}
                  <div className="flex items-start gap-3">
                    <img
                      src={getUserAvatar(currentUser)}
                      alt={currentUser?.name || 'User'}
                      className="w-11 h-11 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-white/90">
                        {currentUser?.name || 'Anonymous'}
                      </span>
                      <span className="px-2 py-0.5 bg-white/[0.03] text-white/40 rounded-lg text-xs border border-white/5 mt-1 whitespace-nowrap">
                        {currentUser?.rank || 'Member'}
                      </span>
                    </div>
                  </div>

                  {/* Answer Form Content */}
                  <div className="flex-1">
                    <textarea
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Tulis jawabanmu..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => answerFileInputRef.current?.click()}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                          title="Tambah gambar"
                        >
                          <FiImage className="text-xl" />
                        </button>
                        <input
                          type="file"
                          ref={answerFileInputRef}
                          onChange={handleAnswerImageUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!answerContent.trim() || isSubmitting}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          answerContent.trim() && !isSubmitting
                            ? 'text-blue-400 hover:bg-blue-500/10'
                            : 'text-white/30 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <FiLoader className="text-xl animate-spin" />
                        ) : (
                          <>
                            <FiSend className="text-xl" />
                            <span>Kirim</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Image Previews */}
                {answerImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ml-14">
                    {answerImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg border border-white/10"
                        />
                        <button
                          onClick={() => removeAnswerImage(index)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Answers Section */}
            {showAllAnswers && (
              <div className="mt-8 space-y-6">
                {visibleAnswers.length > 0 ? (
                  <>
                    {visibleAnswers.map((answer) => (
                      <div key={`answer-${answer.id}`} className="border-t border-white/5 pt-6">
                        <div className="flex gap-4">
                          {/* User Profile Section */}
                          <div className="flex items-start gap-3">
                            <img
                              src={getUserAvatar(answer.user)}
                              alt={answer.user?.name || 'User'}
                              className="w-11 h-11 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-white/90">
                                {answer.user?.name || 'Anonymous'}
                              </span>
                              <span className="px-2 py-0.5 bg-white/[0.03] text-white/40 rounded-lg text-xs border border-white/5 mt-1 whitespace-nowrap">
                                {answer.user?.rank || 'Member'}
                              </span>
                              <span className="text-xs text-white/40 mt-1">
                                {answer.timeAgo || 'Just now'}
                              </span>
                            </div>
                          </div>

                          {/* Answer Content Section */}
                          <div className="flex-1">
                            <div className="prose prose-invert max-w-none">
                              <p className="text-white/70 whitespace-pre-wrap">
                                {answer.content}
                              </p>
                            </div>
                            {answer.images?.length > 0 && (
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                {answer.images.map((image, index) => (
                                  <img
                                    key={`answer-image-${answer.id}-${index}`}
                                    src={image}
                                    alt={`Answer image ${index + 1}`}
                                    className="rounded-lg border border-white/10 w-full h-48 object-cover"
                                  />
                                ))}
                              </div>
                            )}
                            <div className="mt-4 flex items-center gap-4">
                              <button
                                onClick={() => handleVote('answer', answer.id, true)}
                                className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors"
                              >
                                <FiThumbsUp className="text-lg" />
                                <span>{answer.upvoteCount || 0}</span>
                              </button>
                              <button
                                onClick={() => handleVote('answer', answer.id, false)}
                                className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors"
                              >
                                <FiThumbsDown className="text-lg" />
                                <span>{answer.downvoteCount || 0}</span>
                              </button>
                              <button
                                onClick={() => setActiveCommentId(activeCommentId === answer.id ? null : answer.id)}
                                className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors"
                              >
                                <FiMessageSquare className="text-lg" />
                                <span>Komentar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Comment Thread for Answer */}
                        {activeCommentId === answer.id && (
                          <div className="mt-4 ml-14">
                            <CommentThread
                              questionId={question.id}
                              answerId={answer.id}
                              onCommentSubmit={() => handleCommentSubmit(answer.id)}
                              maxComments={5}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {remainingAnswersCount > 0 && (
                      <button
                        onClick={handleShowMoreAnswers}
                        className="w-full py-3 mt-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white/90 transition-all border border-white/5 hover:border-white/10"
                      >
                        Tampilkan {Math.min(3, remainingAnswersCount)} jawaban lainnya
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    Belum ada jawaban untuk pertanyaan ini
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard 