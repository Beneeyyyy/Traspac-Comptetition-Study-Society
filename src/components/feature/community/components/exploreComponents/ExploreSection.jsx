import React from 'react';
import HeroSection from './HeroSection';
import TopSquads from './TopSquads';
import AllSquads from './AllSquads';
import { useSquads } from '@/contexts/community/CommunityContext';

const ExploreSection = () => {
  const { squads, loading, error } = useSquads();

  const handleSearch = (query) => {
    // Handle search functionality
    console.log('Searching for:', query);
  };

  const handleCreateSquad = (newSquad) => {
    // Handle squad creation
    console.log('New squad created:', newSquad);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section with Search */}
      <HeroSection onSearch={handleSearch} />

      {/* Top Squads Section */}
      <TopSquads squads={squads?.slice(0, 3)} />

      {/* All Squads Section */}
      <AllSquads 
        studyGroups={squads} 
        onCreateSquad={handleCreateSquad}
      />
    </div>
  );
};

export default ExploreSection; 