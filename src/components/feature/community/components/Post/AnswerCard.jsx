import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp, FiHeart, FiShare2, FiMoreHorizontal, FiMessageSquare, FiSend } from 'react-icons/fi'

const AnswerCard = ({ answer, isQuestioner, isLastAnswer }) => {
  const [expandedComments, setExpandedComments] = useState(null)
  const [activeReplyId, setActiveReplyId] = useState(null)

  return (
    <div className={`group flex bg-white/[0.01] ${!isLastAnswer ? 'border-b border-white/10' : ''}`}>
      {/* Vote Column */}
      <div className="py-4 px-3 flex flex-col items-center gap-1.5 border-r border-white/10 min-w-[60px]">
        <button className="p-1.5 rounded-md hover:bg-blue-500/10 text-white/60 hover:text-blue-400 transition-colors">
          <FiArrowUp className="text-base" />
        </button>
        <span className="text-base font-medium text-white/80">
          {answer.votes}
        </span>
        <button className="p-1.5 rounded-md hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors rotate-180">
          <FiArrowUp className="text-base" />
        </button>
      </div>

      {/* Answer Content */}
      <div className={`flex-1 p-4 ${isQuestioner ? 'bg-blue-500/5' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          <img
            src={answer.user.avatar}
            alt={answer.user.name}
            className="w-8 h-8 rounded-full ring-1 ring-white/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white/80 hover:text-white cursor-pointer">
                {answer.user.name}
              </span>
              {isQuestioner && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                  Penanya
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400/80 font-medium">
                {answer.user.badge}
              </span>
            </div>
            <span className="text-sm text-white/40">{answer.timeAgo}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
              <FiHeart className="text-base" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
              <FiShare2 className="text-base" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
              <FiMoreHorizontal className="text-base" />
            </button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="pl-11">
          <p className="text-sm text-white/70 leading-relaxed">{answer.content}</p>
          
          <div className="mt-4 flex items-center gap-4">
            {/* Inline Comment Form */}
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tambahkan komentar..."
                  className="w-full py-1.5 pl-3 pr-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                  title="Kirim komentar"
                >
                  <FiSend className="text-sm" />
                </button>
              </div>
            </div>

            <button 
              onClick={() => setExpandedComments(expandedComments === answer.id ? null : answer.id)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              <FiMessageSquare className="text-base" />
              <span>{answer.comments?.length || 0} komentar</span>
            </button>
          </div>
          
          {/* Comments Section - Only show when expanded */}
          <AnimatePresence>
            {expandedComments === answer.id && answer.comments && answer.comments.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <div className="space-y-4 pl-4 border-l border-white/10">
                  {answer.comments.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-6 h-6 rounded-full ring-1 ring-white/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white/80 text-sm hover:text-white cursor-pointer">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-white/40">{comment.timeAgo}</span>
                          </div>
                          <p className="text-sm text-white/70">{comment.content}</p>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors">
                              <FiHeart className="text-sm" />
                              <span>{comment.likes}</span>
                            </button>
                            <button 
                              onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                              className="text-xs text-white/40 hover:text-white/60 transition-colors"
                            >
                              Balas
                            </button>
                          </div>

                          {/* Reply Form - Only show when activeReplyId matches */}
                          {activeReplyId === comment.id && (
                            <div className="mt-3 flex items-center gap-3">
                              <img
                                src="https://ui-avatars.com/api/?name=You"
                                alt="Your avatar"
                                className="w-6 h-6 rounded-full ring-1 ring-white/20"
                              />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  placeholder="Balas komentar..."
                                  className="w-full py-2 pl-3 pr-10 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                                />
                                <button 
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                                  title="Kirim balasan"
                                >
                                  <FiSend className="text-base" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard 