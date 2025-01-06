import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiBookOpen, FiSmile, FiAward } from 'react-icons/fi'
import Footer from '../../layouts/Footer'
import ServiceCard from './components/ServiceCard'
import CreateServiceModal from './components/CreateServiceModal'
import ServiceHeader from './components/ServiceHeader'
import ServiceDetailModal from './components/ServiceDetailModal'
import HeroSection from './components/HeroSection'
import LoadingSpinner from '../../common/LoadingSpinner'

const UpService = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Mentoring', 'Tutoring', 'Workshop', 'Review', 'Consultation']

  useEffect(() => {
    fetchServices()
  }, [searchQuery, selectedCategory])

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`http://localhost:3000/api/services?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      alert('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (serviceData) => {
    try {
      const response = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData),
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to create service')
      const newService = await response.json()
      setServices(prev => [newService, ...prev])
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Failed to create service')
    }
  }


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Artistic Background - Focused on left side */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Abstract Lines - Only on left side */}
        <div className="absolute inset-y-0 left-0 w-1/3">
          <svg className="w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,50 Q25,30 50,50 T100,50"
              stroke="url(#gradient1)"
              strokeWidth="0.2"
              fill="none"
              className="animate-float"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              d="M0,30 Q25,50 50,30 T100,30"
              stroke="url(#gradient2)"
              strokeWidth="0.2"
              fill="none"
              className="animate-float-delay"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Shapes - Only on left side */}
        <div className="absolute top-20 left-[5%] w-24 h-24 opacity-20">
      <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full border-4 border-blue-500 rounded-3xl"
          />
        </div>

        {/* Gradient Orbs - Concentrated on far left */}
        <div className="absolute top-0 left-0 w-[35vw] h-[35vw] bg-gradient-to-r from-blue-500/[0.05] via-purple-500/[0.02] to-transparent rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/3 left-0 w-[25vw] h-[25vw] bg-gradient-to-r from-purple-500/[0.05] via-pink-500/[0.02] to-transparent rounded-full blur-[80px] animate-float-delay"></div>

        {/* Dots Grid - Sharp fade from left to center */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-[rgba(255,255,255,0.01)] to-transparent" style={{ backgroundSize: '100% 100%', backgroundPosition: 'left center' }}>
          <div className="absolute inset-y-0 left-0 right-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        </div>
      </div>

      <main className="relative" style={{ zIndex: 1 }}>
        {/* Hero Section with Gradient Transition */}
        <div className="relative">
          <HeroSection onCreateClick={() => setIsCreateModalOpen(true)} />
          {/* Multi-layer Smooth Dark Gradient Transition */}
          <div className="absolute -bottom-96 left-0 right-0 h-96 pointer-events-none">
            {/* Main fade to black - darker and longer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
            {/* Extra dark layer for smoother transition */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
            {/* Subtle blue accent for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.01] via-transparent to-transparent opacity-50" />
          </div>
        </div>

        {/* Main Content with Enhanced Background */}
        <div className="relative bg-black">
          {/* Abstract Background Patterns */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated Abstract Lines */}
            <svg className="absolute w-full h-full opacity-[0.2]" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Wavy Line 1 */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                d="M-10,20 Q30,40 50,20 T110,20"
                stroke="url(#abstractLine1)"
                strokeWidth="0.5"
                fill="none"
              />
              {/* Wavy Line 2 */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                d="M-10,40 Q25,60 50,40 T110,40"
                stroke="url(#abstractLine2)"
                strokeWidth="0.5"
                fill="none"
              />
              {/* Diagonal Lines */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
                d="M15,0 L85,100"
                stroke="url(#abstractLine3)"
                strokeWidth="0.3"
                fill="none"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
                d="M85,0 L15,100"
                stroke="url(#abstractLine3)"
                strokeWidth="0.3"
                fill="none"
              />
              <defs>
                <linearGradient id="abstractLine1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="abstractLine2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="abstractLine3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Gradient Orbs */}
            <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 opacity-[0.07]">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-blue-500/30 blur-3xl"
              />
            </div>
            <div className="absolute -right-1/4 bottom-1/4 w-1/2 h-1/2 opacity-[0.05]">
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [180, 0, 180],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-purple-500/30 blur-3xl"
              />
            </div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 relative">
            <ServiceHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />

            {/* Playful Category Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-8"
            >
             
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <LoadingSpinner />
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ServiceCard
                        service={service}
                        onCardClick={setSelectedService}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fun Empty State */}
            {!loading && services.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">No services found yet! 🎨</div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Create Your First Service ✨
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

              <CreateServiceModal
                isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateService}
              />

          {selectedService && (
              <ServiceDetailModal
                isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
                service={selectedService}
              />
          )}
      </main>
        <Footer />
    </div>
  )
}

export default UpService 