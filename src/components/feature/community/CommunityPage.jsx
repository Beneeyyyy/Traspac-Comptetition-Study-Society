import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../layouts/Footer'
import HeroSection from '../../layouts/HeroSection'
import ForumSection from './components/ForumSection'
import { FiUsers, FiMessageSquare, FiAward } from 'react-icons/fi'
import iconCommunity from '../../../assets/images/community/iconCommunityFront.svg'
import { CommunityProvider } from './context/CommunityContext'
import ExploreSection from './components/ExploreSection'

const CommunityPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(location.pathname === '/community/explore' ? 'explore' : 'forum')

  useEffect(() => {
    if (location.pathname === '/community/explore') {
      setActiveSection('explore')
    } else if (location.pathname === '/community') {
      setActiveSection('forum')
    }
  }, [location.pathname])

  const communityStats = [
    { icon: FiUsers, value: '2,500+', label: 'Total Anggota' },
    { icon: FiMessageSquare, value: '100+', label: 'Diskusi per Hari' },
    { icon: FiAward, value: '95%', label: 'Tingkat Kepuasan' }
  ]

  const handleExploreClick = () => {
    setActiveSection('explore')
    navigate('/community/explore')
  }

  return (
    <CommunityProvider>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <main className="flex-1">
          {/* Background Effects */}
          <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-black to-transparent" />
          </div>

          <div className="relative container max-w-screen-xl mx-auto px-6">
            <div>
              {activeSection === 'forum' ? (
                <>
                  <HeroSection 
                    type="community"
                    icon={iconCommunity}
                    stats={communityStats}
                    showFilters={false}
                    className="mb-20"
                    onExploreClick={handleExploreClick}
                  />
                  <ForumSection />
                </>
              ) : (
                <ExploreSection />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CommunityProvider>
  )
}

export default CommunityPage 