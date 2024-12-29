import { useState } from 'react'
import { FiMessageCircle, FiHeart, FiShare2, FiMoreHorizontal, FiSend, FiImage, FiPaperclip, FiUsers } from 'react-icons/fi'

const CommunitySection = ({ squad }) => {
  const [newPost, setNewPost] = useState('')

  // Mock data for discussions
  const discussions = [
    {
      id: 1,
      user: {
        name: "Sarah Anderson",
        role: "Squad Leader",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
      },
      content: "Hey everyone! 👋 I've just updated our React Advanced Patterns course with new content on Custom Hooks. Check it out and let me know your thoughts!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: true
    },
    {
      id: 2,
      user: {
        name: "Alex Chen",
        role: "Member",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
      },
      content: "Just completed the Node.js Basics module! The practical exercises were really helpful. Here's a tip for those starting: make sure to understand async/await thoroughly - it's crucial for the later sections.",
      timestamp: "5 hours ago",
      likes: 15,
      comments: 6,
      shares: 2,
      isLiked: false
    }
  ]

  // Mock data for active members
  const activeMembers = [
    {
      id: 1,
      name: "Sarah Anderson",
      role: "Squad Leader",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
      status: "online",
      xp: "2.5k"
    },
    {
      id: 2,
      name: "Alex Chen",
      role: "Top Contributor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
      status: "online",
      xp: "2.1k"
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Member",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
      status: "online",
      xp: "1.8k"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Discussions */}
      <div className="lg:col-span-2 space-y-8">
        {/* Create Post */}
        <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 p-4">
          <div className="flex items-start gap-4">
            <img 
              src={activeMembers[0].image}
              alt="Your profile"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with your squad..."
                className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none resize-none mb-4"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-all">
                    <FiImage className="text-blue-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-all">
                    <FiPaperclip className="text-purple-400" />
                  </button>
                </div>
                <button className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all flex items-center gap-2">
                  <FiSend />
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Discussions Feed */}
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id}
              className="bg-[#0A0A0A] rounded-xl border border-gray-800 p-4"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={discussion.user.image}
                    alt={discussion.user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-white font-medium">{discussion.user.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{discussion.user.role}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{discussion.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-800 transition-all">
                  <FiMoreHorizontal className="text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4">{discussion.content}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    discussion.isLiked
                      ? 'text-pink-400 bg-pink-500/10'
                      : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                  }`}
                >
                  <FiHeart />
                  <span>{discussion.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                  <FiMessageCircle />
                  <span>{discussion.comments}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                  <FiShare2 />
                  <span>{discussion.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Active Members */}
        <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Members</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-400">12 Online</span>
            </div>
          </div>
          <div className="space-y-4">
            {activeMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{member.name}</h4>
                    <span className="text-sm text-gray-400">{member.role}</span>
                  </div>
                </div>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg text-sm">
                  {member.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Stats */}
        <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Squad Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FiUsers className="text-blue-400" />
                </div>
                <span className="text-gray-400">Total Members</span>
              </div>
              <span className="text-white font-medium">1,250</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FiMessageCircle className="text-purple-400" />
                </div>
                <span className="text-gray-400">Active Discussions</span>
              </div>
              <span className="text-white font-medium">45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunitySection 