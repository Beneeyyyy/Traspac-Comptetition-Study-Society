import React from 'react';
import { ForumProvider } from '@/contexts/forum/ForumContext';
import { CommunityProvider } from '@/contexts/community/CommunityContext';
import ForumSection from './components/ForumSection';
import ExploreSection from './components/ExploreSection';

const CommunityPage = () => {
  return (
    <CommunityProvider>
      <ForumProvider>
        <main className="min-h-screen bg-[#0A0A0A] text-white pb-20">
          <div className="container mx-auto pt-8">
            <div className="space-y-8">
              <ExploreSection />
              <ForumSection />
            </div>
          </div>
        </main>
      </ForumProvider>
    </CommunityProvider>
  );
};

export default CommunityPage; 