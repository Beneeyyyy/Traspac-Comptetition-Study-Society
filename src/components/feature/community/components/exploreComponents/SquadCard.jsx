import React from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiClock } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import JoinSquadModal from './JoinSquadModal'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const SquadCard = ({ squad, layout = 'grid' }) => {
  const navigate = useNavigate()
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false)

  const handleJoinSquad = async () => {
    console.log('Attempting to join squad:', squad.id)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/squads/${squad.id}/join`,
        {},
        { withCredentials: true }
      )
      
      console.log('Join response:', response.data)
      toast.success('Successfully joined the squad!')
      return response.data
    } catch (error) {
      console.error('Error joining squad:', error)
      toast.error(error.response?.data?.error || 'Failed to join squad')
      throw error
    }
  }

  const handleCardClick = (e) => {
    // Prevent navigation when clicking join button
    if (e.target.closest('button')) return
    navigate(`/community/squad/${squad.id}`)
  }

  const openJoinModal = (e) => {
    e.stopPropagation() // Prevent card click
    console.log('Opening join modal for squad:', squad.id)
    setIsJoinModalOpen(true)
  }

  const closeJoinModal = () => {
    console.log('Closing join modal')
    setIsJoinModalOpen(false)
  }

  if (!squad) {
    return null
  }

  const defaultBanner = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500"

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group bg-gradient-to-t from-blue-500/10 via-black/70 to-transparent rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer ${
          layout === 'list' ? 'flex gap-6' : ''
        }`}
        onClick={handleCardClick}
      >
        {/* Banner with Gradient Overlay */}
        <div className={`relative ${layout === 'list' ? 'w-48' : 'h-40'} overflow-hidden`}>
          <img
            src={squad.banner || defaultBanner}
            alt={squad.name || 'Squad Banner'}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {layout === 'grid' && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate mb-1">
                {squad.name || 'Unnamed Squad'}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {squad.description || "Join our community to learn and grow together!"}
              </p>
            </div>
          )}
        </div>

        <div className={`${layout === 'list' ? 'flex-1 py-4 pr-4' : 'p-4 pt-3'}`}>
          {layout === 'list' && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                {squad.name || 'Unnamed Squad'}
              </h3>
              <p className="text-gray-400 text-sm">
                {squad.description || "Join our community to learn and grow together!"}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiUsers className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{squad.memberCount || 0}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Members</span>
            </div>
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiAward className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{squad._count?.materials || 0}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Materials</span>
            </div>
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiClock className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">
                  {squad.createdAt ? new Date(squad.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Created</span>
            </div>
          </div>

          {/* Join Button */}
          <button 
            onClick={openJoinModal}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            Join Squad
          </button>
        </div>
      </motion.div>

      {isJoinModalOpen && (
        <JoinSquadModal
          isOpen={isJoinModalOpen}
          onClose={closeJoinModal}
          squad={squad}
          onJoin={handleJoinSquad}
        />
      )}
    </>
  )
}

export default SquadCard 