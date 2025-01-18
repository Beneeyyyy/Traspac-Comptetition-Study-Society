import React, { useState } from 'react'
import { FiMessageSquare, FiPlus } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

const DiscussionSection = () => {
  const { squadData } = useSquad()
  const [showNewDiscussion, setShowNewDiscussion] = useState(false)

  return (
    <div className="space-y-6">
      {/* Discussions List */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Discussions</h2>
          <button
            onClick={() => setShowNewDiscussion(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiPlus size={16} />
            <span>New Discussion</span>
          </button>
        </div>

        {squadData.discussions && squadData.discussions.length > 0 ? (
          <div className="space-y-4">
            {squadData.discussions.map((discussion) => (
              <div 
                key={discussion.id}
                className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={discussion.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.user.name)}&background=6366F1&color=fff`}
                    alt={discussion.user.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-x-2">
                      <div>
                        <h3 className="font-medium text-white">{discussion.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{discussion.content}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiMessageSquare className="text-sm" />
                        <span className="text-xs">{discussion._count.replies}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-xs text-gray-500">
                        By {discussion.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMessageSquare className="text-2xl text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-medium">No Discussions Yet</h3>
            <p className="text-gray-600 text-sm mt-1">Start a discussion to get the conversation going.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionSection 