import { motion } from 'framer-motion'

function TopThree({ displayLearners = [], activeCategory, activeScope, handleUserClick }) {
  // Take only top 3 learners
  const topThree = displayLearners.slice(0, 3);

  // Define positions for the podium
  const positions = {
    1: { order: 1, scale: 1.1, y: 0 },
    2: { order: 0, scale: 0.9, y: 40 },
    3: { order: 2, scale: 0.9, y: 40 }
  };

  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-end gap-4 mb-12 mt-8">
      {topThree.map((learner, index) => {
        if (!learner || typeof learner !== 'object') {
          console.error('Invalid learner data:', learner);
          return null;
        }

        const position = index + 1;
        const { order, scale, y } = positions[position];

        return (
          <motion.div
            key={learner.userId || index}
            className="relative"
            style={{ order }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y, scale }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Position Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {position}
              </div>
            </div>

            {/* Card */}
            <div 
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleUserClick(learner)}
            >
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={learner.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff`}
                  alt={learner.user}
                  className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {learner.level || 1}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">{learner.user}</h3>
                <p className="text-sm text-gray-400 mb-2">{learner.school?.name || 'Unknown School'}</p>
                <div className="flex justify-center gap-2 text-sm text-gray-400 mb-3">
                  <span>{learner.timeSpent || '0h 0m'}</span>
                  <span>•</span>
                  <span>{learner.coursesCount || 0} courses</span>
                </div>
                <div className="bg-blue-500 rounded-full py-1 px-4 text-white font-bold">
                  {(learner.points || 0).toLocaleString()} points
                </div>
              </div>

              {/* School Badge */}
              {learner.school?.image && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <img
                    src={learner.school.image}
                    alt={learner.school.name || 'School'}
                    className="w-8 h-8 rounded-full border-2 border-gray-700"
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default TopThree; 