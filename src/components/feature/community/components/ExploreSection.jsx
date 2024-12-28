import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiClock, FiUsers, FiStar, FiBookOpen, FiTarget, FiMessageCircle, FiArrowRight, FiSearch, FiHash, FiActivity, FiCalendar } from 'react-icons/fi'

const ExploreSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'Semua Grup', icon: FiUsers },
    { id: 'active', label: 'Sedang Aktif', icon: FiActivity },
    { id: 'new', label: 'Grup Baru', icon: FiClock },
    { id: 'my', label: 'Grup Saya', icon: FiBookOpen }
  ]

  const studyGroups = [
    {
      id: 1,
      name: "Kelompok Belajar Matematika",
      topic: "Matematika",
      description: "Grup diskusi untuk membahas soal-soal matematika dan persiapan ujian",
      members: 128,
      activeMembers: 45,
      lastActive: "Baru saja",
      topics: ["Aljabar", "Geometri", "Kalkulus"],
      schedule: "Setiap Senin & Rabu",
      nextMeeting: "Senin, 19:00 WIB",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      recentDiscussions: [
        "Pembahasan soal UTBK 2023",
        "Tips mengerjakan soal cerita",
        "Latihan soal Integral"
      ]
    },
    {
      id: 2,
      name: "Grup Bahasa Inggris",
      topic: "Bahasa",
      description: "Praktik speaking dan listening bersama native speaker",
      members: 95,
      activeMembers: 32,
      lastActive: "5 menit yang lalu",
      topics: ["Speaking", "TOEFL", "Grammar"],
      schedule: "Setiap Selasa & Jumat",
      nextMeeting: "Selasa, 20:00 WIB",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
      recentDiscussions: [
        "English Speaking Club",
        "IELTS Writing Tips",
        "Daily Conversation Practice"
      ]
    },
    {
      id: 3,
      name: "Komunitas Fisika",
      topic: "Fisika",
      description: "Diskusi konsep fisika dan eksperimen virtual bersama",
      members: 76,
      activeMembers: 28,
      lastActive: "15 menit yang lalu",
      topics: ["Mekanika", "Listrik", "Termodinamika"],
      schedule: "Setiap Kamis",
      nextMeeting: "Kamis, 19:30 WIB",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
      recentDiscussions: [
        "Pembahasan Soal Olimpiade",
        "Praktikum Virtual",
        "Q&A Konsep Dasar"
      ]
    },
    {
      id: 4,
      name: "Kelompok Kimia",
      topic: "Kimia",
      description: "Belajar kimia dari dasar sampai mahir bersama tutor berpengalaman",
      members: 82,
      activeMembers: 35,
      lastActive: "30 menit yang lalu",
      topics: ["Organik", "Anorganik", "Analisis"],
      schedule: "Setiap Sabtu",
      nextMeeting: "Sabtu, 10:00 WIB",
      image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
      recentDiscussions: [
        "Praktikum Kimia Virtual",
        "Pembahasan Soal UAS",
        "Diskusi Materi Baru"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header & Search */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <category.icon className="text-lg" />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text"
                  placeholder="Cari grup belajar..."
                  className="w-64 pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20"
                />
              </div>
              <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-colors">
                Buat Grup Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Temukan Teman Belajarmu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 max-w-3xl"
          >
            Bergabung dengan kelompok belajar membantu kamu lebih memahami materi, bertukar pikiran dengan teman sebaya, dan belajar lebih efektif.
          </motion.p>
        </div>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
            >
              <div className="flex">
                {/* Left Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/10">
                      {group.topic}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/60">
                      <FiClock className="text-white/40" />
                      {group.lastActive}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {group.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/60">
                      <FiUsers className="text-white/40" />
                      <span className="text-sm">{group.members} anggota</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <FiActivity className="text-green-400" />
                      <span className="text-sm">{group.activeMembers} aktif</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <FiCalendar className="text-white/40" />
                      <span className="text-sm">{group.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <FiMessageCircle className="text-white/40" />
                      <span className="text-sm">Aktif diskusi</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white/80">Diskusi Terkini:</div>
                    {group.recentDiscussions.map((discussion, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                        <FiHash className="text-white/40" />
                        <span>{discussion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="w-48 relative">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                  <div className="absolute bottom-0 right-0 p-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full hover:from-purple-600 hover:to-blue-600 transition-colors">
                      Gabung Grup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExploreSection 