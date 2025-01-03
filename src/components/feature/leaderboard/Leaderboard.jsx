import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategorySelection from './components/CategorySelection'
import ScopeSelection from './components/ScopeSelection'
import LeaderboardTitle from './components/LeaderboardTitle'
import TopThree from './components/TopThree'
import OtherTopLearners from './components/OtherTopLearners'
import UserDetailModal from './components/UserDetailModal'
import RegionCards from './components/RegionCards'
import LeaderboardHero from './components/LeaderboardHero'
import SchoolRankings from './components/SchoolRankings'

function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [topLearners, setTopLearners] = useState([])
  const [activeCategory, setActiveCategory] = useState('weekly')
  const [activeScope, setActiveScope] = useState('national')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch top learners based on active category and scope
  useEffect(() => {
    const fetchTopLearners = async () => {
      try {
        setIsLoading(true);
        
        // If school rankings, don't fetch learners
        if (activeCategory === 'school') {
          setTopLearners([]);
          setIsLoading(false);
          return;
        }

        // Build endpoint URL based on scope
        let endpoint = `${import.meta.env.VITE_API_URL}/api/points/leaderboard/${activeCategory}`;
        if (activeScope !== 'national') {
          endpoint += `/${selectedRegion}`;
        }

        console.log('🔄 Fetching leaderboard:', {
          category: activeCategory,
          scope: activeScope,
          region: selectedRegion,
          endpoint
        });

        const response = await fetch(endpoint, {
          credentials: 'include' // Important for cookies/session
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch leaderboard');
        }

        console.log('✅ Leaderboard data:', data);
        setTopLearners(data.data);
      } catch (error) {
        console.error('❌ Error fetching top learners:', error);
        setTopLearners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopLearners();
  }, [activeCategory, activeScope, selectedRegion]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <main className="pt-4 pb-12">
        {/* Hero Section */}
        <LeaderboardHero />

        <div className="max-w-7xl mx-auto px-4">
          {/* Category Selection */}
          <div className="mb-12">
            <CategorySelection 
              activeCategory={activeCategory} 
              setActiveCategory={(category) => {
                setActiveCategory(category);
                if (category !== activeCategory) {
                  setSelectedRegion(null);
                  setActiveScope('national');
                }
              }} 
            />
            {/* Only show scope selection for non-weekly categories */}
            {activeCategory !== 'weekly' && (
              <ScopeSelection 
                activeScope={activeScope} 
                setActiveScope={setActiveScope}
                selectedRegion={selectedRegion}
                onBackToRegion={() => setSelectedRegion(null)}
              />
            )}
          </div>

          {/* Show either region cards or rankings */}
          {activeScope === 'regional' && !selectedRegion ? (
            <RegionCards onRegionSelect={handleRegionSelect} />
          ) : (
            <>
              {activeCategory === 'school' ? (
                // School Rankings
                <SchoolRankings scope={activeScope === 'regional' ? selectedRegion : activeScope} />
              ) : (
                // User Rankings (Weekly or All-time)
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-24 relative"
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-full h-[1px] top-1/3 left-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-scan" />
                    <div className="absolute w-full h-[1px] top-2/3 left-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-scan delay-150" />
                    <div className="absolute w-[1px] h-full top-0 left-1/3 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-scan-vertical" />
                    <div className="absolute w-[1px] h-full top-0 left-2/3 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-scan-vertical delay-150" />
                    <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-500/30 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-blue-500/30 rounded-tr-3xl" />
                    <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]" />
                  </div>

                  <div className="max-w-6xl mx-auto px-4">
                    <LeaderboardTitle 
                      activeCategory={activeCategory} 
                      activeScope={activeScope}
                      selectedRegion={selectedRegion}
                    />

                    <TopThree 
                      displayLearners={topLearners}
                      activeCategory={activeCategory}
                      activeScope={activeScope}
                      handleUserClick={handleUserClick}
                    />

                    <OtherTopLearners 
                      displayLearners={topLearners}
                      activeCategory={activeCategory}
                      activeScope={activeScope}
                      handleUserClick={handleUserClick}
                    />
                  </div>
                </motion.section>
              )}
            </>
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

export default Leaderboard 