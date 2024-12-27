import { useState, useEffect, Suspense, lazy, useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import HeroSection from './heroSection/HeroSection'

// Lazy load components
const CategorySection = lazy(() => import('./contentSection/CategorySection'))
const ActivityChart = lazy(() => import('./contentSection/ActivityChart'))

function Courses() {
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleSection, setVisibleSection] = useState('hero') // 'hero' or 'category'
  const heroRef = useRef(null)
  const categoryRef = useRef(null)

  useEffect(() => {
    console.log('🚀 Initial page load - Setting up observers')
    
    const options = {
      threshold: 0.1,
      rootMargin: '-10% 0px -10% 0px' // Trigger when section is 10% in view
    }

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.dataset.section
          console.log(`📍 ${section} section is in view`)
          setVisibleSection(section)
          
          // Load categories data if entering category section
          if (section === 'category' && isLoading) {
            fetchCategories()
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)

    if (heroRef.current) {
      heroRef.current.dataset.section = 'hero'
      observer.observe(heroRef.current)
    }
    if (categoryRef.current) {
      categoryRef.current.dataset.section = 'category'
      observer.observe(categoryRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories')
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([
        {
          id: 1,
          name: "Web Development",
          description: "Learn modern web development with the latest technologies",
          _count: { materials: 12 },
          _sum: { materials: { pointValue: 1200 } }
        },
        {
          id: 2,
          name: "Mobile Development",
          description: "Build mobile applications for iOS and Android",
          _count: { materials: 8 },
          _sum: { materials: { pointValue: 800 } }
        },
        {
          id: 3,
          name: "Data Science",
          description: "Master data analysis and machine learning",
          _count: { materials: 15 },
          _sum: { materials: { pointValue: 1500 } }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />
      
      <main className="relative">
        {/* Background Gradient */}
        <div className="fixed top-0 inset-x-0 h-screen pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        </div>

        {/* Hero Section */}
        <div ref={heroRef} className="min-h-screen relative">
          {visibleSection === 'hero' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection 
                categories={categories}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
              <Suspense fallback={
                <div className="mt-20 flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"/>
                    <div className="text-white/50">Loading activity chart...</div>
                  </div>
                </div>
              }>
                <ActivityChart />
              </Suspense>
            </motion.div>
          )}
        </div>

        {/* Category Section */}
        <div ref={categoryRef} className="min-h-screen relative">
          {visibleSection === 'category' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"/>
                    <div className="text-white/50">Loading categories...</div>
                  </div>
                </div>
              }>
                <CategorySection 
                  categories={categories}
                  isLoading={isLoading}
                />
              </Suspense>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Courses 