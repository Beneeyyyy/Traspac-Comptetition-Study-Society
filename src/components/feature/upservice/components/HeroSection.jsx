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
      {/* Abstract Background Elements */}
      <div className="absolute inset-0">
        {/* Dark Gradient Base - Ultra Minimal */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A1A]/60 via-black to-black" style={{ backgroundSize: '20% 100%' }} />
        
        {/* Subtle Left Side Glow - Ultra Minimal */}
        <div className="absolute left-0 w-[5%] h-full bg-gradient-to-r from-blue-500/[0.01] to-transparent" />

        {/* Grid Pattern - Ultra Minimal */}
        <div className="absolute left-0 w-[5%] h-full bg-[url('/grid.svg')] opacity-[0.01]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-screen">
        <div className="h-full flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-20">
            {/* Left Content */}
            <div className="flex-1 max-w-3xl pl-8 lg:pl-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                {/* Main Content */}
                <div className="relative space-y-5">
                  <div className="flex items-center gap-4 text-base text-blue-400/70">
                    <span className="h-[2px] w-20 bg-blue-400/40"></span>
                    STUDENT MARKETPLACE
                  </div>
                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                    <span className="text-white/95">Transform Your</span>
                    <br />
                    <span className="relative mt-3 inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                      Skills & Knowledge
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute -bottom-3 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500/40 to-transparent transform origin-left"
                      />
                    </span>
                  </h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-lg text-white/60 leading-relaxed max-w-2xl"
                >
                  Join our vibrant student community where expertise meets opportunity. Transform your academic knowledge into valuable services, help fellow students excel, and build your professional portfolio while earning.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-5"
                >
                  <button
                    onClick={handleCreateClick}
                    className="group relative px-10 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center font-semibold tracking-wide">
                      Start Teaching
                      <FiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    onClick={handleExploreClick}
                    className="px-10 py-4 bg-white/5 text-white text-lg font-medium rounded-xl transition-all border border-white/10 hover:bg-white/10 hover:border-blue-500/30"
                  >
                    <span className="font-semibold tracking-wide">Browse Services</span>
                  </button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="grid grid-cols-3 gap-16 pt-12 mt-4 border-t border-white/5"
                >
                  <div>
                    <p className="text-4xl font-bold text-white/95">150<span className="text-blue-400">+</span></p>
                    <p className="text-base text-white/50 mt-2">Active Services</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-white/95">Rp<span className="text-blue-400">15M</span></p>
                    <p className="text-base text-white/50 mt-2">Total Earnings</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-white/95">4.8<span className="text-blue-400">/5</span></p>
                    <p className="text-base text-white/50 mt-2">Student Rating</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Content - Service Previews */}
            <div className="flex-1 relative h-[750px] max-w-2xl">
              {/* Darker Vignette for Marquee */}
              <div className="absolute -inset-16 bg-[radial-gradient(circle_at_center,transparent_5%,black_50%)] pointer-events-none z-20" />
              
              {/* Columns Container */}
              <div className="relative h-full overflow-hidden px-8">
                {/* Left Column - Moving Down */}
                <div className="absolute left-0 w-[calc(50%-4px)] animate-marquee-down">
                  {duplicatedServices.slice(0, 8).map((service, index) => (
                    <motion.div
                      key={`down-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 group-hover:opacity-40 transition-all duration-500" />
                      <img
                        src={service.images?.[0]}
                        alt="Preview"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-90 transition-all duration-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Right Column - Moving Up */}
                <div className="absolute right-0 w-[calc(50%-4px)] animate-marquee-up">
                  {duplicatedServices.slice(8, 16).map((service, index) => (
                    <motion.div
                      key={`up-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 group-hover:opacity-40 transition-all duration-500" />
                      <img
                        src={service.images?.[0]}
                        alt="Preview"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-90 transition-all duration-500" />
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
          animation: marquee-down 40s linear infinite;
        }

        .animate-marquee-up {
          animation: marquee-up 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroSection 