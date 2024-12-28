import { FiArrowUp, FiUsers, FiMessageSquare, FiBookmark, FiShare2, FiMoreHorizontal, FiChevronUp, FiChevronDown, FiImage, FiSend } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import AnswerCard from './AnswerCard'

const QuestionCard = ({ question, expandedQuestion, setExpandedQuestion }) => {
  return (
    <div className="group bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden transition-all hover:bg-white/[0.03]">
      {/* Question Card */}
      <div className="flex">
        {/* Vote Column */}
        <div className="py-6 px-4 flex flex-col items-center gap-2 border-r border-white/10 min-w-[80px]">
          <button className="p-2 rounded-lg hover:bg-blue-500/10 text-white/60 hover:text-blue-400 transition-all">
            <FiArrowUp className="text-xl" />
          </button>
          <span className="text-xl font-semibold text-white/90">
            {question.votes}
          </span>
          <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all rotate-180">
            <FiArrowUp className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={question.user.avatar}
              alt={question.user.name}
              className="w-10 h-10 rounded-full ring-1 ring-white/20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/90 hover:text-white cursor-pointer">{question.user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                  {question.user.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>{question.timeAgo}</span>
                <span>•</span>
                <span className="text-blue-400/80 hover:text-blue-400 cursor-pointer">{question.community}</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
                <FiBookmark className="text-lg" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
                <FiShare2 className="text-lg" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/90 transition-colors">
                <FiMoreHorizontal className="text-lg" />
              </button>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-3 mb-4">
            <h3 className="text-xl font-semibold text-white/90 hover:text-white cursor-pointer">
              {question.title}
            </h3>
            <p className="text-white/70 leading-relaxed">{question.content}</p>
          </div>

          {/* Tags & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-sm rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors cursor-pointer">
                <FiUsers className="text-lg" />
                <span>{question.views} dilihat</span>
              </div>
              <button 
                onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-blue-400 transition-colors group"
              >
                <FiMessageSquare className="text-lg group-hover:scale-110 transition-transform" />
                <span>{question.answers.length} jawaban</span>
                {expandedQuestion === question.id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>

          {/* Answer Form */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <textarea
                  placeholder="Tulis jawabanmu disini..."
                  rows={1}
                  className="w-full px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                />
              </div>
              <button 
                className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                title="Tambah gambar"
              >
                <FiImage className="text-xl" />
              </button>
              <button 
                className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                title="Kirim jawaban"
              >
                <FiSend className="text-xl" />
              </button>
            </div>
          </div>

          {/* Answers Section */}
          <AnimatePresence>
            {expandedQuestion === question.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="border-t border-white/10 mt-6">
                  {question.answers.map((answer, index) => (
                    <AnswerCard 
                      key={answer.id}
                      answer={answer}
                      isQuestioner={answer.user.name === question.user.name}
                      isLastAnswer={index === question.answers.length - 1}
                    />
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

export default QuestionCard 