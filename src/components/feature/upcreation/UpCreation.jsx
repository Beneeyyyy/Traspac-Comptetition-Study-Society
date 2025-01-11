import { useState, Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import SkeletonCard from './components/SkeletonCard'

// Lazy load components
const WorkCard = lazy(() => import('./components/WorkCard'))
const WorkDetail = lazy(() => import('./components/WorkDetail'))
const UploadForm = lazy(() => import('./components/UploadForm'))

function UpCreation() {
  const [isUploadMode, setIsUploadMode] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const [creations, setCreations] = useState([])
  const [error, setError] = useState(null)

  // Fetch creations on mount and when filters change
  useEffect(() => {
    const fetchCreations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategory !== 'All') params.append('category', selectedCategory)

        const response = await axios.get(`/api/creations?${params.toString()}`, {
          withCredentials: true
        })

        // Ensure creations is always an array
        if (response.data && Array.isArray(response.data)) {
          setCreations(response.data)
        } else {
          console.error('Invalid creations data:', response.data)
          setCreations([])
          setError('Failed to load creations: Invalid data format')
        }
      } catch (err) {
        console.error('Error fetching creations:', err)
        setError(err.response?.data?.message || 'Failed to load creations')
        setCreations([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreations()
  }, [searchQuery, selectedCategory])

  // Handle like update
  const handleLikeUpdate = async (creationId, liked) => {
    try {
      const response = await axios.post(`/api/creations/${creationId}/like`, {
        liked
      }, {
        withCredentials: true
      })

      if (response.data) {
        setCreations(prevCreations => 
          prevCreations.map(creation => 
            creation.id === creationId 
              ? { ...creation, liked: response.data.liked, likeCount: response.data.likeCount }
              : creation
          )
        )

        // Also update selectedWork if it's the same creation
        if (selectedWork?.id === creationId) {
          setSelectedWork(prev => ({
            ...prev,
            liked: response.data.liked,
            likeCount: response.data.likeCount
          }))
        }
      }
    } catch (err) {
      console.error('Error updating like:', err)
      setError(err.response?.data?.message || 'Failed to update like')
    }
  }

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
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  ) : creations.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-400">No creations found</p>
                    </div>
                  ) : (
                    creations.map((work, index) => (
                      <Suspense key={work.id} fallback={<SkeletonCard />}>
                        <WorkCard
                          work={work}
                          index={index}
                          selectedWork={selectedWork}
                          setSelectedWork={setSelectedWork}
                          onLikeUpdate={handleLikeUpdate}
                        />
                      </Suspense>
                    ))
                  )}
                </motion.div>

                <AnimatePresence>
                  {selectedWork && (
                    <Suspense fallback={null}>
                      <WorkDetail
                        work={selectedWork}
                        setSelectedWork={setSelectedWork}
                        onLikeUpdate={handleLikeUpdate}
                      />
                    </Suspense>
                  )}
                </AnimatePresence>
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
    </div>
  )
}

export default UpCreation 