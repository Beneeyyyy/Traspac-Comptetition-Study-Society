import { FiUsers, FiSearch } from 'react-icons/fi'
import iconCommunityBack from '../../../../../assets/images/community/iconCommunityBack.svg'

const HeroSection = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Community Mascot */}
          <div className="w-48 lg:w-72 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
            <img 
              src={iconCommunityBack} 
              alt="Community Mascot" 
              className="relative w-full h-full object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-4">
              <FiUsers className="text-lg" />
              <span>2.5K+ Active Learners</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Find Your Learning Squad!
            </h1>
            <p className="text-lg text-blue-300 max-w-2xl lg:max-w-none mx-auto lg:mx-0 mb-8">
              Join vibrant learning communities, earn XP, and level up your skills together
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search for learning squads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/80 text-white placeholder-gray-400 border-2 border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-0 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection 