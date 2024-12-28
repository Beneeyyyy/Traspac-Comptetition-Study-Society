import { useState } from 'react'
import { FiSearch, FiFilter, FiTrendingUp, FiClock, FiMessageSquare, FiHeart } from 'react-icons/fi'
import CreatePost from './Post/CreatePost'
import QuestionCard from './Post/QuestionCard'

const ForumSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  const questions = [
    {
      id: 1,
      user: {
        name: 'Budi Santoso',
        avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0D8ABC&color=fff',
        badge: 'Matematika Expert'
      },
      title: 'Cara menyelesaikan persamaan kuadrat dengan cepat?',
      content: 'Saya sering kesulitan menyelesaikan persamaan kuadrat dalam waktu singkat saat ujian. Ada tips atau trik khusus?',
      timeAgo: '10 menit yang lalu',
      votes: 12,
      answers: [
        {
          id: 1,
          user: {
            name: 'Pak Ahmad',
            avatar: 'https://ui-avatars.com/api/?name=Pak+Ahmad&background=4C51BF&color=fff',
            badge: 'Guru Matematika'
          },
          content: 'Untuk menyelesaikan persamaan kuadrat dengan cepat, berikut langkah-langkahnya:',
          timeAgo: '5 menit yang lalu',
          votes: 8,
          comments: [
            {
              id: 1,
              user: {
                name: 'Andi',
                avatar: 'https://ui-avatars.com/api/?name=Andi&background=2C5282&color=fff',
              },
              content: 'Terima kasih Pak, sangat membantu! Untuk soal yang nilai a-nya pecahan bagaimana ya?',
              timeAgo: '3 menit yang lalu',
              likes: 2
            }
          ]
        }
      ],
      views: 45,
      community: 'Matematika SMA',
      tags: ['matematika', 'aljabar', 'tips']
    },
    {
      id: 2,
      user: {
        name: 'Linda Wijaya',
        avatar: 'https://ui-avatars.com/api/?name=Linda+Wijaya&background=4C51BF&color=fff',
        badge: 'Web Developer'
      },
      title: 'Best practices untuk state management di React?',
      content: 'Saya bingung kapan harus menggunakan Redux dan kapan cukup dengan useState/useContext?',
      timeAgo: '30 menit yang lalu',
      votes: 8,
      answers: [
        {
          id: 1,
          user: {
            name: 'Alex',
            avatar: 'https://ui-avatars.com/api/?name=Alex&background=0D8ABC&color=fff',
            badge: 'Senior Developer'
          },
          content: 'Berikut adalah panduan singkat untuk memilih state management yang tepat:',
          timeAgo: '20 menit yang lalu',
          votes: 12
        }
      ],
      views: 32,
      community: 'Web Programming',
      tags: ['react', 'javascript', 'state-management']
    }
  ]

  const filters = [
    { id: 'all', label: 'Semua', icon: FiFilter },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'recent', label: 'Terbaru', icon: FiClock },
    { id: 'unanswered', label: 'Belum Dijawab', icon: FiMessageSquare },
    { id: 'following', label: 'Diikuti', icon: FiHeart }
  ]

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setSelectedFilter(filter.id)}
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
        <CreatePost />
      </div>

      {/* Questions Feed */}
      <div className="space-y-6 max-w-5xl mx-auto px-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            expandedQuestion={expandedQuestion}
            setExpandedQuestion={setExpandedQuestion}
          />
        ))}
      </div>
    </div>
  )
}

export default ForumSection 