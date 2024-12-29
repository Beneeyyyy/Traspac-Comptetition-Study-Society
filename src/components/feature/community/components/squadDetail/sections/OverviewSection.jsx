import { FiUsers, FiTarget, FiCalendar, FiAward, FiTrendingUp, FiInfo, FiBook, FiFlag, FiStar, FiSettings } from 'react-icons/fi'
import { useState } from 'react'


const CircularProgress = ({ progress, size = 36, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-500 transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-medium text-white">{progress}%</span>
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-gray-800">
    <div className={`p-1.5 rounded-lg ${color}/10`}>
      <Icon className={`text-base ${color}`} />
    </div>
    <div>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-xs font-medium text-white">{value}</p>
    </div>
  </div>
)

const OverviewSection = ({ squad, isAdmin }) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  
  const squadDetails = {
    description: "A collaborative learning community focused on web development. We learn together, share knowledge, and help each other grow through practical projects and active discussions.",
    stats: [
      { icon: FiUsers, label: "Total Members", value: "24 Members", color: "text-blue-400" },
      { icon: FiBook, label: "Active Courses", value: "8 Courses", color: "text-purple-400" },
      { icon: FiStar, label: "Completion Rate", value: "85%", color: "text-amber-400" },
      { icon: FiCalendar, label: "Founded", value: "Jan 2024", color: "text-emerald-400" }
    ]
  }

  return (
    <div className="space-y-6">
      {/* About Squad */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">About Squad</h2>
        <p className="text-gray-400">
          {squad?.description || squadDetails.description}
        </p>
      </div>

      {/* Squad Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {squadDetails.stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Squad Leaders */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example Leader */}
          <div className="flex items-center gap-4">
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff"
              alt="Squad Leader"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-white">John Doe</h3>
              <p className="text-sm text-gray-400">Squad Leader</p>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Rules */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Rules</h2>
        <ul className="space-y-3 text-gray-400">
          <li>Be respectful to all members</li>
          <li>Share knowledge and help others</li>
          <li>Stay active and participate in discussions</li>
          <li>Complete assigned tasks on time</li>
        </ul>
      </div>
    </div>
  )
}

export default OverviewSection 