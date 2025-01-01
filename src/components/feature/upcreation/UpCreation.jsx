import { useState, Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '../../layouts/Footer'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import SkeletonCard from './components/SkeletonCard'

// Lazy load components
const WorkCard = lazy(() => import('./components/WorkCard'))
const WorkDetail = lazy(() => import('./components/WorkDetail'))
const UploadForm = lazy(() => import('./components/UploadForm'))

const UpCreation = () => {
  const [isUploadMode, setIsUploadMode] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [studentWorks, setStudentWorks] = useState([])

  // Load works from localStorage
  useEffect(() => {
    const loadWorks = () => {
      const savedWorks = JSON.parse(localStorage.getItem('studentWorks') || '[]')
      setStudentWorks(savedWorks)
      setIsLoading(false)
    }

    // Simulate loading delay
    const timer = setTimeout(loadWorks, 1000)
    return () => clearTimeout(timer)
  }, [isUploadMode]) // Reload when upload mode changes

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Art',
    'Writing',
    'Other'
  ]

  const filteredWorks = studentWorks.filter(work => {
    if (selectedCategory !== 'All' && work.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return work.title.toLowerCase().includes(query) ||
             work.author.toLowerCase().includes(query) ||
             work.tags.some(tag => tag.toLowerCase().includes(query))
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 pt-24 pb-12 relative">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[30vw] h-[30vw] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-[35vw] h-[35vw] bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-[90px] animate-pulse delay-2000"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsUploadMode={setIsUploadMode}
          />

          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />

          <AnimatePresence mode="wait">
            {!isUploadMode ? (
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-1`}
                >
                  {isLoading ? (
                    // Skeleton loading
                    Array.from({ length: 8 }).map((_, index) => (
                      <SkeletonCard key={index} index={index} />
                    ))
                  ) : (
                    // Actual content
                    filteredWorks.map((work, index) => (
                      <Suspense key={work.id} fallback={<SkeletonCard index={index} />}>
                        <WorkCard
                          work={work}
                          index={index}
                          selectedWork={selectedWork}
                          setSelectedWork={setSelectedWork}
                        />
                      </Suspense>
                    ))
                  )}
                </motion.div>

                {selectedWork && (
                  <Suspense fallback={null}>
                    <WorkDetail
                      work={selectedWork}
                      setSelectedWork={setSelectedWork}
                    />
                  </Suspense>
                )}
              </div>
            ) : (
              <Suspense fallback={
                <div className="animate-pulse bg-[#1F2937] border border-[#374151] rounded-xl p-8 shadow-xl">
                  <div className="h-8 w-48 bg-[#374151] rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-40 w-full bg-[#374151] rounded-xl"></div>
                    <div className="h-12 w-full bg-[#374151] rounded-lg"></div>
                    <div className="h-32 w-full bg-[#374151] rounded-lg"></div>
                  </div>
                </div>
              }>
                <UploadForm
                  setIsUploadMode={setIsUploadMode}
                  categories={categories}
                />
              </Suspense>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UpCreation 