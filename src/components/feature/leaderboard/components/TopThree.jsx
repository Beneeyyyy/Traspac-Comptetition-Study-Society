import { motion } from 'framer-motion'
import { FiClock, FiBook } from 'react-icons/fi'

function TopThree({ displayLearners = [], activeCategory, activeScope, handleUserClick }) {
  const topThree = displayLearners.slice(0, 3);

  const positions = {
    1: { order: 1, scale: 1.1, y: 0 },
    2: { order: 0, scale: 0.95, y: 30 },
    3: { order: 2, scale: 0.95, y: 30 }
  };

  const styles = {
    1: {
      card: "bg-black border border-pink-600/20",
      badge: "bg-black border-2 border-pink-600",
      points: "text-pink-600"
    },
    2: {
      card: "bg-black border border-purple-600/20",
      badge: "bg-black border-2 border-purple-600",
      points: "text-purple-600"
    },
    3: {
      card: "bg-black border border-emerald-600/20",
      badge: "bg-black border-2 border-emerald-600",
      points: "text-emerald-600"
    }
  };

  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-end gap-6 mb-12 mt-8">
      {topThree.map((learner, index) => {
        if (!learner || typeof learner !== 'object') {
          console.error('Invalid learner data:', learner);
          return null;
        }

        const position = index + 1;
        const { order, scale, y } = positions[position];
        const style = styles[position];

        return (
          <motion.div
            key={learner.userId || index}
            className="relative"
            style={{ order }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y, scale }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Card */}
            <div 
              className={`relative ${style.card} rounded-xl p-6 w-[260px] cursor-pointer hover:bg-[#0a0a0a]`}
              onClick={() => handleUserClick(learner)}
            >
              {/* Position Badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className={`w-10 h-10 rounded-full ${style.badge} flex items-center justify-center text-white font-bold text-xl`}>
                  {position}
                </div>
              </div>

              {/* Avatar & Basic Info */}
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <img
                    src={learner.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff`}
                    alt={learner.user}
                    className="w-20 h-20 rounded-full object-cover border border-white/10 mb-3"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {learner.user}
                </h3>
                <p className="text-sm text-white/60">
                  {learner.school?.name || 'Unknown School'}
                </p>
              </div>

              {/* Stats */}
              <div className="bg-black rounded-lg p-4 text-center border border-white/5">
                <div className={`text-2xl font-bold ${style.points} mb-1`}>
                  {(learner.points || 0).toLocaleString()}
                </div>
                <div className="text-sm font-medium text-white/40">POINTS EARNED</div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-white/40 mb-1">
                      <FiClock className="w-4 h-4" />
                      <span className="text-xs">Time Spent</span>
                    </div>
                    <p className="font-medium text-white/80">{learner.timeSpent || '0h'}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-white/40 mb-1">
                      <FiBook className="w-4 h-4" />
                      <span className="text-xs">Courses</span>
                    </div>
                    <p className="font-medium text-white/80">{learner.coursesCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default TopThree; 