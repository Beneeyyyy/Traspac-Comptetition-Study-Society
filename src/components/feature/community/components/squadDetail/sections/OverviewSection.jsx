import { FiUsers, FiTarget, FiCalendar, FiAward, FiTrendingUp, FiInfo, FiBook, FiFlag, FiStar } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

function CircularProgress({ percentage, size = 120, label, sublabel }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.1)"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#gradient)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-sm text-white/60">{label}</span>
        {sublabel && <span className="text-xs text-white/40">{sublabel}</span>}
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

const OverviewSection = ({ squad }) => {
  const { squadData } = useSquad()

  const stats = [
    { 
      icon: FiUsers, 
      label: "Total Members", 
      value: `${squadData.memberCount || 0} Members`, 
      color: "text-blue-400" 
    },
    { 
      icon: FiBook, 
      label: "Materials", 
      value: `${squadData._count?.materials || 0} Materials`, 
      color: "text-purple-400" 
    },
    { 
      icon: FiStar, 
      label: "Discussions", 
      value: `${squadData._count?.discussions || 0}`, 
      color: "text-amber-400" 
    },
    { 
      icon: FiCalendar, 
      label: "Created", 
      value: squadData.createdAt ? new Date(squadData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-', 
      color: "text-emerald-400" 
    }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Circles - Hide for now since we don't have real data */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] rounded-xl p-6 flex flex-col items-center">
          <CircularProgress 
            percentage={squadData.progress || 0} 
            label="Course Progress"
            sublabel={`${squadData.completedMaterials || 0}/${squadData.totalMaterials || 0} Completed`}
          />
        </div>
      </div> */}

      {/* About Squad */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">About Squad</h2>
        <p className="text-gray-400">
          {squadData.description || "No description available."}
        </p>
      </div>

      {/* Squad Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Squad Rules - Hide for now since we don't have real data */}
      {/* <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Rules</h2>
        {squadData.rules && squadData.rules.length > 0 ? (
          <ul className="space-y-3 text-gray-400">
            {squadData.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No rules have been set.</p>
        )}
      </div> */}

      {/* Squad Leaders */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squadData.members?.filter(member => member.role === 'admin').map((leader, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={leader.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.user.name)}&background=6366F1&color=fff`}
                alt={leader.user.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-white">{leader.user.name}</h3>
                <p className="text-sm text-gray-400">{leader.role}</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-400">No leaders assigned.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverviewSection 