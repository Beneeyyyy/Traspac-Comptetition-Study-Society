import { motion } from 'framer-motion'

export default function OtherTopLearners({ displayLearners, activeCategory, activeScope, handleUserClick }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-20 max-w-3xl mx-auto"
    >
      <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white/90">Other Top Achievers</h3>
        </div>
        
        {/* List of ranks 4-10 */}
        <div className="divide-y divide-white/10">
          {displayLearners.slice(3, 10).map((learner, index) => (
            <div 
              key={index}
              onClick={() => handleUserClick(learner)}
              className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 text-right">
                  <span className="text-white/60 font-medium">#{index + 4}</span>
                </div>
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img 
                    src={learner.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div>
                    <h4 className="font-medium text-white/90">{learner.user}</h4>
                    <p className="text-sm text-white/60">{learner.school}</p>
                  </div>
                </div>
              </div>
              
              {/* Points */}
              <div className="text-right">
                <p className="font-medium text-blue-400">{learner.points.toLocaleString()} pts</p>
                <p className="text-sm text-white/60">{learner.timeSpent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 