import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { joinSquad } from '../../../../../api/squad'

const SquadCard = ({ squad, layout = 'grid' }) => {
  const navigate = useNavigate()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinSquad = async (e) => {
    e.stopPropagation() // Prevent navigation when clicking join button
    try {
      setIsJoining(true)
      await joinSquad(squad.id)
      toast.success('Successfully joined squad!')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join squad')
    } finally {
      setIsJoining(false)
    }
  }

  const handleViewDetail = () => {
    navigate(`/community/squad/${squad.id}`)
  }

  if (layout === 'grid') {
    return (
      <div className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all">
        <div className="relative h-40">
          <img
            src={squad.banner || '/default-banner.jpg'}
            alt={squad.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{squad.name}</h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-2">{squad.description}</p>

          <div className="flex items-center justify-between text-sm text-white/40 mb-4">
            <div>{squad.memberCount} members</div>
            <div>{squad.materialsCount} materials</div>
          </div>

          {squad.isMember ? (
            <button
              onClick={handleViewDetail}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Kunjungi Squad
            </button>
          ) : (
            <button
              onClick={handleJoinSquad}
              disabled={isJoining}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isJoining ? 'Joining...' : 'Join Squad'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // List layout
  return (
    <div className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all">
      <div className="flex items-center gap-6 p-4">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={squad.banner || '/default-banner.jpg'}
            alt={squad.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-xl font-semibold text-white mb-2">{squad.name}</h3>
          <p className="text-white/60 text-sm mb-2 line-clamp-2">{squad.description}</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <div>{squad.memberCount} members</div>
            <div>{squad.materialsCount} materials</div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {squad.isMember ? (
            <button
              onClick={handleViewDetail}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Kunjungi Squad
            </button>
          ) : (
            <button
              onClick={handleJoinSquad}
              disabled={isJoining}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isJoining ? 'Joining...' : 'Join Squad'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SquadCard 