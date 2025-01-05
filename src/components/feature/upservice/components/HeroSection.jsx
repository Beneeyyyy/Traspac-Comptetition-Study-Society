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
    // Scroll ke bawah dengan animasi smooth
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
    
    // Tunggu scroll selesai baru buka modal
    setTimeout(() => {
      onCreateClick()
    }, 500)
  }

  // Duplicate array untuk memastikan ada cukup gambar untuk animasi marquee
  const duplicatedServices = [...services, ...services]

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background dengan gradient yang lebih fokus di kiri */}
      <div className="absolute inset-0">
        {/* Efek cahaya yang terfokus di tengah */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[50vh] bg-gradient-to-r from-blue-500/[0.1] via-transparent to-transparent"></div>
        
        {/* Radial gradient di tengah */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[50%] h-[40vh] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        {/* Subtle dots pattern */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40%] h-[30vh] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left Content - dengan animasi dan gradient text */}
          <div className="flex-1 lg:pr-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-400">
                  Turn Your Skills
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 block mt-2">
                  Into Income
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-xl">
                Transform your daily activities into profitable services. Join our platform where students can showcase their talents and skills to a global audience. Start earning while doing what you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleCreateClick}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <span className="text-xl font-medium">Start Offering Services</span>
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-xl font-medium backdrop-blur-sm border border-white/10 hover:border-white/20">
                  Explore Services
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image Grid dengan efek gelap di sisi kanan */}
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-l from-black via-black/50 to-transparent z-0"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 grid grid-cols-2 gap-6"
            >
              {/* Container for Images 1 & 2 - Marquee Top to Bottom */}
              <div className="relative -mt-6">
                <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm relative overflow-hidden h-[600px]">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="animate-marquee-down flex flex-col gap-6">
                    {duplicatedServices.slice(0, 7).map((service, index) => (
                      <div key={`down-${service.id}-${index}`} className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                        <img 
                          src={service.images[0]} 
                          alt={service.title} 
                          className="w-full h-56 object-cover rounded-xl"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
                </div>
              </div>

              {/* Container for Images 3 & 4 - Marquee Bottom to Top */}
              <div className="relative mt-24">
                <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm relative overflow-hidden h-[600px]">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="animate-marquee-up flex flex-col gap-6">
                    {duplicatedServices.slice(7, 14).map((service, index) => (
                      <div key={`up-${service.id}-${index}`} className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                        <img 
                          src={service.images[0]} 
                          alt={service.title} 
                          className="w-full h-56 object-cover rounded-xl"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-down {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes marquee-up {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        .animate-marquee-down {
          animation: marquee-down 20s linear infinite;
        }

        .animate-marquee-up {
          animation: marquee-up 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroSection 