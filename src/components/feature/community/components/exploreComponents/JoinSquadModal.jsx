import React from 'react'
import { motion } from 'framer-motion'
import { FiX, FiUsers, FiAward, FiMessageCircle, FiShield, FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const JoinSquadModal = ({ isOpen, onClose, squad, onJoin }) => {
  const [agreedToRules, setAgreedToRules] = React.useState(false)
  const [isJoining, setIsJoining] = React.useState(false)
  const navigate = useNavigate()

  // Return null if squad is undefined or modal is not open
  if (!isOpen || !squad) {
    console.log('Modal not showing because:', { isOpen, hasSquad: !!squad })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreedToRules) {
      console.log('Cannot join: rules not agreed to')
      return
    }
    
    try {
      setIsJoining(true)
      console.log('Submitting join request for squad:', squad.id)
      
      // Call the join function and wait for it to complete
      await onJoin()
      
      // Close modal and navigate to squad detail
      onClose()
      console.log('Navigating to:', `/community/squad/${squad.id}`)
      navigate(`/community/squad/${squad.id}`)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    } finally {
      setIsJoining(false)
    }
  }

  // Find admin member
  const creator = squad.members?.find(member => member.role === 'admin')

  // Default rules if none provided
  const rules = [
    "Be respectful and supportive to all squad members",
    "Actively participate in discussions and activities",
    "Share knowledge and help others learn",
    "No spam or self-promotion without permission",
    "Follow the study schedule and deadlines"
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-black rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Banner */}
        <div className="relative h-40">
          <img
            src={squad.banner || 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Banner'}
            alt={squad.name || 'Squad Banner'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/20 text-white/80 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>

          {/* Creator Info */}
          <div className="absolute -bottom-10 inset-x-0 flex justify-center">
            <div className="relative">
              <img 
                src={creator?.user?.image || 'https://placehold.co/200/1a1a1a/ffffff?text=?'} 
                alt={creator?.user?.name || 'Squad Creator'}
                className="w-20 h-20 rounded-full object-cover border-4 border-black"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                <FiShield size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Squad Name & Creator Info */}
          <div className="text-center mb-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">
              {squad.name || 'Unnamed Squad'}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-400 text-sm">
                Created by {creator?.user?.name || 'Unknown'}
              </p>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Squad Creator
              </span>
            </div>
          </div>

          {/* Squad Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white mb-1">
                <FiUsers className="w-4 h-4" />
                <span className="font-medium">{squad.memberCount || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white mb-1">
                <FiAward className="w-4 h-4" />
                <span className="font-medium">{squad._count?.materials || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Materials</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white mb-1">
                <FiMessageCircle className="w-4 h-4" />
                <span className="font-medium">{squad._count?.discussions || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Discussions</p>
            </div>
          </div>

          {/* Squad Rules */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4">Squad Rules</h4>
            <ul className="space-y-3">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <div className="mt-1">
                    <FiCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-gray-400 flex-1">{rule}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Agreement & Join Button */}
          <form onSubmit={handleSubmit}>
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-400">
                I agree to follow the squad rules and contribute positively to the community
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreedToRules || isJoining}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-500 text-white py-3 rounded-lg font-medium transition-all duration-300"
            >
              {isJoining ? 'Joining...' : 'Join Squad'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default JoinSquadModal 