import { motion } from 'framer-motion'
import { FiEye, FiMessageSquare, FiHeart } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const WorkCard = ({ work, index, selectedWork, setSelectedWork, onLikeUpdate }) => {
  const isSelected = selectedWork?.id === work.id
  
  // Initialize like state from work data
  const [isLiked, setIsLiked] = useState(work.liked)
  const [likeCount, setLikeCount] = useState(work.likeCount || 0)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  // Sync like state with props immediately when they change
  useEffect(() => {
    setIsLiked(work.liked)
    setLikeCount(work.likeCount || 0)
  }, [work.liked, work.likeCount])

  const handleLike = async (e) => {
    e.stopPropagation()
    
    // Optimistic update
    const wasLiked = isLiked
    const prevCount = likeCount
    const newLiked = !wasLiked
    
    // Update local state immediately
    setIsLiked(newLiked)
    setLikeCount(newLiked ? prevCount + 1 : prevCount - 1)
    
    // Animate heart
    setIsLikeAnimating(true)
    setTimeout(() => setIsLikeAnimating(false), 1000)

    // Call parent handler
    try {
      await onLikeUpdate(work.id, newLiked)
    } catch (error) {
      console.error('Error updating like:', error)
      // Revert on error
      setIsLiked(wasLiked)
      setLikeCount(prevCount)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`group relative cursor-pointer ${
        index % 5 === 0 ? 'row-span-2 col-span-2' : 
        index % 7 === 0 ? 'row-span-2' : 
        index % 3 === 0 ? 'col-span-2' : ''
      }`}
      onClick={() => setSelectedWork(isSelected ? null : work)}
    >
      <div className="relative w-full h-full">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[#1F2937] rounded-xl overflow-hidden">
          {work.image ? (
            <img
              src={work.image}
              alt={work.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" />
          )}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/60 transition-colors duration-300" />
        </div>

        {/* Profile and Stats - Top */}
        <div className="absolute inset-x-0 top-0 p-4">
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2">
              <img
                src={work.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(work.author)}&background=0D8ABC&color=fff`}
                alt={work.author}
                className="w-8 h-8 rounded-full border-2 border-white/20"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/90">{work.author}</span>
                {work.user?.school?.name && (
                  <span className="px-2 py-0.5 text-xs bg-[#2563EB] text-white rounded-full">
                    {work.user.school.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex items-center gap-1">
                <FiEye className="w-4 h-4" />
                <span className="text-sm">{work.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm">{work._count?.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title and Tags - Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{work.title}</h3>
            <div className="flex flex-wrap gap-2">
              {work.tags && work.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs bg-white/10 text-white/90 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Like Button - Bottom Right */}
        <button 
          onClick={handleLike}
          className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isLiked 
              ? 'bg-pink-500/20 text-pink-500' 
              : 'bg-white/10 text-white/90 hover:bg-white/20'
          } opacity-0 group-hover:opacity-100`}
        >
          <FiHeart 
            className={`w-4 h-4 transform transition-all duration-200 ${
              isLiked ? 'fill-current' : ''
            } ${isLikeAnimating ? 'scale-150' : ''}`}
          />
        </button>

        {/* Like Count - Bottom Right */}
        {likeCount > 0 && (
          <div className="absolute bottom-4 right-16 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`text-sm ${isLiked ? 'text-pink-500' : 'text-white/90'}`}>
              {likeCount}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default WorkCard 