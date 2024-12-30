import { motion } from 'framer-motion'
import heroImage from '../../../../assets/images/leaderboard/heroSection.svg'

export default function LeaderboardHero() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden py-24 mb-12"
    >
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-purple-500/50" />
                <span className="text-white/70 font-medium uppercase tracking-wider text-sm">Study Society</span>
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Compete.<br/>
                Learn.<br/>
                Achieve.
              </h1>
              <p className="text-xl text-white/60 max-w-xl leading-relaxed">
                Join an elite community of learners where every study session counts. Rise through the ranks and inspire the next generation of achievers.
              </p>
            </motion.div>

            {/* Categories */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-purple-500/20 hover:border-purple-500/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8.163l-8.5 8.5a1 1 0 101.414 1.414L12 10.991l7.086 7.086a1 1 0 001.414-1.414l-8.5-8.5z"/>
                        <path d="M12 3.163l-8.5 8.5a1 1 0 101.414 1.414L12 5.991l7.086 7.086a1 1 0 001.414-1.414l-8.5-8.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg text-white font-medium">Weekly Stars</h3>
                  </div>
                  <p className="text-white/50 text-sm">Top performers of the week showcasing dedication and growth.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-blue-500/20 hover:border-blue-500/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4z"/>
                        <path d="M12 2L4 10l1.4 1.4L12 4.8l6.6 6.6L20 10z"/>
                        <path d="M20 14l-1.4-1.4L12 19.2l-6.6-6.6L4 14l8 8z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg text-white font-medium">All Time Best</h3>
                  </div>
                  <p className="text-white/50 text-sm">Legendary learners who've made their mark in history.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative group md:col-span-2"
              >
                <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-green-500/30 hover:border-green-500/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L8 6h3v6H5v3l-3 4h20l-3-4v-3h-6V6h3L12 2z"/>
                        <path d="M12 15.4l3.3-3.3-1.4-1.4L12 12.6l-1.9-1.9-1.4 1.4z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg text-white font-medium">School Champions</h3>
                  </div>
                  <p className="text-white/50 text-sm">Leading lights representing their schools with excellence.</p>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-12"
            >
              <div>
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-white/50">Active Learners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/50">Schools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">1M+</div>
                <div className="text-sm text-white/50">Study Hours</div>
              </div>
            </motion.div>
          </div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative hidden lg:block"
          >
            {/* Glow Effect */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-blue-500/40 blur-[100px] rounded-full" />
            
            <img 
              src={heroImage} 
              alt="Leaderboard Hero"
              className="relative w-full h-auto max-w-lg mx-auto [mask-image:linear-gradient(to_bottom,white,transparent)] mix-blend-screen bg-white rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 