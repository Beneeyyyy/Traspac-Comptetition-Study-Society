import React, { Suspense, lazy } from 'react'
import { FiSearch, FiFilter, FiTrendingUp, FiClock, FiMessageSquare, FiHeart } from 'react-icons/fi'
import { useDebounce } from '../../../../hooks/useDebounce'
import QuestionCardSkeleton from './forumComponents/skeletons/QuestionCardSkeleton'
import { useCommunity } from '../context/CommunityContext'

// Lazy load components
const CreatePost = lazy(() => import('./forumComponents/Post/CreatePost'))
const QuestionCard = lazy(() => import('./forumComponents/Post/QuestionCard'))

const ForumSection = () => {
  const { questions = [], isLoading } = useCommunity() || {}
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedFilter, setSelectedFilter] = React.useState('all')
  const [expandedQuestion, setExpandedQuestion] = React.useState(null)

  // Debounce search query to prevent excessive filtering
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Memoize filters to prevent unnecessary re-renders
  const filters = React.useMemo(() => [
    { id: 'all', label: 'Semua', icon: FiFilter },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'recent', label: 'Terbaru', icon: FiClock },
    { id: 'unanswered', label: 'Belum Dijawab', icon: FiMessageSquare },
    { id: 'following', label: 'Diikuti', icon: FiHeart }
  ], [])

  // Memoize filtered questions
  const filteredQuestions = React.useMemo(() => {
    if (!questions || !debouncedSearch) return questions || []
    return questions.filter(question => 
      question.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      question.content?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      question.tags?.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
    )
  }, [questions, debouncedSearch])

  // Memoize search handler
  const handleSearch = React.useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  // Memoize filter handler
  const handleFilterChange = React.useCallback((filterId) => {
    setSelectedFilter(filterId)
  }, [])

  return (
    <div className="space-y-12">
      {/* Forum Header */}
      <div className="flex flex-col gap-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Forum Tanya Jawab
          </h2>
          <p className="text-lg text-white/60">
            Diskusikan pertanyaanmu dan bantu jawab pertanyaan lainnya
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto w-full px-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Cari pertanyaan..."
              className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`h-11 px-5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap ${
                  selectedFilter === filter.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <filter.icon className="text-lg" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Component */}
      <div className="max-w-5xl mx-auto px-4">
        <Suspense fallback={<div className="h-32 bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />}>
          <CreatePost />
        </Suspense>
      </div>

      {/* Questions Feed */}
      <div className="space-y-6 max-w-5xl mx-auto px-4">
        {isLoading ? (
          // Show skeleton loading while fetching data
          <>
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
          </>
        ) : !filteredQuestions || filteredQuestions.length === 0 ? (
          // Show empty state when no questions match the filter
          <div className="text-center py-12">
            <p className="text-lg text-white/40">Tidak ada pertanyaan ditemukan</p>
          </div>
        ) : (
          // Show actual questions when data is loaded
          filteredQuestions.map((question) => (
            <Suspense 
              key={question.id} 
              fallback={<QuestionCardSkeleton />}
            >
              <QuestionCard
                question={question}
                expandedQuestion={expandedQuestion}
                setExpandedQuestion={setExpandedQuestion}
              />
            </Suspense>
          ))
        )}
      </div>
    </div>
  )
}

export default ForumSection 