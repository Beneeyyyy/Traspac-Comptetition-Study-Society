import { useState } from 'react'
import { FiImage, FiLink, FiSend } from 'react-icons/fi'

const CreatePost = () => {
  const [content, setContent] = useState('')

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <img 
          src="https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff"
          alt="Your avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask questions, or start a discussion..."
            className="w-full bg-transparent border-none text-white placeholder:text-white/40 resize-none focus:outline-none min-h-[100px]"
          />
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <FiImage className="text-lg" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <FiLink className="text-lg" />
              </button>
            </div>
            <button 
              className={\`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors \${
                content.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white/5 text-white/40 cursor-not-allowed'
              }\`}
              disabled={!content.trim()}
            >
              <FiSend />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost 