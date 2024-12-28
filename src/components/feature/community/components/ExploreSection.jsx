import { useState } from 'react'
import { FiUsers, FiBook, FiCalendar, FiMessageCircle, FiSearch, FiPlus, FiFilter, FiTrendingUp, FiClock, FiBookOpen, FiAward, FiStar } from 'react-icons/fi'
import { useCommunity } from '../context/CommunityContext'
import { motion } from 'framer-motion'
import iconCommunityBack from '../../../../assets/images/community/iconCommunityBack.svg'

const ExploreSection = () => {
  const { studyGroups, joinStudyGroup, leaveStudyGroup } = useCommunity()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All', icon: FiFilter },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'newest', label: 'Newest', icon: FiClock },
    { id: 'my-groups', label: 'My Groups', icon: FiBookOpen }
  ]

  const topCommunities = [
    {
      id: 1,
      name: "Web Development Masters",
      members: 1250,
      level: "Diamond",
      xp: 25000,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 2,
      name: "Data Science Hub",
      members: 980,
      level: "Platinum",
      xp: 18500,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 3,
      name: "UI/UX Design Club",
      members: 850,
      level: "Gold",
      xp: 15000,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?auto=format&fit=crop&q=80&w=500"
    }
  ]

  const filteredGroups = studyGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.topic.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getLevelColor = (level) => {
    switch (level) {
      case 'Diamond': return 'from-blue-400 to-cyan-400'
      case 'Platinum': return 'from-indigo-400 to-purple-400'
      case 'Gold': return 'from-yellow-400 to-orange-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      {/* Hero Section */}
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
                Join learning communities, earn XP, and level up your skills together
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto lg:mx-0">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search learning squads..."
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

      {/* Top Communities Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Simple Background Lines */}
        <div className="absolute inset-0">
          {/* Top Lines */}
          {/* Gold Lines */}
          <div className="absolute h-px w-1/3 bg-yellow-500/20 top-[20%] -rotate-12" />
          <div className="absolute h-px w-1/4 bg-yellow-500/20 top-[25%] left-[20%] rotate-12" />
          
          {/* Silver Lines */}
          <div className="absolute h-px w-1/3 bg-slate-400/20 top-[40%] left-[40%] -rotate-12" />
          <div className="absolute h-px w-1/4 bg-slate-400/20 top-[45%] left-[30%] rotate-12" />
          
          {/* Bronze Lines */}
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
        
        {/* Top 3 Grid with Smaller Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
          {topCommunities.map((community, index) => {
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

            return (
              <div 
                key={community.id} 
                className={`relative ${index === 0 ? 'md:-mt-16' : ''} ${index === 2 ? 'md:mt-16' : ''}`}
              >
                <div className="group relative">
                  <div className={`relative ${rankStyles[index].gradient} rounded-xl overflow-hidden border ${rankStyles[index].border}`}>
                    {/* Header with Community Name */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm font-medium ${rankStyles[index].text} mb-1`}>
                            Rank #{index + 1}
                          </div>
                          <h3 className="text-lg font-bold text-white">{community.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Community Image Section with Admin */}
                    <div className="px-4">
                      <div className="relative rounded-lg overflow-hidden">
                        {/* Community Background */}
                        <div className="aspect-[16/9] relative">
                          <img 
                            src={community.banner}
                            alt=""
                            className="w-full h-full object-cover brightness-[0.5]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        {/* Admin Image */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={community.image}
                              alt={community.name}
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
                            <span>{community.members}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiBook className="text-gray-400" />
                            <span>{community.topics?.length || 3} materials</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiStar className="text-gray-400" />
                            <span>{community.xp} XP</span>
                          </div>
                        </div>
                        <div className={`text-sm ${rankStyles[index].text}`}>
                          {community.level}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className="absolute h-px w-1/3 bg-yellow-500/20 left-[10%] -rotate-12" />
          <div className="absolute h-px w-1/4 bg-slate-400/20 left-[40%]" />
          <div className="absolute h-px w-1/3 bg-amber-600/20 right-[10%] rotate-12" />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-black text-gray-400 hover:text-white border border-gray-800 hover:border-indigo-500'
                }`}
              >
                <category.icon className={`text-lg ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-white'
                }`} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
          <button 
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <FiPlus className="text-lg" />
            <span>Create New Squad</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredGroups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative bg-[#0A0A0A] rounded-2xl p-1 transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20">
                <div className="relative bg-black rounded-xl overflow-hidden">
                  {/* Image Container */}
                  <div className="h-52">
                    <img 
                      src={group.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="relative p-6">
                    {/* Title Section */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10">
                            <span className="text-sm font-medium text-blue-400">Level {group.level || 1}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/5 border border-pink-500/10">
                            <FiAward className="text-pink-400" />
                            <span className="text-sm font-medium text-pink-400">Top Contributor</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center">
                            <FiUsers className="text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Members</div>
                            <div className="text-base font-semibold text-white">{group.members}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                            <FiBook className="text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Materials</div>
                            <div className="text-base font-semibold text-white">{group.topics?.length || 0}</div>
                          </div>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => group.isMember ? leaveStudyGroup(group.id) : joinStudyGroup(group.id)}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                          group.isMember
                            ? 'bg-black text-red-400 border border-red-500/20 hover:bg-red-500/5'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20'
                        }`}
                      >
                        {group.isMember ? 'Leave Squad' : 'Join Squad'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-16 bg-black rounded-xl border border-gray-800">
            <FiSearch className="text-indigo-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No squads found</h3>
            <p className="text-gray-400 mb-6">Try searching with different keywords or create a new squad</p>
            <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all">
              Create New Squad
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExploreSection 