import { FiUsers, FiBook, FiAward, FiStar } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const TopSquads = ({ squads = [] }) => {
  const navigate = useNavigate()

  const rankStyles = {
    0: {
      gradient: "bg-gradient-to-br from-black via-black to-yellow-500/10",
      text: "text-yellow-500",
      border: "border-yellow-500/10",
      ring: "ring-yellow-500"
    },
    1: {
      gradient: "bg-gradient-to-br from-black via-black to-slate-400/10",
      text: "text-slate-300",
      border: "border-slate-400/10",
      ring: "ring-slate-300"
    },
    2: {
      gradient: "bg-gradient-to-br from-black via-black to-amber-600/10",
      text: "text-amber-600",
      border: "border-amber-600/10",
      ring: "ring-amber-600"
    }
  }

  const handleSquadClick = (squadId) => {
    navigate(`/community/squad/${squadId}`)
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Background Lines */}
      <div className="absolute inset-0">
        {/* Top Lines */}
        <div className="absolute h-px w-1/3 bg-yellow-500/20 top-[20%] -rotate-12" />
        <div className="absolute h-px w-1/4 bg-yellow-500/20 top-[25%] left-[20%] rotate-12" />
        <div className="absolute h-px w-1/3 bg-slate-400/20 top-[40%] left-[40%] -rotate-12" />
        <div className="absolute h-px w-1/4 bg-slate-400/20 top-[45%] left-[30%] rotate-12" />
        <div className="absolute h-px w-1/3 bg-amber-600/20 top-[60%] left-[50%] -rotate-12" />
        <div className="absolute h-px w-1/4 bg-amber-600/20 top-[65%] left-[40%] rotate-12" />
      </div>

      {/* Section Header */}
      <div className="relative flex items-center mb-12">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-sm" />
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/80 to-amber-500/80 rounded-2xl rotate-[10deg] relative">
              <div className="absolute inset-[1px] bg-black rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FiAward className="text-yellow-500/90 text-3xl" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-yellow-500/90 tracking-tight">
              Top Squads
            </h2>
            <p className="text-gray-400 mt-1">Best performing communities this week</p>
          </div>
        </div>
      </div>

      {/* Top 3 Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
        {squads.map((squad, index) => (
          <div 
            key={squad.id} 
            className={`relative ${index === 0 ? 'md:-mt-16' : ''} ${index === 2 ? 'md:mt-16' : ''}`}
            onClick={() => handleSquadClick(squad.id)}
          >
            <div className="group relative cursor-pointer">
              <div className={`relative ${rankStyles[index].gradient} rounded-xl overflow-hidden border ${rankStyles[index].border}`}>
                {/* Header with Squad Name */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-medium ${rankStyles[index].text} mb-1`}>
                        Rank #{index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-white">{squad.name || 'Unnamed Squad'}</h3>
                    </div>
                  </div>
                </div>

                {/* Squad Image Section */}
                <div className="px-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="aspect-[16/9] relative">
                      <img 
                        src={squad.banner || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500"}
                        alt=""
                        className="w-full h-full object-cover brightness-[0.5]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img 
                          src={squad.image || "https://via.placeholder.com/160"}
                          alt={squad.name || 'Squad Image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats & Level */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiUsers className="text-gray-400" />
                        <span>{squad.memberCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiBook className="text-gray-400" />
                        <span>{squad._count?.materials || 0} materials</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiStar className="text-gray-400" />
                        <span>{squad._count?.discussions || 0} discussions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="absolute h-px w-1/3 bg-yellow-500/20 left-[10%] -rotate-12" />
        <div className="absolute h-px w-1/4 bg-slate-400/20 left-[40%]" />
        <div className="absolute h-px w-1/3 bg-amber-600/20 right-[10%] rotate-12" />
      </div>
    </div>
  )
}

export default TopSquads 