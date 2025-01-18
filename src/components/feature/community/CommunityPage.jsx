import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ForumProvider } from '@/contexts/forum/ForumContext';
import { CommunityProvider } from '@/contexts/community/CommunityContext';
import ExploreSection from './components/exploreComponents/ExploreSection';
import ForumSection from './components/ForumSection';

const CommunityPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/community';

  return (
    <CommunityProvider>
      <ForumProvider>
        <main className="min-h-screen bg-black text-white pb-20">
          <div className="container mx-auto pt-8">
            {isMainPage ? (
              <div className="space-y-16">
                <ExploreSection />
                <ForumSection />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </ForumProvider>
    </CommunityProvider>
  );
};

export default CommunityPage; 