import { FiBook, FiUsers, FiBarChart } from 'react-icons/fi'
import iconCourse1 from '../../../../assets/images/courses/iconCourse1.svg'

function HeroSection({ categories, activeFilter, setActiveFilter }) {
  const stats = [
    { icon: FiBook, value: categories.length, label: 'Learning Paths' },
    { icon: FiUsers, value: '2.5k+', label: 'Active Learners' },
    { icon: FiBarChart, value: '94%', label: 'Success Rate' }
  ]

  // Hero Stats Component
  function HeroStats() {
    return (
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
  )
}

  return (
    <section className="pt-40">
      <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-400">300+ Active Students</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Master New Skills
                </span>
                <br />
                <span className="text-white">Through Practice</span>
              </h1>
              
              <p className="text-lg text-white/60 max-w-xl">
                Explore our curated learning paths and start your journey to mastery through interactive lessons and hands-on projects.
              </p>

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
            </div>

            {/* Hero Stats */}
            <HeroStats />
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-5 ">
            <div className="relative max-w-[400px] mx-auto">
              <div className="relative bg-white rounded-3xl p-6 aspect-square shadow-2xl shadow-white/40">
                <img 
                  src={iconCourse1}
                  alt="Learning Illustration"
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