import React from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';

const getRankColor = (rank) => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-gray-300';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-white/60';
  }
};

const LeaderboardCard = ({ rank, user, points, isCurrentUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-lg backdrop-blur-sm ${
        isCurrentUser ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5'
      }`}
    >
      {/* Rank Badge */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${getRankColor(rank)} ${
          rank <= 3 ? 'bg-white/10' : ''
        }`}>
          {rank <= 3 ? <FiAward className="w-5 h-5" /> : rank}
        </div>
      </div>

      <div className="flex items-center gap-4 pl-8">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <h3 className="font-medium text-white">
            {user.name}
            {isCurrentUser && (
              <span className="ml-2 text-sm text-blue-400">(You)</span>
            )}
          </h3>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

        {/* Points */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xl font-bold text-white">{points.toLocaleString()}</div>
          <div className="text-xs text-gray-400">points</div>
        </div>
      </div>

      {/* Progress Bar (optional, for visual interest) */}
      <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((points / 10000) * 100, 100)}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default LeaderboardCard; 