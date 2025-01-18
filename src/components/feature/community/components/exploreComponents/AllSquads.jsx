import React, { useState } from 'react'
import { FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import SquadCard from './SquadCard'
import CreateSquadModal from './CreateSquadModal'

const AllSquads = ({ studyGroups = [], onCreateSquad }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* View Toggle, Dropdown & Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Mode Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiList />
            </button>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Explore
              <FiChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/community')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    All Squads
                  </button>
                  <button
                    onClick={() => {
                      navigate('/community/my-squads')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    My Squads
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Create Squad
        </button>
      </div>

      {/* Squads Grid/List */}
      {studyGroups && studyGroups.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {studyGroups.map((squad) => (
            <SquadCard 
              key={squad.id} 
              squad={squad} 
              layout={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No squads found</p>
        </div>
      )}

      {/* Create Squad Modal */}
      <CreateSquadModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSquadCreated={(newSquad) => {
          onCreateSquad(newSquad)
          setIsCreateModalOpen(false)
        }}
      />
    </div>
  )
}

export default AllSquads 