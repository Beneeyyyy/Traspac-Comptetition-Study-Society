import { FiMessageSquare, FiBookOpen, FiClock, FiImage, FiSend, FiHeart, FiShare2, FiMoreHorizontal } from 'react-icons/fi'
import { useState } from 'react'

const DiscussionSection = ({ squad, currentUser }) => {
  const [newPost, setNewPost] = useState('')

  // Mock data for discussions and user activities
  const mockData = {
    currentUser: {
      name: currentUser?.name || "You",
      image: currentUser?.image || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
      role: currentUser?.role || "Member"
    },
    discussions: [
      {
        id: 1,
        author: {
          name: "John Smith",
          image: "https://ui-avatars.com/api/?name=John+Smith&background=6366F1&color=fff",
          role: "Member",
          badge: "Top Contributor"
        },
        content: "Has anyone completed the React Hooks module? I'd love to discuss some best practices for useEffect, especially around dependency arrays and cleanup functions.",
        timestamp: "2 hours ago",
        likes: 12,
        replies: 5,
        isLiked: true,
        attachments: []
      },
      {
        id: 2,
        author: {
          name: "Emily Chen",
          image: "https://ui-avatars.com/api/?name=Emily+Chen&background=8B5CF6&color=fff",
          role: "Member",
          badge: "Active Learner"
        },
        content: "Just finished the TypeScript basics course. The section about generics was particularly helpful! Here's a code snippet I found useful:",
        timestamp: "5 hours ago",
        likes: 8,
        replies: 3,
        isLiked: false,
        attachments: [
          {
            type: "code",
            content: "function identity<T>(arg: T): T {\n  return arg;\n}"
          }
        ]
      },
      {
        id: 3,
        author: {
          name: "Mike Johnson",
          image: "https://ui-avatars.com/api/?name=Mike+Johnson&background=EC4899&color=fff",
          role: "Member"
        },
        content: "Working on the final project for the Node.js API module. Would love some feedback on my code structure and error handling approach.",
        timestamp: "1 day ago",
        likes: 15,
        replies: 8,
        isLiked: false,
        attachments: []
      }
    ],
    userActivities: [
      {
        id: 1,
        user: {
          name: "Miranda Lee",
          image: "https://ui-avatars.com/api/?name=Miranda+Lee&background=6366F1&color=fff"
        },
        activity: "Learning React Advanced Patterns",
        progress: 45,
        lastActive: "10 minutes ago"
      },
      {
        id: 2,
        user: {
          name: "David Kim",
          image: "https://ui-avatars.com/api/?name=David+Kim&background=8B5CF6&color=fff"
        },
        activity: "Studying TypeScript Fundamentals",
        progress: 75,
        lastActive: "30 minutes ago"
      },
      {
        id: 3,
        user: {
          name: "Sarah Wilson",
          image: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=EC4899&color=fff"
        },
        activity: "Working on Node.js Basics",
        progress: 60,
        lastActive: "1 hour ago"
      }
    ]
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Discussion Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Discussion Form */}
        <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-start gap-4">
            <img 
              src={mockData.currentUser.image}
              alt="Your profile"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-800"
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
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors group">
                    <FiImage className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors group">
                    <FiBookOpen className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                </div>
                <button 
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    newPost.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!newPost.trim()}
                  onClick={() => {
                    if (newPost.trim()) {
                      // Handle post submission here
                      setNewPost('')
                    }
                  }}
                >
                  <FiSend />
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion List */}
        <div className="space-y-4">
          {mockData.discussions.map((discussion) => (
            <div key={discussion.id} className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-start gap-3">
                <img 
                  src={discussion.author.image} 
                  alt={discussion.author.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-800"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{discussion.author.name}</span>
                        {discussion.author.badge && (
                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
                            {discussion.author.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{discussion.timestamp}</div>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-gray-800 transition-colors">
                      <FiMoreHorizontal className="text-gray-400" />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-3 whitespace-pre-wrap">{discussion.content}</p>
                  
                  {/* Attachments */}
                  {discussion.attachments.map((attachment, index) => (
                    <div key={index} className="mb-3 p-3 rounded-lg bg-gray-800/50 font-mono text-sm text-gray-300 overflow-x-auto">
                      {attachment.content}
                    </div>
                  ))}

                  <div className="flex items-center gap-4">
                    <button 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                        discussion.isLiked
                          ? 'text-pink-400 bg-pink-500/10'
                          : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                      }`}
                    >
                      <FiHeart className={discussion.isLiked ? 'fill-current' : ''} />
                      <span>{discussion.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                      <FiMessageSquare />
                      <span>{discussion.replies}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Activities */}
      <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 h-fit transform hover:scale-[1.01] transition-all duration-300">
        <h3 className="text-lg font-bold text-white mb-4">Member Activities</h3>
        <div className="space-y-4">
          {mockData.userActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
              <img 
                src={activity.user.image} 
                alt={activity.user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-800"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{activity.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <FiBookOpen className="text-blue-400" />
                  <span>{activity.activity}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${activity.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FiClock />
                  <span>Active {activity.lastActive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiscussionSection 