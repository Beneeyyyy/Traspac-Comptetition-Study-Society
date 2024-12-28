import { FiBook, FiUsers, FiBarChart, FiMessageSquare, FiAward } from 'react-icons/fi'

function HeroSection({ 
  type = 'courses', // 'courses' or 'community'
  icon,
  stats,
  activeFilter,
  setActiveFilter,
  showFilters = false,
  className = '',
  onExploreClick
}) {
  const content = {
    courses: {
      badge: '300+ Active Students',
      title: {
        gradient: 'Master New Skills',
        white: 'Through Practice'
      },
      description: 'Explore our curated learning paths and start your journey to mastery through interactive lessons and hands-on projects.'
    },
    community: {
      badge: '50+ Komunitas Aktif',
      title: {
        gradient: 'Temukan Komunitas',
        white: 'Belajarmu'
      },
      description: 'Bergabung dengan komunitas pembelajaran yang sesuai dengan minatmu. Diskusi, berbagi pengetahuan, dan tingkatkan skillmu bersama.'
    }
  }

  const currentContent = content[type]

  return (
    <section className={`pt-40 ${className}`}>
      <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-400">{currentContent.badge}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  {currentContent.title.gradient}
                </span>
                <br />
                <span className="text-white">{currentContent.title.white}</span>
              </h1>
              
              <p className="text-lg text-white/60 max-w-xl">
                {currentContent.description}
              </p>

              {showFilters ? (
                <div className="flex flex-wrap items-center gap-3">
                  {['all', 'popular', 'new', 'trending'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={type === 'community' ? onExploreClick : undefined}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                  >
                    {type === 'community' ? 'Jelajahi Komunitas' : 'Explore Courses'}
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/[0.08] transition-all">
                    {type === 'community' ? 'Buat Komunitas' : 'Create Course'}
                  </button>
                </div>
              )}
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <stat.icon className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/40">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-5">
            <div className="relative max-w-[400px] mx-auto">
              <div className="relative bg-white rounded-3xl p-6 aspect-square shadow-2xl shadow-white/40">
                <img 
                  src={icon}
                  alt={`${type === 'community' ? 'Community' : 'Learning'} Illustration`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 