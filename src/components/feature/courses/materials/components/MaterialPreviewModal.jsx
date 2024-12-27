import { useEffect, useRef } from 'react'
import { FiX, FiStar, FiBook, FiAward, FiCheckCircle, FiClock, FiUsers, FiBarChart } from 'react-icons/fi'

const MaterialPreviewModal = ({ material, isOpen, onClose, onStartLearning }) => {
  const modalRef = useRef(null)

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    // Handle ESC key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const learningSteps = [
    { id: 1, name: 'Introduction', icon: FiBook, description: 'Get started with the basics' },
    { id: 2, name: 'Theory', icon: FiBook, description: 'Learn core concepts' },
    { id: 3, name: 'Quiz', icon: FiAward, description: 'Test your knowledge' },
    { id: 4, name: 'Practice', icon: FiBook, description: 'Apply what you learned' },
    { id: 5, name: 'Final Test', icon: FiCheckCircle, description: 'Complete certification' }
  ]

  // Mock data for comments (in real app, this would come from API)
  const bestComments = [
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'This material is exceptionally well-structured and easy to follow. The practical examples really helped me understand the concepts better.'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      rating: 5,
      comment: 'The interactive elements and real-world applications make this material stand out. Highly recommended!'
    }
  ]

  const criticalComments = [
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 2,
      comment: 'Could use more practical examples. The theory section was a bit too dense.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with more blur */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#0A0A0B] to-[#0F0F13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{ 
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
        }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Close button with better hover effect */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 hover:scale-110 z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="relative p-8">
          {/* Header with material image */}
          <div className="flex gap-6 mb-8">
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
              {material.image ? (
                <img
                  src={material.image}
                  alt={material.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiBook className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-3">{material.title}</h2>
              <p className="text-lg text-white/60 mb-4">{material.content}</p>
              
              {/* Quick stats */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-white/40">
                  <FiClock className="text-blue-400" />
                  <span>10 mins</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <FiUsers className="text-purple-400" />
                  <span>500+ Students</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <FiBarChart className="text-green-400" />
                  <span>Beginner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Journey with hover effects */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Learning Journey</h3>
            <div className="relative flex items-center justify-between px-4">
              {/* Progress line with gradient */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full" />
              
              {/* Steps */}
              {learningSteps.map((step, index) => (
                <div key={step.id} className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center z-10 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300">
                      <step.icon className="w-5 h-5 text-white/60 group-hover:text-blue-400" />
                    </div>
                    <div className="mt-3 text-sm font-medium text-white/60 group-hover:text-white">{step.name}</div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <p className="text-xs text-center text-white/60">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Best Comments */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiStar className="text-yellow-400" />
                Best Comments
              </h3>
              <div className="space-y-4">
                {bestComments.map(comment => (
                  <div 
                    key={comment.id} 
                    className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-blue-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                        />
                      ))}
                    </div>
                    <p className="text-white/80 mb-2 group-hover:text-white transition-colors">{comment.comment}</p>
                    <p className="text-sm text-white/40">- {comment.user}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Reviews */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiStar className="text-red-400" />
                Critical Reviews
              </h3>
              <div className="space-y-4">
                {criticalComments.map(comment => (
                  <div 
                    key={comment.id} 
                    className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-red-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < comment.rating ? 'text-red-400 fill-red-400' : 'text-white/20'}`}
                        />
                      ))}
                    </div>
                    <p className="text-white/80 mb-2 group-hover:text-white transition-colors">{comment.comment}</p>
                    <p className="text-sm text-white/40">- {comment.user}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons with better styling */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => onStartLearning(material.id)}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialPreviewModal 