import { useState, Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import Footer from '../../layouts/Footer'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import SkeletonCard from './components/SkeletonCard'

// Lazy load components
const WorkCard = lazy(() => import('./components/WorkCard'))
const WorkDetail = lazy(() => import('./components/WorkDetail'))
const UploadForm = lazy(() => import('./components/UploadForm'))

// Set axios default base URL
axios.defaults.baseURL = 'http://localhost:3000';

const UpCreation = () => {
  const [isUploadMode, setIsUploadMode] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [creations, setCreations] = useState([])
  const [error, setError] = useState(null)

  // Load creations from API
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('/api/creations', {
          params: {
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            search: searchQuery || undefined
          },
          withCredentials: true
        })
        setCreations(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching creations:', err)
        setError('Failed to load creations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreations()
  }, [isUploadMode, selectedCategory, searchQuery])

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Art',
    'Writing',
    'Other'
  ]

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

          {error && (
            <div className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isUploadMode ? (
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4"
                >
                  {isLoading ? (
                    // Skeleton loading
                    Array.from({ length: 8 }).map((_, index) => (
                      <SkeletonCard key={index} index={index} />
                    ))
                  ) : creations.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No creations found
                    </div>
                  ) : (
                    // Actual content
                    creations.map((creation, index) => (
                      <Suspense key={creation.id} fallback={<SkeletonCard index={index} />}>
                        <WorkCard
                          work={{
                            ...creation,
                            authorAvatar: creation.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(creation.author)}&background=0D8ABC&color=fff`,
                            badge: creation.user?.school?.name,
                            comments: creation._count?.comments || 0,
                            files: creation.image ? [{ type: 'image/jpeg', data: creation.image }] : []
                          }}
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