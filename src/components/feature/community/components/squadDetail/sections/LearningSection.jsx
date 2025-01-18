import React from 'react'
import { FiBook, FiClock, FiAward, FiLock } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

const LearningSection = () => {
  const { squadData } = useSquad()

  return (
    <div className="space-y-6">
      {/* Materials List */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Learning Materials</h2>
        
        {squadData.materials && squadData.materials.length > 0 ? (
          <div className="space-y-4">
            {squadData.materials.map((material, index) => (
              <div 
                key={material.id} 
                className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FiBook className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{material.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{material.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiClock className="text-sm" />
                          <span className="text-xs">{material.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiAward className="text-sm" />
                          <span className="text-xs">{material.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!material.isPublished && (
                    <div className="p-2">
                      <FiLock className="text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="text-2xl text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-medium">No Materials Yet</h3>
            <p className="text-gray-600 text-sm mt-1">Materials will appear here once added.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningSection 