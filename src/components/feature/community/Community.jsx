import { useState } from 'react'
import { FiTrendingUp, FiMessageSquare, FiUsers, FiSearch, FiFilter } from 'react-icons/fi'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'

const Community = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
        badge: 'Top Contributor'
      },
      content: 'Just completed the Advanced React course! The new Hooks patterns are game-changing. Anyone else exploring them?',
      topic: 'React',
      likes: 234,
      comments: 45,
      shares: 12,
      timeAgo: '2 hours ago',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      user: {
        name: 'Sarah Chen',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0D8ABC&color=fff',
        badge: 'Course Creator'
      },
      content: 'Working on a new tutorial series about TypeScript and Next.js. What specific topics would you like to see covered?',
      topic: 'TypeScript',
      likes: 189,
      comments: 56,
      shares: 23,
      timeAgo: '4 hours ago',
      isLiked: true,
      isBookmarked: true
    }
  ])

  const tabs = [
    { id: 'trending', icon: FiTrendingUp, label: 'Trending' },
    { id: 'latest', icon: FiMessageSquare, label: 'Latest' },
    { id: 'following', icon: FiUsers, label: 'Following' }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="relative flex-1">
        {/* Top Gradient */}
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        </div>

        {/* Content Wrapper */}
        <div className="relative w-full">
          <section className="py-12 pt-20">
            <div className="container max-w-screen-xl mx-auto px-6">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Community</h1>
                <p className="text-lg text-white/60 max-w-2xl">Connect with fellow learners, share your progress, and join discussions about various topics.</p>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors">
                  <FiFilter />
                  <span>Filters</span>
                </button>
              </div>

              {/* Create Post */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts, ask questions, or start a discussion..."
                      className="w-full bg-transparent border-none text-white placeholder:text-white/40 resize-none focus:outline-none min-h-[100px]"
                    />
                    <div className="flex items-center justify-end pt-4 border-t border-white/5">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <tab.icon className="text-lg" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Posts Grid */}
              <div className="space-y-6">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.user.avatar} 
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{post.user.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                              {post.user.badge}
                            </span>
                          </div>
                          <p className="text-sm text-white/40">{post.timeAgo}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">
                        {post.topic}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-white/80 mb-6">{post.content}</p>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-6">
                        <button className={`flex items-center gap-2 text-sm ${post.isLiked ? 'text-red-400' : 'text-white/40 hover:text-white'}`}>
                          <span>{post.likes} Likes</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white">
                          <span>{post.comments} Comments</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white">
                          <span>{post.shares} Shares</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Community 