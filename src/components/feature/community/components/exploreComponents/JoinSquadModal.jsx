import React from 'react'
import { motion } from 'framer-motion'
import { FiX, FiUsers, FiAward, FiMessageCircle, FiShield, FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const JoinSquadModal = ({ isOpen, onClose, group, onJoin }) => {
  const [agreedToRules, setAgreedToRules] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreedToRules) return
    
    // Call the join function
    onJoin(group.id)
    
    // Close modal and navigate to squad details
    onClose()
    navigate(`/community/squad/${group.id}`)
  }

  // Dummy creator data (replace with actual data from group)
  const creator = {
    name: "Sarah Anderson",
    role: "Squad Creator",
    joinDate: "Oct 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500"
  }

  // Dummy rules (replace with actual rules from group)
  const rules = [
    "Be respectful and supportive to all squad members",
    "Actively participate in discussions and activities",
    "Share knowledge and help others learn",
    "No spam or self-promotion without permission",
    "Follow the study schedule and deadlines"
  ]

  if (!isOpen) return null

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
            src={group.banner}
            alt={group.name}
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
                src={creator.avatar} 
                alt={creator.name}
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
              {group.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-400 text-sm">Created by {creator.name}</p>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {creator.role}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-[#111] rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <FiUsers />
                <span className="text-lg font-semibold">{group.members}</span>
              </div>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div className="text-center bg-[#111] rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                <FiAward />
                <span className="text-lg font-semibold">{group.xp || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Squad XP</p>
            </div>
            <div className="text-center bg-[#111] rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <FiMessageCircle />
                <span className="text-lg font-semibold">24/7</span>
              </div>
              <p className="text-xs text-gray-500">Support</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-2">About Squad</h4>
            <p className="text-white text-sm">
              {group.description}
            </p>
          </div>

          {/* Squad Rules */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Squad Rules</h4>
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <FiCheck className="mt-1 text-emerald-400 shrink-0" />
                  <span className="text-gray-300">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rules Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1 rounded border-gray-700 bg-black text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-400">
                I agree to follow the squad rules and contribute positively to the community
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!agreedToRules}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                  ${agreedToRules 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Join Squad
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default JoinSquadModal 