import { FiUsers, FiTarget, FiCalendar, FiAward, FiTrendingUp, FiInfo, FiBook, FiFlag, FiStar } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

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
    { icon: FiUsers, label: "Total Members", value: "24 Members", color: "text-blue-400" },
    { icon: FiBook, label: "Active Courses", value: "8 Courses", color: "text-purple-400" },
    { icon: FiStar, label: "Completion Rate", value: "85%", color: "text-amber-400" },
    { icon: FiCalendar, label: "Founded", value: "Jan 2024", color: "text-emerald-400" }
  ]

  return (
    <div className="space-y-6">
      {/* About Squad */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">About Squad</h2>
        <p className="text-gray-400">
          {squadData.about || "No description available."}
        </p>
      </div>

      {/* Squad Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Squad Rules */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
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
      </div>

      {/* Squad Leaders */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squadData.leaders && squadData.leaders.length > 0 ? (
            squadData.leaders.map((leader, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={leader.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=6366F1&color=fff`}
                  alt={leader.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-white">{leader.name}</h3>
                  <p className="text-sm text-gray-400">{leader.role}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No leaders assigned.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverviewSection 