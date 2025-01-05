import React, { useState, useEffect } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import axios from 'axios'

const HeroSection = ({ onCreateClick }) => {
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services')
        setServices(response.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [])

  const handleCreateClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
    setTimeout(() => {
      onCreateClick()
    }, 500)
  }

  const handleExploreClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  // Duplicate services for infinite marquee
  const duplicatedServices = [...services, ...services, ...services]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Simple Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />
      
      {/* Subtle Animated Background */}
      <motion.div
        animate={{
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]"
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-screen">
        <div className="h-full flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-20">
            {/* Left Content */}
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Decorative Elements */}
                <div className="absolute -left-20 top-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 top-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />

                {/* Main Content */}
                <div className="relative space-y-3">
                  <div className="flex items-center gap-2 text-sm text-blue-400/80">
                    <span className="h-px w-10 bg-blue-400/50"></span>
                    STUDENT MARKETPLACE
                  </div>
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                    <span className="text-white/90">Discover and</span>
                    <br />
                    <span className="relative mt-1 inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                      Share Knowledge
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent transform origin-left"
                      />
                    </span>
                  </h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-base text-white/60 leading-relaxed max-w-lg"
                >
                  Join a thriving community of students where you can transform your skills into valuable services. Share your expertise, help others learn, and earn while making a difference.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={handleCreateClick}
                    className="group relative px-8 py-4 bg-blue-500 text-white font-medium rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center text-sm font-semibold tracking-wide">
                      Start Teaching
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    onClick={handleExploreClick}
                    className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl transition-all border border-white/10 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
                  >
                    <span className="text-sm font-semibold tracking-wide">Browse Services</span>
                  </button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5"
                >
                  <div>
                    <p className="text-2xl font-bold text-white/90">150<span className="text-blue-400">+</span></p>
                    <p className="text-sm text-white/40 mt-1">Total Services</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white/90">Rp<span className="text-blue-400">15M</span></p>
                    <p className="text-sm text-white/40 mt-1">Total Transactions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white/90">4.8<span className="text-blue-400">/5</span></p>
                    <p className="text-sm text-white/40 mt-1">Average Rating</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Content - Service Previews */}
            <div className="flex-1 relative h-[650px] max-w-2xl">
              {/* Enhanced Vignette Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-20" />
              <div className="absolute -inset-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95))] pointer-events-none z-20" />
              
              {/* Columns Container */}
              <div className="relative h-full overflow-hidden px-8">
                {/* Left Column - Moving Down */}
                <div className="absolute left-0 w-[calc(50%-4px)] animate-marquee-down">
                  {duplicatedServices.slice(0, 8).map((service, index) => (
                    <motion.div
                      key={`down-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:via-black/0 transition-all duration-500" />
                      <img
                        src={service.images?.[0]}
                        alt="Preview"
                        className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Right Column - Moving Up */}
                <div className="absolute right-0 w-[calc(50%-4px)] animate-marquee-up">
                  {duplicatedServices.slice(8, 16).map((service, index) => (
                    <motion.div
                      key={`up-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:via-black/0 transition-all duration-500" />
                      <img
                        src={service.images?.[0]}
                        alt="Preview"
                        className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style jsx>{`
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        .animate-marquee-down {
          animation: marquee-down 30s linear infinite;
        }

        .animate-marquee-up {
          animation: marquee-up 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroSection 