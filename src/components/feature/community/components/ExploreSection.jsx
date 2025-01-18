import React, { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import AllSquads from './exploreComponents/AllSquads'
import HeroSection from './exploreComponents/HeroSection'
import TopSquads from './exploreComponents/TopSquads'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ExploreSection = () => {
  const [squads, setSquads] = useState([])
  const [topSquads, setTopSquads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchSquads = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filter !== 'all') params.append('filter', filter)

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/squads?${params.toString()}`,
        { withCredentials: true }
      )

      console.log('Fetched squads:', response.data)
      setSquads(response.data)
      
      // Set top 3 squads based on member count
      const sortedSquads = [...response.data].sort((a, b) => b.memberCount - a.memberCount)
      setTopSquads(sortedSquads.slice(0, 3))
      
      setError(null)
    } catch (error) {
      console.error('Error fetching squads:', error)
      setError('Failed to fetch squads')
      toast.error('Failed to load squads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSquads()
  }, [searchQuery, filter])

  const handleCreateSquad = async (newSquad) => {
    setSquads(prev => [newSquad, ...prev])
  }

  return (
    <div className="min-h-screen bg-black mt-20">
      {/* Hero Section */}
      <div className="border-b border-gray-800">
        <HeroSection onSearch={setSearchQuery} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Squads */}
        {!loading && !error && topSquads.length > 0 && (
          <div className="mb-12">
            <TopSquads squads={topSquads} />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filter & Create */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">All Learning Squads</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Squads</option>
              <option value="public">Public Squads</option>
              <option value="private">Private Squads</option>
            </select>
          </div>

          {/* Squads Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading squads...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={fetchSquads}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <AllSquads 
              studyGroups={squads || []} 
              onCreateSquad={handleCreateSquad} 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExploreSection 