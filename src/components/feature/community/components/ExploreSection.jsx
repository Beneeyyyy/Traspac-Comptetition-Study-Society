import React from 'react'
import { useCommunity } from '../../../../contexts/community/CommunityContext'
import HeroSection from './exploreComponents/HeroSection'
import TopSquads from './exploreComponents/TopSquads'
import SquadNav from './exploreComponents/AllSquads'

// Dummy study groups data for testing
const dummyStudyGroups = [
  {
    id: 4,
    name: "JavaScript Enthusiasts",
    members: 856,
    level: "Gold",
    xp: 12500,
    description: "A community for JavaScript developers to learn, share, and grow together. Join us to master modern JavaScript!",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=500",
    banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=500",
    createdAt: "2023-10-15"
  },
  {
    id: 5,
    name: "Python Developers Club",
    members: 1024,
    level: "Diamond",
    xp: 28000,
    description: "Learn Python programming from basics to advanced. Regular coding challenges and project collaborations!",
    image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?auto=format&fit=crop&q=80&w=500",
    banner: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=500",
    createdAt: "2023-09-20"
  },
  {
    id: 6,
    name: "Mobile App Creators",
    members: 567,
    level: "Silver",
    xp: 8900,
    description: "Community for mobile app developers. Share your experience in React Native, Flutter, and native development.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=500",
    banner: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500",
    createdAt: "2023-10-01"
  }
]

const ExploreSection = () => {
  const { studyGroups = [], joinStudyGroup, leaveStudyGroup } = useCommunity() || {}
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortOption, setSortOption] = React.useState('all')
  const [localStudyGroups, setLocalStudyGroups] = React.useState(dummyStudyGroups)

  const handleCreateSquad = (squadData) => {
    const newSquad = {
      id: localStudyGroups.length + 1,
      name: squadData.name,
      description: squadData.description,
      banner: squadData.banner,
      image: squadData.image,
      members: 1,
      level: "Bronze",
      xp: 0,
      createdAt: new Date().toISOString()
    }
    
    setLocalStudyGroups(prev => [newSquad, ...prev])
  }

  const sortOptions = [
    { id: 'all', label: 'Semua', icon: '🔍' },
    { id: 'most_members', label: 'User Terbanyak', icon: '👥' },
    { id: 'newest', label: 'Terbaru', icon: '🆕' },
    { id: 'most_points', label: 'Point Terbanyak', icon: '🏆' }
  ]

  const topCommunities = [
    {
      id: 1,
      name: "Web Development Masters",
      members: 1250,
      level: "Diamond",
      xp: 25000,
      category: "programming",
      description: "Join our elite web development community! Master modern web technologies, collaborate on real projects, and accelerate your development career with expert guidance.",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 2,
      name: "Data Science Hub",
      members: 980,
      level: "Platinum",
      xp: 18500,
      category: "science",
      description: "Dive into the world of data science! Learn from industry experts, work on real-world datasets, and develop your analytical skills in our supportive community.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 3,
      name: "UI/UX Design Club",
      members: 850,
      level: "Gold",
      xp: 15000,
      category: "design",
      description: "Create beautiful and functional designs! Share your work, get feedback from fellow designers, and stay updated with the latest UI/UX trends and tools.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=500",
      banner: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?auto=format&fit=crop&q=80&w=500"
    }
  ]

  const filteredAndSortedGroups = React.useMemo(() => {
    let filtered = localStudyGroups.filter(group => 
      group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    switch (sortOption) {
      case 'most_members':
        filtered.sort((a, b) => (b.members || 0) - (a.members || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'most_points':
        filtered.sort((a, b) => (b.xp || 0) - (a.xp || 0))
        break
      default:
        break
    }

    return filtered
  }, [localStudyGroups, searchQuery, sortOption])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TopSquads topCommunities={topCommunities} />
      <SquadNav 
        studyGroups={filteredAndSortedGroups} 
        selectedSort={sortOption}
        setSelectedSort={setSortOption}
        sortOptions={sortOptions}
        onCreateSquad={handleCreateSquad}
      />
    </div>
  )
}

export default ExploreSection 