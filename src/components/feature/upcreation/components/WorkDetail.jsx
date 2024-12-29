import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiGithub, FiHeart, FiMessageSquare, FiEye, FiSend, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const WorkDetail = ({ work, setSelectedWork }) => {
  const [comment, setComment] = useState('')
  const [isLiked, setIsLiked] = useState(() => {
    const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '[]')
    return likedWorks.includes(work.id)
  })
  const [showComments, setShowComments] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter only image files
  const imageFiles = work.files.filter(file => file.type.startsWith('image/'))
  
  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? imageFiles.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === imageFiles.length - 1 ? 0 : prev + 1))
  }

  const handleLike = () => {
    const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '[]')
    const works = JSON.parse(localStorage.getItem('studentWorks') || '[]')
    const workIndex = works.findIndex(w => w.id === work.id)
    
    if (workIndex === -1) return

    if (isLiked) {
      works[workIndex].likes--
      const newLikedWorks = likedWorks.filter(id => id !== work.id)
      localStorage.setItem('likedWorks', JSON.stringify(newLikedWorks))
    } else {
      works[workIndex].likes++
      likedWorks.push(work.id)
      localStorage.setItem('likedWorks', JSON.stringify(likedWorks))
    }

    localStorage.setItem('studentWorks', JSON.stringify(works))
    setIsLiked(!isLiked)
    work.likes = works[workIndex].likes // Update current view
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    const works = JSON.parse(localStorage.getItem('studentWorks') || '[]')
    const workIndex = works.findIndex(w => w.id === work.id)
    
    if (workIndex === -1) return

    const newComment = {
      id: Date.now(),
      text: comment,
      author: "Current User",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      createdAt: new Date().toISOString()
    }

    if (!works[workIndex].commentList) {
      works[workIndex].commentList = []
    }

    works[workIndex].commentList.unshift(newComment)
    works[workIndex].comments = works[workIndex].commentList.length

    localStorage.setItem('studentWorks', JSON.stringify(works))
    work.commentList = works[workIndex].commentList // Update current view
    work.comments = works[workIndex].comments
    setComment('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedWork(null)
        }
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-[700px] max-h-[85vh] bg-black/50 border border-[#374151] shadow-2xl rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header with Preview */}
        <div className="relative shrink-0">
          {work.files && work.files.length > 0 ? (
            <div className="aspect-video relative group">
              <img
                src={work.files[currentImageIndex].data}
                alt={work.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Navigation Buttons */}
              {work.files.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm text-xs text-white opacity-0 group-hover:opacity-100">
                    {currentImageIndex + 1} / {work.files.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedWork(null)
            }}
            className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-4">
            {/* User Info and Category */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={work.authorAvatar}
                    alt={work.author}
                    className="w-10 h-10 rounded-full border-2 border-[#374151]"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{work.author}</span>
                      {work.badge && (
                        <span className="px-2 py-0.5 text-xs bg-[#2563EB] text-white rounded-full">
                          {work.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#94A3B8]">Creator</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">{work.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-[#374151] text-xs text-white/90 rounded-full h-fit shrink-0">
                {work.category}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#374151] rounded-lg p-3">
              <p className="text-sm text-[#94A3B8]">{work.description}</p>
            </div>

            {/* Project URL */}
            {work.projectUrl && (
              <a
                href={work.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-[#374151] text-[#94A3B8] hover:text-white transition-colors"
              >
                <FiGithub className="w-4 h-4" />
                <span className="text-sm truncate">{work.projectUrl}</span>
              </a>
            )}

            {/* Stats and Tags */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-4 text-[#94A3B8]">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
                >
                  <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-[#2563EB] text-[#2563EB]' : ''}`} />
                  <span className="text-sm">{work.likes}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <FiMessageSquare className="w-4 h-4" />
                  <span className="text-sm">{work.comments}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  <span className="text-sm">{work.views}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {work.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-[#374151] text-xs text-[#94A3B8] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-[#374151] rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#2D3748] transition-colors"
                onClick={() => setShowComments(!showComments)}
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white">Comments</h4>
                  <span className="text-xs text-[#94A3B8]">({work.comments})</span>
                </div>
                <motion.div
                  animate={{ rotate: showComments ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="w-4 h-4 text-[#94A3B8]" />
                </motion.div>
              </div>

              {showComments && (
                <div className="p-3">
                  {/* Comment Form */}
                  <form onSubmit={handleComment} className="flex gap-2 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="Current User"
                      className="w-8 h-8 rounded-full border-2 border-[#2D3748] shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-[#2D3748] border border-[#4B5563] rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {work.commentList?.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.author}
                          className="w-8 h-8 rounded-full border-2 border-[#2D3748] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{comment.author}</span>
                            <span className="text-xs text-[#64748B]">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#94A3B8] break-words">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    {(!work.commentList || work.commentList.length === 0) && (
                      <p className="text-xs text-[#64748B] text-center py-3">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1F2937;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4B5563;
          }
        `}</style>
      </motion.div>
    </motion.div>
  )
}

export default WorkDetail 