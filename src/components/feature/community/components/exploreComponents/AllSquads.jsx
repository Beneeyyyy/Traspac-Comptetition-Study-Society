import React, { useState, useEffect } from 'react'
import { FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import SquadCard from './SquadCard'
import CreateSquadModal from './CreateSquadModal'
import { getSquads } from '../../../../../api/squad'
import { toast } from 'react-hot-toast'

const AllSquads = ({ studyGroups = [], onCreateSquad }) => {
  const [viewMode, setViewMode] = useState('grid')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [squads, setSquads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' or 'my-squads'
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSquads()
  }, [filter])

  const fetchSquads = async () => {
    try {
      setLoading(true)
      const params = {
        isMember: filter === 'my-squads'
      }
      const response = await getSquads(params)
      setSquads(response)
    } catch (error) {
      toast.error('Failed to load squads')
    } finally {
      setLoading(false)
    }
  }

  const handleSquadCreated = (newSquad) => {
    // Add new squad to list
    setSquads(prevSquads => [newSquad, ...prevSquads])
    // Close modal
    setIsCreateModalOpen(false)
    // Refresh squad list to get latest data
    fetchSquads()
  }

  // Handle squad update (after join/leave)
  const handleSquadUpdate = (updatedSquad) => {
    setSquads(prevSquads => 
      prevSquads.map(squad => 
        squad.id === updatedSquad.id ? updatedSquad : squad
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              <FiGrid className="text-lg" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              <FiList className="text-lg" />
            </button>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-white/90 transition-colors"
            >
              <span>{filter === 'my-squads' ? 'My Squads' : 'All Squads'}</span>
              <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50">
                <button
                  onClick={() => {
                    setFilter('all')
                    setIsDropdownOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/[0.05] rounded-t-lg transition-colors"
                >
                  All Squads
                </button>
                <button
                  onClick={() => {
                    setFilter('my-squads')
                    setIsDropdownOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/[0.05] rounded-b-lg transition-colors"
                >
                  My Squads
                </button>
              </div>
            )}
          </div>
        </div>

        {filter === 'all' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Squad
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && squads.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-white/90 mb-2">
            {filter === 'my-squads' ? 'No Squads Joined' : 'No Squads Found'}
          </h2>
          <p className="text-white/60 mb-6">
            {filter === 'my-squads' 
              ? "You haven't joined any squads yet." 
              : "No squads available at the moment."}
          </p>
          {filter === 'my-squads' && (
            <button 
              onClick={() => setFilter('all')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Explore Squads
            </button>
          )}
        </div>
      )}

      {/* Squads Grid/List */}
      {!loading && !error && squads.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {squads.map((squad) => (
            <SquadCard 
              key={squad.id} 
              squad={squad} 
              layout={viewMode}
              onUpdate={handleSquadUpdate}
            />
          ))}
        </div>
      )}

      {/* Create Squad Modal */}
      <CreateSquadModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSquadCreated={handleSquadCreated}
      />
    </div>
  )
}

export default AllSquads 