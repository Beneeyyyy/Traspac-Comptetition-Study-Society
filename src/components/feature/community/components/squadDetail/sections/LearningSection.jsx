import { FiBook, FiPlay, FiAward, FiClock, FiChevronRight, FiTarget } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

const CircularProgress = ({ progress, size }) => {
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-800"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-500"
          strokeWidth="4"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-white">{progress}%</span>
      </div>
    </div>
  )
}

const LearningSection = ({ squad, isAdmin }) => {
  const { squadData } = useSquad()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Available Learning Paths */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiBook className="text-blue-400" />
              Learning Paths
            </h3>
          </div>

          <div className="space-y-4">
            {squadData.learningPaths && squadData.learningPaths.length > 0 ? (
              squadData.learningPaths.map((path) => (
                <div 
                  key={path.id}
                  className="bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/95 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
                >
                  {/* Learning Path Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-medium text-white truncate">{path.title}</h4>
                          <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {path.assignments?.length || 0} Tasks
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{path.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <CircularProgress progress={path.progress || 0} size={44} />
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FiTarget size={12} />
                          <span>Progress</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignments Section */}
                  {path.assignments && path.assignments.length > 0 && (
                    <div className="border-t border-gray-800/80">
                      <div className="px-5 py-3 border-b border-gray-800/80 flex items-center justify-between">
                        <h5 className="text-sm font-medium text-white flex items-center gap-2">
                          <FiPlay className="text-purple-400" size={16} />
                          Assignments
                        </h5>
                      </div>
                      <div className="divide-y divide-gray-800/50">
                        {path.assignments.map((assignment) => (
                          <div 
                            key={assignment.id}
                            className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors group/item cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                  <h6 className="text-white font-medium truncate">{assignment.title}</h6>
                                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                                    {assignment.points} pts
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <FiClock size={12} />
                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="text-xs text-gray-400 line-clamp-1 flex-1">
                                    {assignment.description}
                                  </div>
                                </div>
                              </div>
                              <div className="transform transition-transform group-hover/item:translate-x-0.5">
                                <FiChevronRight className="text-gray-600 group-hover/item:text-gray-400 transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No learning paths available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Achievements */}
        <div className="bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/95 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
          <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            {squadData.achievements && squadData.achievements.length > 0 ? (
              squadData.achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-gray-800/50 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FiAward className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium block truncate">{achievement.title}</span>
                    <span className="text-sm text-gray-400 line-clamp-1">{achievement.description}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No achievements available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningSection 