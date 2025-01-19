import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import HeroSection from './exploreComponents/HeroSection'
import TopSquads from './exploreComponents/TopSquads'
import AllSquads from './exploreComponents/AllSquads'

const ExploreSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [topSquads, setTopSquads] = useState([])

  const handleCreateSquad = (newSquad) => {
    setTopSquads(prev => {
      // Add to top squads if it has more members than the last one
      const sortedSquads = [...prev]
      if (sortedSquads.length < 3 || newSquad.memberCount > sortedSquads[sortedSquads.length - 1].memberCount) {
        sortedSquads.push(newSquad)
        sortedSquads.sort((a, b) => b.memberCount - a.memberCount)
        return sortedSquads.slice(0, 3)
      }
      return prev
    })
    toast.success('Squad created successfully!')
  }

  return (
    <div className="space-y-16">
      <HeroSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <TopSquads squads={topSquads} />
      
      <AllSquads 
        onCreateSquad={handleCreateSquad}
      />
    </div>
  )
}

export default ExploreSection 