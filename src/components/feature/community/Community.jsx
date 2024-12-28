import { useState } from 'react'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import HeroSection from '../../layouts/HeroSection'
import ForumSection from './components/ForumSection'
import ExploreSection from './components/ExploreSection'
import { FiUsers, FiMessageSquare, FiAward } from 'react-icons/fi'
import iconCommunity from '../../../assets/images/community/iconCommunity.svg'
import { CommunityProvider } from './context/CommunityContext'

const Community = () => {
  const [activeSection, setActiveSection] = useState('forum')

  const communityStats = [
    { icon: FiUsers, value: '2,500+', label: 'Total Anggota' },
    { icon: FiMessageSquare, value: '100+', label: 'Diskusi per Hari' },
    { icon: FiAward, value: '95%', label: 'Tingkat Kepuasan' }
  ]

  const handleExploreClick = () => {
    setActiveSection('explore')
  }

  return (
    <CommunityProvider>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Background Effects */}
          <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-black to-transparent" />
          </div>

          <div className="relative container max-w-screen-xl mx-auto px-6">
            {activeSection === 'forum' && (
              <HeroSection 
                type="community"
                icon={iconCommunity}
                stats={communityStats}
                showFilters={false}
                className="mb-20"
                onExploreClick={handleExploreClick}
              />
            )}

            {/* Content Sections */}
            {activeSection === 'forum' ? (
              <ForumSection />
            ) : (
              <ExploreSection />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </CommunityProvider>
  )
}

export default Community 