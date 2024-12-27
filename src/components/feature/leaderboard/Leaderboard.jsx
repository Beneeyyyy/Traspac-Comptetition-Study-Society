import { useState, useEffect } from 'react'
import Navbar from '../../layouts/Navbar'
import { motion } from 'framer-motion'

function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [topLearners, setTopLearners] = useState([])

  // Fetch top learners
  useEffect(() => {
    const fetchTopLearners = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/points/leaderboard/topGlobal');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Transform data untuk match dengan struktur yang dibutuhkan
        const transformedData = data.map(learner => ({
          user: learner.user,
          email: learner.email,
          image: learner.image,
          points: learner.totalPoint,
          coursesCount: 0,
          timeSpent: "0h 0m"
        }));

        setTopLearners(transformedData);
      } catch (error) {
        console.error('Error fetching top learners:', error);
        setTopLearners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopLearners();
  }, []);

  // Data default untuk top learners
  const defaultLearners = [
    {
      user: "---",
      coursesCount: 0,
      points: 0,
      timeSpent: "0h 0m",
      image: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
    }
  ];

  // Update displayLearners
  const displayLearners = topLearners.length >= 3 ? topLearners.map(learner => ({
    ...learner,
    image: learner.image?.startsWith('data:image') ? 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff` : 
      learner.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff`
  })) : [
    ...topLearners.map(learner => ({
      ...learner,
      image: learner.image?.startsWith('data:image') ? 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff` : 
        learner.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff`
    })),
    ...Array(3 - topLearners.length).fill(defaultLearners[0])
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Top Learners Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24 relative"
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-[1px] top-1/3 left-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-scan" />
            <div className="absolute w-full h-[1px] top-2/3 left-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-scan delay-150" />
            <div className="absolute w-[1px] h-full top-0 left-1/3 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-scan-vertical" />
            <div className="absolute w-[1px] h-full top-0 left-2/3 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-scan-vertical delay-150" />
            
            {/* Improved Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-500/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-blue-500/30 rounded-tr-3xl" />
            
            {/* Enhanced Grid */}
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]" />
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-medium mb-16 text-center relative"
            >
              <span className="block text-sm tracking-wider text-white/60 mb-1">WEEKLY RANKINGS</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-white text-3xl font-bold">Top Academic Achievers</span>
                {/* Enhanced Underline effect */}
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />
                <span className="absolute -top-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
              </span>
            </motion.h2>

            <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-12">
              {/* Second Place */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full md:w-72 md:translate-y-8"
              >
                <div className="relative group transform transition-all duration-300 hover:scale-105">
                  {/* Enhanced Tech frame effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg" />
                  <div className="absolute top-0 left-0 w-[2px] h-12 bg-blue-500/50" />
                  <div className="absolute top-0 left-0 w-12 h-[2px] bg-blue-500/50" />
                  
                  <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    {/* Rank indicator */}
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
                <div className="relative group transform transition-all duration-300 hover:scale-105">
                  {/* Enhanced Champion frame effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 via-blue-500/20 to-transparent rounded-lg" />
                  <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-purple-500/70 to-blue-500/70" />
                  <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-purple-500/70 to-blue-500/70" />
                  <div className="absolute top-0 right-0 w-[2px] h-16 bg-gradient-to-b from-purple-500/70 to-blue-500/70" />
                  <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-l from-purple-500/70 to-blue-500/70" />
                  
                  <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-lg p-8">
                    {/* Champion badge */}
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
                <div className="relative group transform transition-all duration-300 hover:scale-105">
                  {/* Enhanced Tech frame effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg" />
                  <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-blue-500/50" />
                  <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-blue-500/50" />
                  
                  <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    {/* Rank indicator */}
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
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default Leaderboard 