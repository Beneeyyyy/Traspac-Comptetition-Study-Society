import { useState, useEffect } from 'react'
import Navbar from '../../layouts/Navbar'
import { motion } from 'framer-motion'
import CategorySelection from './components/CategorySelection'
import ScopeSelection from './components/ScopeSelection'
import LeaderboardTitle from './components/LeaderboardTitle'
import TopThree from './components/TopThree'
import OtherTopLearners from './components/OtherTopLearners'
import UserDetailModal from './components/UserDetailModal'
import RegionCards from './components/RegionCards'
import LeaderboardHero from './components/LeaderboardHero'

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
        // Adjust the API endpoint based on active category and scope
        const endpoint = `http://localhost:3000/api/points/leaderboard/${activeCategory}/${activeScope}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const transformedData = data.map(learner => ({
          user: learner.user,
          email: learner.email,
          image: learner.image,
          points: learner.totalPoint,
          coursesCount: learner.coursesCount || 0,
          timeSpent: learner.timeSpent || "0h 0m",
          category: learner.category || "General",
          school: learner.school || "Unknown",
          region: learner.region || "Unknown"
        }));

        setTopLearners(transformedData);
      } catch (error) {
        console.error('Error fetching top learners:', error);
        setTopLearners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopLearners();
  }, [activeCategory, activeScope]);

  // Default learner template
  const defaultLearners = [
    {
      user: "Sarah Parker",
      coursesCount: 15,
      points: 980,
      timeSpent: "15h 30m",
      image: "https://ui-avatars.com/api/?name=Sarah+Parker&background=0D8ABC&color=fff",
      category: "Mathematics",
      school: "SMA Negeri 1 Jakarta",
      region: "Jakarta"
    },
    {
      user: "Michael Chen",
      coursesCount: 14,
      points: 945,
      timeSpent: "14h 45m",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=0D8ABC&color=fff",
      category: "Physics",
      school: "SMA Negeri 3 Bandung",
      region: "Bandung"
    },
    {
      user: "Anisa Wijaya",
      coursesCount: 13,
      points: 920,
      timeSpent: "13h 20m",
      image: "https://ui-avatars.com/api/?name=Anisa+Wijaya&background=0D8ABC&color=fff",
      category: "Biology",
      school: "SMA Negeri 5 Surabaya",
      region: "Surabaya"
    },
    {
      user: "David Wilson",
      coursesCount: 12,
      points: 890,
      timeSpent: "12h 15m",
      image: "https://ui-avatars.com/api/?name=David+Wilson&background=0D8ABC&color=fff",
      category: "Chemistry",
      school: "SMA Negeri 2 Medan",
      region: "Medan"
    },
    {
      user: "Putri Sari",
      coursesCount: 11,
      points: 870,
      timeSpent: "11h 45m",
      image: "https://ui-avatars.com/api/?name=Putri+Sari&background=0D8ABC&color=fff",
      category: "Mathematics",
      school: "SMA Negeri 1 Yogyakarta",
      region: "Yogyakarta"
    },
    {
      user: "Ahmad Fauzi",
      coursesCount: 11,
      points: 850,
      timeSpent: "11h 30m",
      image: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0D8ABC&color=fff",
      category: "Physics",
      school: "SMA Negeri 1 Malang",
      region: "Malang"
    },
    {
      user: "Lisa Rahman",
      coursesCount: 10,
      points: 830,
      timeSpent: "10h 45m",
      image: "https://ui-avatars.com/api/?name=Lisa+Rahman&background=0D8ABC&color=fff",
      category: "Biology",
      school: "SMA Negeri 4 Semarang",
      region: "Semarang"
    },
    {
      user: "Kevin Tan",
      coursesCount: 9,
      points: 810,
      timeSpent: "10h 15m",
      image: "https://ui-avatars.com/api/?name=Kevin+Tan&background=0D8ABC&color=fff",
      category: "Chemistry",
      school: "SMA Negeri 2 Surabaya",
      region: "Surabaya"
    },
    {
      user: "Dewi Kusuma",
      coursesCount: 9,
      points: 790,
      timeSpent: "9h 45m",
      image: "https://ui-avatars.com/api/?name=Dewi+Kusuma&background=0D8ABC&color=fff",
      category: "Mathematics",
      school: "SMA Negeri 3 Semarang",
      region: "Semarang"
    },
    {
      user: "Ryan Pratama",
      coursesCount: 8,
      points: 770,
      timeSpent: "9h 30m",
      image: "https://ui-avatars.com/api/?name=Ryan+Pratama&background=0D8ABC&color=fff",
      category: "Physics",
      school: "SMA Negeri 5 Bandung",
      region: "Bandung"
    }
  ];

  // Process display learners
  const displayLearners = topLearners.length > 0 ? [
    ...topLearners.map(learner => ({
      ...learner,
      image: learner.image?.startsWith('data:image') ? 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff` : 
        learner.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.user)}&background=0D8ABC&color=fff`
    })),
    // If we have less than 10 learners from API, fill with default learners
    ...defaultLearners.slice(topLearners.length, 10)
  ] : [
    // If no learners from API, use all default learners
    ...defaultLearners
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />
      
      <main className="pt- pb-12">
        {/* Hero Section */}
        <LeaderboardHero />

        <div className="max-w-7xl mx-auto px-4">
          {/* Category and Scope Selection */}
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

          {/* Show either region cards or leaderboard */}
          {activeScope === 'regional' && !selectedRegion ? (
            <RegionCards onRegionSelect={handleRegionSelect} />
          ) : (
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
                  displayLearners={displayLearners}
                  activeCategory={activeCategory}
                  activeScope={activeScope}
                  handleUserClick={handleUserClick}
                />

                <OtherTopLearners 
                  displayLearners={displayLearners}
                  activeCategory={activeCategory}
                  activeScope={activeScope}
                  handleUserClick={handleUserClick}
                />
              </div>
            </motion.section>
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