import React, { useState, useEffect, Suspense, lazy, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from 'react-error-boundary'
import Footer from '../../layouts/Footer'
import HeroSection from '../../layouts/HeroSection'
import { FiBook, FiUsers, FiBarChart } from 'react-icons/fi'
import iconCourse1 from '../../../assets/images/courses/iconCourse1.svg'

// Lazy load components
const CategorySection = lazy(() => import('./contentSection/CategorySection'))
const ActivityChart = lazy(() => import('./contentSection/ActivityChart'))

const fadeVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const LoadingFallback = ({ message }) => (
  <div className="mt-20 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"/>
      <div className="text-white/50">{message}</div>
    </div>
  </div>
);

const ErrorFallback = ({ error }) => (
  <div className="mt-20 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="text-red-400">Something went wrong:</div>
      <div className="text-sm text-white/60">{error.message}</div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

const Courses = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleSection, setVisibleSection] = useState('hero')
  const heroRef = useRef(null)
  const categoryRef = useRef(null)

  const courseStats = [
    { icon: FiBook, value: categories.length || '20+', label: 'Learning Paths' },
    { icon: FiUsers, value: '2.5k+', label: 'Active Learners' },
    { icon: FiBarChart, value: '94%', label: 'Success Rate' }
  ]

  useEffect(() => {
    console.log('🚀 Initial page load - Setting up observers')
    
    const options = {
      threshold: 0.1,
      rootMargin: '-10% 0px -10% 0px'
    }

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.dataset.section
          console.log(`📍 ${section} section is in view`)
          setVisibleSection(section)
          
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
      const response = await fetch('http://localhost:3000/api/categories', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Categories fetched:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback data jika terjadi error
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
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="relative">
        {/* Background Gradient */}
        <div className="fixed top-0 inset-x-0 h-screen pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        </div>

        {/* Hero Section */}
        <div ref={heroRef} className="min-h-screen relative">
          <AnimatePresence mode="wait">
            {visibleSection === 'hero' && (
              <motion.div
                key="hero"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <HeroSection 
                  type="courses"
                  icon={iconCourse1}
                  stats={courseStats}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  showFilters={true}
                />
                <Suspense fallback={<LoadingFallback message="Loading activity chart..." />}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <ActivityChart />
                  </ErrorBoundary>
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Section */}
        <div ref={categoryRef} className="min-h-screen relative">
          <AnimatePresence mode="wait">
            {visibleSection === 'category' && (
              <motion.div
                key="category"
                variants={slideUpVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingFallback message="Loading categories..." />}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <CategorySection 
                      categories={categories}
                      isLoading={isLoading}
                    />
                  </ErrorBoundary>
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Courses 