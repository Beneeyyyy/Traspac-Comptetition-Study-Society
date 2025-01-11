import { useState, Suspense, lazy } from 'react'
import { AnimatePresence, motion, LazyMotion, domAnimation } from 'framer-motion'
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

  // Handle like update
  const handleLikeUpdate = (creationId, liked, likeCount) => {
    setCreations(prevCreations => 
      prevCreations.map(creation => 
        creation.id === creationId 
          ? { ...creation, liked, likeCount }
          : creation
      )
    )

    // Also update selectedWork if it's the same creation
    if (selectedWork?.id === creationId) {
      setSelectedWork(prev => ({
        ...prev,
        liked,
        likeCount
      }))
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
    <LazyMotion features={domAnimation}>
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
                            work={creation}
                            index={index}
                            selectedWork={selectedWork}
                            setSelectedWork={setSelectedWork}
                            onLikeUpdate={handleLikeUpdate}
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
                        onLikeUpdate={handleLikeUpdate}
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
      </div>
    </LazyMotion>
  );
}

export default UpCreation; 