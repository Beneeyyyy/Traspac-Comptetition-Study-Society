import { useState, useRef, useEffect } from 'react'
import { FiHash, FiMessageSquare, FiImage, FiSend, FiX, FiCornerUpRight, FiEdit, FiLoader, FiAlertCircle, FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { useCommunity } from '../../../../../../contexts/CommunityContext'
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
      if (!question?.id) return; // Skip if no question id
      
      try {
        const updatedQuestion = await refreshQuestion(question.id);
        if (updatedQuestion) {
          setAnswersCount(updatedQuestion.answers?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching answers count:', err);
        // Set default value on error
        setAnswersCount(question.answers?.length || 0);
      }
    };
    
    fetchAnswersCount();
  }, [question?.id]); // Depend on question.id

  const handleVote = async (type = 'post', id = question.id, isUpvote) => {
    if (isVoting) return;
    if (!currentUser) {
      setError('Silakan login terlebih dahulu untuk memberikan vote');
      return;
    }
    
    setIsVoting(true);
    setError(null);
    
    try {
      await updateVote(type, id, isUpvote);
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.message || 'Gagal memberikan vote. Silakan coba lagi.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleAnswerImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 15 * 1024 * 1024; // 15MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Validasi file
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF');
        return;
      }
      if (file.size > maxSize) {
        setError('Ukuran gambar terlalu besar (maksimal 15MB)');
        return;
      }
    }

    try {
      // Convert files to base64
      const newImages = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                data: reader.result, // Use base64 for both preview and upload
                name: file.name,
                type: file.type
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      // Update state dengan preview images
      setAnswerImages(prev => {
        const combined = [...prev, ...newImages];
        return combined.slice(0, 4); // Maksimal 4 gambar
      });
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Gagal memproses gambar. Silakan coba lagi.');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || isSubmitting) return;
    if (!currentUser) {
      setError('Silakan login terlebih dahulu untuk menjawab');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Kirim jawaban dengan base64 data untuk diupload ke Cloudinary
      const response = await addAnswer(question.id, {
        content: answerContent.trim(),
        images: answerImages.map(img => img.data) // Kirim base64 untuk diupload
      });

      // Reset form
      setAnswerContent('');
      setAnswerImages([]);
      setShowAnswerForm(false);
      
      // Refresh data dan update UI
      const updatedQuestion = await refreshQuestion(question.id);
      setAnswersCount(updatedQuestion.answers?.length || 0);
      setShowAllAnswers(true);
      setVisibleAnswersCount(4);
      
      setTimeout(() => {
        const answersSection = document.getElementById(`answer-${updatedQuestion.answers[0].id}`);
        if (answersSection) {
          answersSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err.message || 'Gagal mengirim jawaban. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="p-10">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/5 text-blue-400 rounded-xl font-medium text-sm border border-blue-500/10 hover:from-blue-500/30 hover:via-blue-400/20 hover:to-blue-500/10 transition-all">
              Pertanyaan
            </span>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-white/40 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                <FiEye className="text-sm" />
                <span>{question.views} dilihat</span>
              </div>
              <span className="text-white/30">•</span>
              <span className="text-white/40 hover:text-white/60 transition-colors">{question.timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Vote Column */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/[0.02] border border-white/5">
              <button
                onClick={() => handleVote('post', question.id, true)}
                disabled={isVoting}
                className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gradient-to-b hover:from-green-500/20 hover:to-green-400/5 text-white/50 hover:text-green-400 transition-all ${
                  isVoting ? 'cursor-not-allowed opacity-50' : ''
                } ${question.userVote === 'upvote' ? 'bg-green-500/20 text-green-400' : ''}`}
              >
                {isVoting ? (
                  <FiLoader className="text-xl animate-spin" />
                ) : (
                  <FiArrowUp className="text-xl group-hover:scale-110 transition-transform" />
                )}
                <span className="text-xs font-medium">
                  {question.upvoteCount || 0}
                </span>
              </button>

              <div className="my-2 h-[1px] w-full bg-white/5"></div>

              <button
                onClick={() => handleVote('post', question.id, false)}
                disabled={isVoting}
                className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gradient-to-b hover:from-red-500/20 hover:to-red-400/5 text-white/50 hover:text-red-400 transition-all ${
                  isVoting ? 'cursor-not-allowed opacity-50' : ''
                } ${question.userVote === 'downvote' ? 'bg-red-500/20 text-red-400' : ''}`}
              >
                {isVoting ? (
                  <FiLoader className="text-xl animate-spin" />
                ) : (
                  <FiArrowDown className="text-xl group-hover:scale-110 transition-transform" />
                )}
                <span className="text-xs font-medium">
                  {question.downvoteCount || 0}
                </span>
              </button>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-8">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="relative group">
                <img
                  src={getUserAvatar(question.user)}
                  alt={question.user?.name || 'User'}
                  className="w-14 h-14 rounded-xl ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500/20 to-blue-400/10 rounded-lg flex items-center justify-center ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300">
                  <span className="text-[11px] font-medium text-blue-400">{question.user?.level || 1}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-white/90 text-lg group-hover:text-white transition-colors">
                  {question.user?.name || 'Anonymous'}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-white/[0.03] to-white/[0.02] text-white/50 border border-white/5 hover:text-white/70 transition-all">
                    {question.user?.rank || 'Member'}
                  </span>
                  {question.user?.badges?.map((badge, index) => (
                    <span 
                      key={index}
                      className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-400 border border-blue-500/10"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white/90 leading-relaxed hover:text-white transition-colors">
                {question.title}
              </h2>
              <p className="text-white/70 leading-relaxed text-[15px] whitespace-pre-wrap hover:text-white/80 transition-colors">
                {question.content}
              </p>
            </div>

            {/* Question Images */}
            {question.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mt-6">
                {question.images.map((imageUrl, index) => (
                  <div key={`question-image-${question.id}-${index}`} className="relative group rounded-xl overflow-hidden">
                    <img
                      src={imageUrl} // URL Cloudinary dari database
                      alt={`Question image ${index + 1}`}
                      className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Failed to load question image:', imageUrl);
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6">
              {question.tags?.map(tag => (
                <span
                  key={`question-tag-${question.id}-${tag}`}
                  className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-white/[0.03] to-white/[0.01] hover:from-white/[0.05] hover:to-white/[0.02] text-white/60 hover:text-white/80 flex items-center gap-2 transition-all border border-white/5 hover:border-white/10 cursor-pointer"
                >
                  <FiHash className="text-white/40" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in flex items-center gap-2">
                <FiAlertCircle className="text-lg" />
                {error}
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <button
                onClick={() => setShowAnswerForm(!showAnswerForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/5 text-blue-400 hover:from-blue-500/30 hover:via-blue-400/20 hover:to-blue-500/10 transition-all border border-blue-500/10 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <FiCornerUpRight className="text-lg" />
                <span className="font-medium">Jawab Pertanyaan</span>
              </button>

              <button
                onClick={handleToggleAnswers}
                disabled={isLoadingAnswers}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white/90 transition-all border border-white/5 hover:border-white/10"
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

            {/* Answer Form */}
            {showAnswerForm && (
              <div className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex gap-4">
                  {/* User Profile */}
                  <div className="flex items-start gap-4">
                    <img
                      src={getUserAvatar(currentUser)}
                      alt={currentUser?.name || 'User'}
                      className="w-12 h-12 rounded-xl ring-2 ring-white/10 hover:ring-blue-500/50 transition-all"
                    />
                    <div>
                      <span className="font-medium text-white/90">
                        {currentUser?.name || 'Anonymous'}
                      </span>
                      <span className="px-3 py-1 bg-white/[0.03] text-white/40 rounded-lg text-xs border border-white/5 mt-2 block">
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
                      className="w-full px-4 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => answerFileInputRef.current?.click()}
                          className="p-2.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-all border border-white/5 hover:border-white/10"
                          title="Tambah gambar (Maks. 4 gambar, 15MB/gambar)"
                        >
                          <FiImage className="text-xl" />
                          <span className="text-xs ml-1">{answerImages.length}/4</span>
                        </button>
                        <input
                          type="file"
                          ref={answerFileInputRef}
                          onChange={handleAnswerImageUpload}
                          accept="image/jpeg,image/png,image/gif"
                          multiple
                          className="hidden"
                        />
                      </div>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!answerContent.trim() || isSubmitting}
                        className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                          answerContent.trim() && !isSubmitting
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-400/10 text-blue-400 hover:from-blue-500/30 hover:to-blue-400/20 border border-blue-500/10 hover:border-blue-500/20'
                            : 'bg-white/[0.02] text-white/30 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        {isSubmitting ? (
                          <FiLoader className="text-xl animate-spin" />
                        ) : (
                          <>
                            <FiSend className="text-lg" />
                            <span>Kirim Jawaban</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Image Previews */}
                {answerImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {answerImages.map((image, index) => (
                      <div key={`preview-${index}`} className="relative group">
                        <img
                          src={image} // base64 untuk preview saja
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg border border-white/10 group-hover:border-white/20 transition-all"
                          onError={(e) => {
                            console.error('Failed to load preview:', index);
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <button
                          onClick={() => removeAnswerImage(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/80 hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
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
                      <div 
                        key={`answer-${answer.id}`} 
                        id={`answer-${answer.id}`} // Add ID for scrolling
                        className="border-t border-white/5 pt-6 animate-fade-in"
                      >
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
                                {answer.images.map((imageUrl, index) => (
                                  <div key={`answer-image-${answer.id}-${index}`} className="relative group">
                                    <img
                                      src={imageUrl} // URL Cloudinary dari database
                                      alt={`Answer image ${index + 1}`}
                                      className="rounded-lg border border-white/10 w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                      onError={(e) => {
                                        console.error('Failed to load answer image:', imageUrl);
                                        e.target.src = '/images/placeholder.png';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-4 flex items-center gap-4">
                              <button
                                onClick={() => handleVote('answer', answer.id, true)}
                                className="flex items-center gap-2 text-white/50 hover:text-green-400 transition-colors"
                              >
                                <FiArrowUp className="text-lg" />
                                <span>{answer.upvoteCount || 0}</span>
                              </button>
                              <button
                                onClick={() => handleVote('answer', answer.id, false)}
                                className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors"
                              >
                                <FiArrowDown className="text-lg" />
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
                        Tampilkan {remainingAnswersCount} jawaban lainnya
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