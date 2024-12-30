import { motion } from 'framer-motion'

function CircularProgress({ percentage, size = 280 }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative group">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
      
      {/* Main SVG containing circle and arrows */}
      <svg width={size + 400} height={size + 400} className="absolute -left-[200px] -top-[200px]">
        {/* Background circle */}
        <circle
          cx={size/2 + 200}
          cy={size/2 + 200}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.1)"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size/2 + 200}
          cy={size/2 + 200}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#gradient)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />

        {/* Arrows and Lines (visible on hover) */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {/* Connection Lines */}
          {[0, 90, 180, 270].map((angle, index) => (
            <g key={index} transform={`rotate(${angle} ${size/2 + 200} ${size/2 + 200})`}>
              <path 
                d={`M ${size/2 + 200} ${200} 
                    L ${size/2 + 200} ${160}
                    L ${size/2 + 160} ${120}
                    L ${size/2 + 200} ${80}`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <circle 
                cx={size/2 + 200} 
                cy={80} 
                r="4" 
                fill="#3B82F6" 
                className="animate-ping"
              />
              <circle 
                cx={size/2 + 200} 
                cy={80} 
                r="2" 
                fill="#60A5FA" 
              />
            </g>
          ))}
        </g>

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6">
              <animate attributeName="stop-color" values="#3B82F6; #8B5CF6; #3B82F6" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8B5CF6">
              <animate attributeName="stop-color" values="#8B5CF6; #3B82F6; #8B5CF6" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Content */}
      <div className="relative">
        <svg width={size} height={size}>
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{percentage}</span>
          <span className="text-sm text-white/60 mt-2">Overall Progress</span>
        </div>
      </div>

      {/* Hover Details */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ width: size + 400, height: size + 400, left: -200, top: -200 }}>
        {[
          { position: 'top', title: 'Ketuntasan Quiz', value: '85%', desc: 'Completed' },
          { position: 'right', title: 'Target Mingguan', value: '75%', desc: 'Progress' },
          { position: 'bottom', title: 'Penyelesaian Kursus', value: '65%', desc: 'Complete' },
          { position: 'left', title: 'Konsistensi Belajar', value: '90%', desc: 'Konsisten' }
        ].map((detail, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`absolute ${
              detail.position === 'top' ? 'top-0 left-1/2 -translate-x-1/2' :
              detail.position === 'right' ? 'right-0 top-1/2 -translate-y-1/2' :
              detail.position === 'bottom' ? 'bottom-0 left-1/2 -translate-x-1/2' :
              'left-0 top-[38%] -translate-y-1/2'
            }`}
          >
            <div className="px-4 py-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
              <p className="text-sm font-medium text-white/90">{detail.title}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-blue-400">{detail.value}</span>
                <span className="text-xs text-white/50">{detail.desc}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function OverviewTab({ userData }) {
  return (
    <div className="relative pt-20 pb-80">
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Recent Activity - Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">📊</span>
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {userData.recentActivities.map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-sm text-white/60">{activity.date}</span>
                </div>
                <p className="text-sm text-white/60">
                  {activity.type === 'course_completed' && '🎓 Completed Course'}
                  {activity.type === 'achievement_earned' && '🏆 Earned Achievement'}
                  {activity.type === 'joined_group' && '👥 Joined Study Group'}
                  {activity.points && ` • +${activity.points} points`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Centered Progress Circle - Middle Column */}
        <div className="flex justify-center py-8">
          <CircularProgress percentage={75} />
        </div>

        {/* Latest Achievements - Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">🏆</span>
            Achievements
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {userData.achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all hover:bg-white/[0.04] ${
                  achievement.earned
                    ? 'bg-white/[0.02] border-white/10'
                    : 'bg-white/[0.01] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{achievement.title}</h3>
                    <p className="text-sm text-white/60">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 