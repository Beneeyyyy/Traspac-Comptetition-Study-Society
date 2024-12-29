import React from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiClock } from 'react-icons/fi'
import JoinSquadModal from './JoinSquadModal'

const SquadCard = ({ group }) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false)

  const handleJoinSquad = (squadId, message) => {
    // TODO: Implement join squad logic
    console.log('Joining squad:', squadId, 'with message:', message)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group bg-gradient-to-t from-blue-500/10 via-black/70 to-transparent rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
      >
        {/* Banner with Gradient Overlay */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={group.banner || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500"}
            alt={group.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Squad Name & Description */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate mb-1">
              {group.name}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {group.description || "Join our community to learn and grow together!"}
            </p>
          </div>
        </div>

        {/* Stats & Join Button */}
        <div className="p-4 pt-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiUsers className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{group.members}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Members</span>
            </div>
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiAward className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{group.xp || 0}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">XP</span>
            </div>
            <div className="bg-gray-500/5 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white-400 mb-0.5">
                <FiClock className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">
                  {group.createdAt ? new Date(group.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Created</span>
            </div>
          </div>

          {/* Join Button */}
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            Join Squad
          </button>
        </div>
      </motion.div>

      <JoinSquadModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        group={group}
        onJoin={handleJoinSquad}
      />
    </>
  )
}

export default SquadCard 