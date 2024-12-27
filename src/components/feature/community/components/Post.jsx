import { motion } from 'framer-motion'
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi'

const Post = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
          <button className={\`flex items-center gap-2 text-sm \${post.isLiked ? 'text-red-400' : 'text-white/40 hover:text-white'}\`}>
            <FiHeart className={post.isLiked ? 'fill-current' : ''} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white">
            <FiMessageCircle />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white">
            <FiShare2 />
            <span>{post.shares}</span>
          </button>
        </div>
        <button className={\`text-sm \${post.isBookmarked ? 'text-blue-400' : 'text-white/40 hover:text-white'}\`}>
          <FiBookmark className={post.isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>
    </motion.div>
  )
}

export default Post 