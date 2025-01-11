import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import LeaderboardHero from './components/LeaderboardHero';
import TopThree from './components/TopThree';
import LeaderboardTitle from './components/LeaderboardTitle';
import LeaderboardSkeleton from './components/LeaderboardSkeleton';
import { getLeaderboard } from '../../../services/leaderboardService';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('weekly');
  const [activeScope, setActiveScope] = useState('national');
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboardData(data);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleUserClick = (user) => {
    // Handle user click - can be implemented later for profile viewing
    console.log('User clicked:', user);
  };

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <LeaderboardHero />
      
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <LeaderboardTitle 
          activeCategory={activeCategory}
          activeScope={activeScope}
          selectedRegion={selectedRegion}
        />

        <TopThree 
          displayLearners={leaderboardData}
          activeCategory={activeCategory}
          activeScope={activeScope}
          handleUserClick={handleUserClick}
        />

        <div className="mt-12 space-y-4">
          {leaderboardData.slice(3).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg backdrop-blur-sm ${
                entry.user?.id === user?.id ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center font-medium text-white/60">
                  {index + 4}
                </div>
                
                <div className="flex-shrink-0">
                  <img
                    src={entry.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user)}`}
                    alt={entry.user}
                    className="w-12 h-12 rounded-full"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="font-medium text-white">
                    {entry.user}
                    {entry.user?.id === user?.id && (
                      <span className="ml-2 text-sm text-blue-400">(You)</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{entry.school?.name || 'Unknown School'}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-xl font-bold text-white">
                    {(entry.points || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard; 