import React from 'react'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import SquadCard from './SquadCard'
import CreateSquadModal from './CreateSquadModal'

const AllSquads = ({ studyGroups, selectedSort, setSelectedSort, sortOptions, onCreateSquad }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const handleCreateSquad = (squadData) => {
    onCreateSquad(squadData)
    setIsCreateModalOpen(false)
  }

  const handleOpenModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 mt-16">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="border-b border-gray-800 flex-1">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={`py-4 px-2 text-sm font-medium whitespace-nowrap transition-all relative
                    ${selectedSort === option.id 
                      ? 'text-blue-500' 
                      : 'text-gray-400 hover:text-gray-300'
                    }`}
                >
                  {option.label}
                  {selectedSort === option.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleOpenModal}
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiPlus size={16} />
            <span>Create Squad</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroups.map((group) => (
            <SquadCard key={group.id} group={group} />
          ))}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateSquadModal 
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateSquad}
        />
      )}
    </div>
  )
}

export default AllSquads 