import React, { memo, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import ServiceCard from './ServiceCard'
import ServiceHeader from './ServiceHeader'
import LoadingSpinner from '../../../common/LoadingSpinner'

const categories = ['All', 'Mentoring', 'Tutoring', 'Workshop', 'Review', 'Consultation']

// Memoized empty state component
const EmptyState = memo(({ onCreateClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="text-gray-400 mb-4">No services found yet! 🎨</div>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onCreateClick}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
    >
      Create Your First Service ✨
    </motion.button>
  </motion.div>
))

const ServicesSection = ({ 
  services,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onCreateClick,
  onServiceClick
}) => {
  // Memoize filtered services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [services, searchQuery, selectedCategory])

  // Virtual list setup
  const parentRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: filteredServices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // Approximate height of a service card
    overscan: 5
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-20%" }}
      className="container max-w-7xl mx-auto px-4 relative pb-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ServiceHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          onCreateClick={onCreateClick}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center min-h-[400px]"
          >
            <LoadingSpinner />
          </motion.div>
        ) : filteredServices.length > 0 ? (
          <div 
            ref={parentRef} 
            className="h-[80vh] overflow-auto"
            style={{
              contain: 'strict',
            }}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const service = filteredServices[virtualRow.index]
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ 
                      duration: 0.5,
                      delay: virtualRow.index % 3 * 0.1,
                      ease: [0.645, 0.045, 0.355, 1.000]
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ServiceCard
                      service={service}
                      onCardClick={onServiceClick}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        ) : (
          <EmptyState onCreateClick={onCreateClick} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default memo(ServicesSection) 