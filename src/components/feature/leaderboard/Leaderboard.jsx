import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import LeaderboardCard from './components/LeaderboardCard';
import LeaderboardSkeleton from './components/LeaderboardSkeleton';
import { getLeaderboard } from '../../../services/leaderboardService';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      className="max-w-4xl mx-auto p-4 space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">
          See how you rank among other learners in the community
        </p>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((entry, index) => (
          <LeaderboardCard
            key={entry.id}
            rank={index + 1}
            user={entry.user}
            points={entry.points}
            isCurrentUser={entry.user.id === user?.id}
          />
        ))}
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>No leaderboard data available yet.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard; 