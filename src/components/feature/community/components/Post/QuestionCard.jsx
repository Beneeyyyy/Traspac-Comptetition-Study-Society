import { useState, useRef } from 'react'
import { FiHash, FiThumbsUp, FiThumbsDown, FiMessageSquare, FiImage, FiSend, FiX, FiCornerUpRight, FiEdit } from 'react-icons/fi'
import { useCommunity } from '../../context/CommunityContext'
import CommentThread from './CommentThread'

const QuestionCard = ({ question, expandedQuestion, setExpandedQuestion }) => {
  const { addAnswer, updateVote } = useCommunity()
  const [answerContent, setAnswerContent] = useState('')
  const [answerImages, setAnswerImages] = useState([])
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [activeAnswerId, setActiveAnswerId] = useState(null)
  const [showAllAnswers, setShowAllAnswers] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState(null)
  const answerFileInputRef = useRef(null)

  const handleVote = (value) => {
    updateVote('question', question.id, value)
  }

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return

    addAnswer(question.id, {
      content: answerContent.trim(),
      images: answerImages.map(img => img.preview)
    })

    // Reset form
    setAnswerContent('')
    setAnswerImages([])
    setShowAnswerForm(false)
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

  // Get initial answers to show (3 most recent)
  const initialAnswers = question.answers?.slice(0, 3) || []
  // Get remaining answers
  const remainingAnswers = question.answers?.slice(3) || []
  // Show all answers or just initial ones based on state
  const visibleAnswers = showAllAnswers ? question.answers : initialAnswers

  // Handler for when a comment is successfully submitted
  const handleCommentSubmit = (answerId) => {
    setActiveCommentId(null) // Hide the comment form
    setActiveAnswerId(answerId) // Show comments for this answer
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
              onClick={() => handleVote(1)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-all group"
            >
              <FiThumbsUp className="text-xl group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-lg font-medium text-white/80">
              {question.votes}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-all group"
            >
              <FiThumbsDown className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-6">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={question.user.avatar}
                  alt={question.user.name}
                  className="w-11 h-11 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all"
                />
                <div>
                  <h3 className="font-medium text-white/90 text-lg">
                    {question.user.name}
                  </h3>
                  {question.user.badge && (
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-400 border border-blue-500/10">
                      {question.user.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Question Content with improved typography */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white/90 leading-relaxed">
                {question.title}
              </h2>
              <p className="text-white/70 leading-relaxed text-[15px]">
                {question.content}
              </p>
            </div>

            {/* Question Images with enhanced grid */}
            {question.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {question.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Question image ${index + 1}`}
                    className="rounded-xl border border-white/10 hover:border-white/20 transition-all w-full h-[300px] object-cover"
                  />
                ))}
              </div>
            )}

            {/* Tags with improved visuals */}
            <div className="flex flex-wrap gap-2">
              {question.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.03] hover:bg-white/[0.05] text-white/70 flex items-center gap-2 transition-all border border-white/5 hover:border-white/10"
                >
                  <FiHash className="text-white/40" />
                  {tag}
                </span>
              ))}
            </div>

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
                {question.answers?.length > 0 && (
                  <button
                    onClick={() => setShowAllAnswers(!showAllAnswers)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white/90 transition-all"
                  >
                    <FiMessageSquare className="text-lg" />
                    <span>
                      {showAllAnswers ? 'Sembunyikan Jawaban' : `Lihat ${question.answers.length} Jawaban`}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Answer Form */}
            {showAnswerForm && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/avatars/default.png"
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full ring-1 ring-white/20"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Tulis jawabanmu..."
                      className="w-full px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                    />
                  </div>
                  <input
                    type="file"
                    ref={answerFileInputRef}
                    onChange={handleAnswerImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => answerFileInputRef.current?.click()}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                    title="Tambah gambar"
                  >
                    <FiImage className="text-xl" />
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answerContent.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      answerContent.trim()
                        ? 'text-blue-400 hover:bg-blue-500/10'
                        : 'text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <FiSend className="text-xl" />
                  </button>
                </div>

                {/* Answer Image Previews */}
                {answerImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            {showAllAnswers && question.answers?.length > 0 && (
              <div className="mt-10 space-y-8">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <span>{question.answers.length} Jawaban</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </h3>

                {/* Answer List */}
                {question.answers.map((answer) => (
                  <div key={answer.id} className="space-y-6">
                    {/* Answer Content */}
                    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/30 before:to-emerald-500/10">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-400 rounded-lg font-medium text-sm border border-emerald-500/10">
                          Jawaban
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/40">•</span>
                          <span className="text-white/40">{answer.timeAgo}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={answer.user.avatar}
                          alt={answer.user.name}
                          className="w-10 h-10 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all"
                        />
                        <div>
                          <h4 className="font-medium text-white/90 text-lg mb-1">
                            {answer.user.name}
                          </h4>
                          {answer.user.badge && (
                            <span className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-400 border border-emerald-500/10">
                              {answer.user.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-14 space-y-4">
                        <p className="text-white/70 leading-relaxed text-[15px]">
                          {answer.content}
                        </p>

                        {/* Answer Images */}
                        {answer.images?.length > 0 && (
                          <div className="grid grid-cols-2 gap-6 mt-4">
                            {answer.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.preview || image}
                                alt={`Answer image ${index + 1}`}
                                className="w-full h-[300px] object-contain bg-black/20 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                              />
                            ))}
                          </div>
                        )}

                        {/* Comment Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-4">
                            {answer.comments?.length > 0 && (
                              <button
                                onClick={() => setActiveAnswerId(activeAnswerId === answer.id ? null : answer.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white/90 transition-all"
                              >
                                <FiMessageSquare className="text-lg" />
                                <span>
                                  {activeAnswerId === answer.id ? 'Sembunyikan Komentar' : `${answer.comments.length} Komentar`}
                                </span>
                              </button>
                            )}
                            <button
                              onClick={() => setActiveCommentId(activeCommentId === answer.id ? null : answer.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all"
                            >
                              <FiEdit className="text-lg" />
                              <span>Tambah Komentar</span>
                            </button>
                          </div>
                        </div>

                        {/* Add new comment form - Only show when activeCommentId matches */}
                        {activeCommentId === answer.id && (
                          <CommentThread
                            questionId={question.id}
                            answerId={answer.id}
                            onCommentSubmit={() => handleCommentSubmit(answer.id)}
                          />
                        )}
                      </div>
                    </div>

                    {/* Comments Section - Separate from the form */}
                    {activeAnswerId === answer.id && (
                      <div className="ml-11 pt-4">
                        {answer.comments?.map((comment) => (
                          <CommentThread
                            key={comment.id}
                            questionId={question.id}
                            answerId={answer.id}
                            comment={comment}
                            onCommentSubmit={() => handleCommentSubmit(answer.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard 