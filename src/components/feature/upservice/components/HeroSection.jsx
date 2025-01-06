import React, { useMemo } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { motion, useReducedMotion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Fallback data jika API error
const FALLBACK_SERVICES = [
  {
    id: 'fallback-1',
    title: 'Web Development Mentoring',
    description: 'Learn modern web development from experienced mentors',
    category: 'Mentoring',
    price: 50,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80']
  },
  {
    id: 'fallback-2',
    title: 'Data Science Workshop',
    description: 'Master data analysis and machine learning',
    category: 'Workshop',
    price: 75,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80']
  },
  {
    id: 'fallback-3',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native',
    category: 'Tutoring',
    price: 60,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80']
  }
]

// Fungsi untuk fetch services
const fetchFeaturedServices = async () => {
  try {
    const response = await api.get('/api/services')
    return response.data?.length > 0 ? response.data : FALLBACK_SERVICES
  } catch (err) {
    console.warn('Using fallback services:', err)
    return FALLBACK_SERVICES
  }
}

// Definisikan custom easing
const customEase = [0.6, 0.05, 0.01, 0.9]

function HeroSection({ onCreateClick }) {
  const prefersReducedMotion = useReducedMotion()
  const queryClient = useQueryClient()

  // Prefetch data saat komponen mount
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['featuredServices'],
      queryFn: fetchFeaturedServices,
      staleTime: 30000
    })
  }, [queryClient])

  // Gunakan useQuery dengan suspense mode
  const { data: services = FALLBACK_SERVICES } = useQuery({
    queryKey: ['allServices'],
    queryFn: fetchFeaturedServices,
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    suspense: false,
    initialData: FALLBACK_SERVICES,
    placeholderData: FALLBACK_SERVICES
  })

  // Memoize services untuk marquee dengan error handling
  const marqueeServices = useMemo(() => {
    try {
      const safeServices = Array.isArray(services) && services.length > 0 
        ? services 
        : FALLBACK_SERVICES
      
      // Duplicate array hingga minimal 12 item untuk memastikan scroll smooth
      const minLength = 12
      const repeats = Math.ceil(minLength / safeServices.length)
      const duplicatedServices = Array(repeats).fill(safeServices).flat()
      
      // Pastikan jumlah item genap untuk pembagian kolom
      return duplicatedServices.length % 2 === 0 
        ? duplicatedServices 
        : [...duplicatedServices, duplicatedServices[0]]
    } catch (err) {
      console.warn('Error creating marquee services, using fallback:', err)
      return [...FALLBACK_SERVICES, ...FALLBACK_SERVICES, ...FALLBACK_SERVICES, ...FALLBACK_SERVICES]
    }
  }, [services])

  // Bagi services untuk kolom kiri dan kanan
  const leftColumnServices = useMemo(() => 
    marqueeServices.slice(0, Math.ceil(marqueeServices.length / 2))
  , [marqueeServices])
  
  const rightColumnServices = useMemo(() => 
    marqueeServices.slice(Math.ceil(marqueeServices.length / 2))
  , [marqueeServices])

  const handleCreateClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
    setTimeout(() => {
      onCreateClick()
    }, prefersReducedMotion ? 0 : 500)
  }

  const handleExploreClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0">
        {/* Dark Gradient Base - Ultra Minimal */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A1A]/60 via-black to-black" style={{ backgroundSize: '20% 100%' }} />
        
        {/* Subtle Left Side Glow - Ultra Minimal */}
        <div className="absolute left-0 w-[5%] h-full bg-gradient-to-r from-blue-500/[0.01] to-transparent" />
      </div>

      {/* Bottom Gradient Overlay for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="h-16 bg-gradient-to-t from-black to-black/90" />
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
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4"
                  >
                    <span className="h-[2px] w-20 bg-gradient-to-r from-blue-500/40 to-transparent"></span>
                    <span className="text-base font-medium tracking-wider text-blue-400/70">UNLOCK YOUR POTENTIAL</span>
                  </motion.div>
                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="block text-white/95"
                    >
                      Turn Knowledge
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="relative mt-3 inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500/80 to-blue-900/50"
                    >
                      Into Impact
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute -bottom-3 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500/40 via-blue-600/20 to-transparent transform origin-left"
                      />
                    </motion.span>
                  </h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl leading-relaxed max-w-2xl font-light"
                >
                  <span className="text-white/90">Your skills are valuable. </span>
                  <span className="bg-gradient-to-r from-blue-400/90 via-blue-400/80 to-blue-500/70 bg-clip-text text-transparent">Whether it's tutoring, mentoring, or sharing expertise, </span>
                  <span className="bg-gradient-to-r from-blue-400/80 via-blue-500/70 to-blue-600/60 bg-clip-text text-transparent">transform your academic excellence into meaningful opportunities. </span>
                  <span className="bg-gradient-to-r from-blue-500/70 via-blue-500/60 to-blue-600/50 bg-clip-text text-transparent">Join a community where knowledge creates impact.</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <button
                    onClick={handleCreateClick}
                    className="group relative px-12 py-5 bg-transparent text-white text-lg overflow-hidden rounded-xl transition-all duration-300"
                  >
                    <div className="absolute inset-[1.5px] bg-black rounded-[10px] z-[2]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-blue-500/25 to-transparent rounded-xl z-[1]" />
                    <span className="relative z-[3] flex items-center justify-center font-medium tracking-wide text-white/90 group-hover:text-white">
                      Share Your Expertise
                      <FiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    onClick={handleExploreClick}
                    className="group relative px-12 py-5 bg-transparent text-white text-lg overflow-hidden rounded-xl transition-all duration-300"
                  >
                    <div className="absolute inset-[1.5px] bg-black rounded-[10px] z-[2]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-xl z-[1] group-hover:from-blue-500/30 group-hover:via-blue-500/15 group-hover:to-transparent transition-all duration-500" />
                    <span className="relative z-[3] font-medium tracking-wide text-white/80 group-hover:text-white/90">
                      Discover Services
                    </span>
                  </button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="grid grid-cols-3 gap-16 pt-12 mt-4 border-t border-white/5"
                >
                  <div className="group">
                    <p className="text-4xl font-bold text-white/95 group-hover:text-blue-400/90 transition-colors">
                      150<span className="text-blue-400">+</span>
                    </p>
                    <p className="text-base text-white/50 mt-2">Expert Students</p>
                  </div>
                  <div className="group">
                    <p className="text-4xl font-bold text-white/95 group-hover:text-blue-400/90 transition-colors">
                      15K<span className="bg-gradient-to-r from-blue-400 via-blue-500/80 to-blue-900/50 bg-clip-text text-transparent">+</span>
                    </p>
                    <p className="text-base text-white/50 mt-2">Hours Shared</p>
                  </div>
                  <div className="group">
                    <p className="text-4xl font-bold text-white/95 group-hover:text-blue-400/90 transition-colors">
                      98<span className="bg-gradient-to-r from-blue-400/80 via-blue-600/60 to-blue-900/40 bg-clip-text text-transparent">%</span>
                    </p>
                    <p className="text-base text-white/50 mt-2">Success Stories</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Content - Service Previews */}
            <div className="flex-1 relative h-[750px] max-w-xl">
              {/* Container Shadow */}
              <div className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)',
                  transform: 'scale(1.2)',
                  pointerEvents: 'none',
                  zIndex: 5
                }}
              />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative h-full overflow-hidden"
                style={{ transform: 'scale(0.95)' }}
              >
                {/* Full Rounded Container with Edge Overlay */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-black">
                  {/* Edge Overlays */}
                  <div className="absolute inset-0 z-10 rounded-full" 
                    style={{
                      background: 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.7) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />
                  {/* Top Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-[15%] z-10 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
                  {/* Bottom Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-[15%] z-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                  {/* Left Side Overlay */}
                  <div className="absolute inset-y-0 left-0 w-[15%] z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
                  {/* Right Side Overlay */}
                  <div className="absolute inset-y-0 right-0 w-[15%] z-10 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none" />
                  
                  {/* Left Column - Moving Down */}
                  <div className="marquee-container absolute left-0 w-[calc(50%-2px)] h-full">
                    <div className="marquee-content animate-marquee-down">
                      {leftColumnServices.map((service, index) => (
                        <motion.div
                          key={`down-${service.id}-${index}`}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                          style={{ transform: 'scale(1.25)' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 group-hover:opacity-40 transition-all duration-500" />
                          <img
                            src={service.images?.[0]}
                            alt={service.title}
                            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-90 transition-all duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <h3 className="text-lg font-semibold truncate">{service.title}</h3>
                            <p className="text-sm text-white/80">{service.category}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Moving Up */}
                  <div className="marquee-container absolute right-0 w-[calc(50%-2px)] h-full">
                    <div className="marquee-content animate-marquee-up">
                      {rightColumnServices.map((service, index) => (
                        <motion.div
                          key={`up-${service.id}-${index}`}
                          initial={{ opacity: 0, y: -20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          className="relative mb-3 aspect-[3/4] rounded-lg overflow-hidden group transform-gpu"
                          style={{ transform: 'scale(1.25)' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 group-hover:opacity-40 transition-all duration-500" />
                          <img
                            src={service.images?.[0]}
                            alt={service.title}
                            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-90 transition-all duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <h3 className="text-lg font-semibold truncate">{service.title}</h3>
                            <p className="text-sm text-white/80">{service.category}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Marquee Animation Styles */}
      <style>{`
        .marquee-container {
          mask-image: linear-gradient(to bottom, black 0%, black 20%, black 80%, black 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 20%, black 80%, black 100%);
        }

        .marquee-content {
          position: relative;
          will-change: transform;
          padding: 1rem;
        }

        .animate-marquee-down {
          animation: marquee-down 40s linear infinite;
        }

        .animate-marquee-up {
          animation: marquee-up 40s linear infinite;
        }

        @keyframes marquee-down {
          0% { 
            transform: translateY(-50%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% { 
            transform: translateY(0%);
            opacity: 0;
          }
        }

        @keyframes marquee-up {
          0% { 
            transform: translateY(0%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-50%);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-down,
          .animate-marquee-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroSection 