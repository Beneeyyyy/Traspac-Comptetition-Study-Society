import React, { useState, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiBookOpen, FiSmile, FiAward } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Footer from '../../layouts/Footer'
import LoadingSpinner from '../../common/LoadingSpinner'
import ServiceHeader from './components/ServiceHeader'
import ErrorBoundary from '../../common/ErrorBoundary'

// Lazy loaded components
const ServiceCard = lazy(() => import('./components/ServiceCard'))
const CreateServiceModal = lazy(() => import('./components/CreateServiceModal'))
const ServiceDetailModal = lazy(() => import('./components/ServiceDetailModal'))
const HeroSection = lazy(() => import('./components/HeroSection'))

// Constants
const categories = ['All', 'Mentoring', 'Tutoring', 'Workshop', 'Review', 'Consultation']
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
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
    images: ['/images/placeholder-1.jpg']
  },
  {
    id: 'fallback-2',
    title: 'Data Science Workshop',
    description: 'Master data analysis and machine learning',
    category: 'Workshop',
    price: 75,
    rating: 4.9,
    images: ['/images/placeholder-2.jpg']
  }
]

function UpService() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [retryCount, setRetryCount] = useState(0)

  // Fetch services with better error handling
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services', selectedCategory, searchQuery, retryCount],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== 'All') params.append('category', selectedCategory)
        if (searchQuery) params.append('search', searchQuery)
        
        const response = await api.get(`/api/services?${params.toString()}`)
        return response.data
      } catch (err) {
        // Jika error 500, gunakan fallback data
        if (err.response?.status === 500) {
          console.warn('Failed to fetch services, using fallback data')
          return FALLBACK_SERVICES.filter(service => 
            selectedCategory === 'All' || service.category === selectedCategory
          )
        }
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 2,
    onError: (err) => {
      console.error('Error fetching services:', err)
      // Increment retry count to trigger refetch
      setRetryCount(prev => prev + 1)
    }
  })

  // Handle service creation with better error handling
  const handleCreateService = async (serviceData) => {
    try {
      // Since we're using FormData, we need to set the correct headers
      const response = await api.post('/api/services', serviceData, {
        headers: {
          // Let the browser set the Content-Type header with boundary for FormData
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setIsCreateModalOpen(false)
      // Trigger refetch
      setRetryCount(prev => prev + 1)
      return response.data
    } catch (err) {
      console.error('Error creating service:', err)
      const errorMessage = err.response?.data?.message || 'Failed to create service'
      alert(errorMessage)
      throw err
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col pt-16">
        <ErrorBoundary>
          <main className="relative">
            <Suspense fallback={<LoadingSpinner />}>
              <ErrorBoundary>
                <HeroSection onCreateClick={() => setIsCreateModalOpen(true)} />
              </ErrorBoundary>
            </Suspense>

            <div className="relative bg-black">
              <div className="container max-w-7xl mx-auto px-4 relative">
                <ServiceHeader
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                  onCreateClick={() => setIsCreateModalOpen(true)}
                />

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                      <LoadingSpinner />
                    </div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-red-400"
                    >
                      Failed to load services. Please try again later.
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        {services.map((service) => (
                          <motion.div
                            key={service.id}
                            variants={itemVariants}
                            layout
                          >
                            <ServiceCard
                              service={service}
                              onCardClick={setSelectedService}
                            />
                          </motion.div>
                        ))}
                      </Suspense>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isLoading && !error && services.length === 0 && (
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

            <Suspense fallback={null}>
              {isCreateModalOpen && (
                <CreateServiceModal
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  onSubmit={handleCreateService}
                />
              )}

              {selectedService && (
                <ServiceDetailModal
                  isOpen={!!selectedService}
                  onClose={() => setSelectedService(null)}
                  service={selectedService}
                />
              )}
            </Suspense>
          </main>
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  )
}

export default UpService 