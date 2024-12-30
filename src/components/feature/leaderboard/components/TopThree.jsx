import { motion } from 'framer-motion'

export default function TopThree({ displayLearners, activeCategory, activeScope, handleUserClick }) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-12">
      {/* Second Place Card */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full md:w-72 md:translate-y-8"
      >
        <div 
          onClick={() => handleUserClick(displayLearners[1])}
          className="relative group transform transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg" />
          <div className="absolute top-0 left-0 w-[2px] h-12 bg-blue-500/50" />
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-blue-500/50" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="absolute -top-3 right-4 px-4 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
              <span className="text-sm font-medium text-blue-400">#2</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={displayLearners[1].image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-medium text-white/90 text-lg">{displayLearners[1].user}</h3>
                <p className="text-blue-400 font-medium">{displayLearners[1].points.toLocaleString()} pts</p>
                <p className="text-sm text-white/60">{displayLearners[1].school}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span className="text-blue-400">75%</span>
              </div>
              <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full" style={{width: '75%'}} />
              </div>
              {activeScope === 'regional' && (
                <p className="text-sm text-white/60 mt-2">{displayLearners[1].region}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* First Place - Champion */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full md:w-80"
      >
        <div 
          onClick={() => handleUserClick(displayLearners[0])}
          className="relative group transform transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 via-blue-500/20 to-transparent rounded-lg" />
          <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-purple-500/70 to-blue-500/70" />
          <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-purple-500/70 to-blue-500/70" />
          <div className="absolute top-0 right-0 w-[2px] h-16 bg-gradient-to-b from-purple-500/70 to-blue-500/70" />
          <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-l from-purple-500/70 to-blue-500/70" />
          
          <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-lg p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Champion</span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <img 
                  src={displayLearners[0].image}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-500/30"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">{displayLearners[0].user}</h3>
                <p className="text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
                  {displayLearners[0].points.toLocaleString()} pts
                </p>
                <p className="text-sm text-white/60">{displayLearners[0].school}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                  <span>Mastery Level</span>
                  <span className="text-purple-400">90%</span>
                </div>
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 rounded-full animate-gradient" style={{width: '90%'}} />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Time Invested</span>
                <span className="text-purple-400">{displayLearners[0].timeSpent}</span>
              </div>
              
              {activeScope === 'regional' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Region</span>
                  <span className="text-purple-400">{displayLearners[0].region}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Third Place */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full md:w-72 md:translate-y-12"
      >
        <div 
          onClick={() => handleUserClick(displayLearners[2])}
          className="relative group transform transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg" />
          <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-blue-500/50" />
          <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-blue-500/50" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="absolute -top-3 right-4 px-4 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
              <span className="text-sm font-medium text-blue-400">#3</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={displayLearners[2].image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-medium text-white/90 text-lg">{displayLearners[2].user}</h3>
                <p className="text-blue-400 font-medium">{displayLearners[2].points.toLocaleString()} pts</p>
                <p className="text-sm text-white/60">{displayLearners[2].school}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span className="text-blue-400">60%</span>
              </div>
              <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full" style={{width: '60%'}} />
              </div>
              {activeScope === 'regional' && (
                <p className="text-sm text-white/60 mt-2">{displayLearners[2].region}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 