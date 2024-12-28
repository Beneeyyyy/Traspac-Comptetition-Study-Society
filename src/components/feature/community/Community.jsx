import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import HeroSection from '../../layouts/HeroSection'
import ForumSection from './components/ForumSection'
import { FiUsers, FiMessageSquare, FiAward } from 'react-icons/fi'
import iconCommunity from '../../../assets/images/community/iconCommunity.svg'

const Community = () => {
  const communityStats = [
    { icon: FiUsers, value: '2,500+', label: 'Total Anggota' },
    { icon: FiMessageSquare, value: '100+', label: 'Diskusi per Hari' },
    { icon: FiAward, value: '95%', label: 'Tingkat Kepuasan' }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Background Effects */}
        <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-black to-transparent" />
        </div>

        <div className="relative container max-w-screen-xl mx-auto px-6">
          <HeroSection 
            type="community"
            icon={iconCommunity}
            stats={communityStats}
            showFilters={false}
            className="mb-20"
          />
          <ForumSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Community 