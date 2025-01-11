import React from 'react';
import { motion } from 'framer-motion';

const timeframes = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'alltime', label: 'All Time' }
];

const TimeframeSelector = ({ timeframe, onChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-lg p-1">
        {timeframes.map(({ id, label }) => (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              timeframe === id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {timeframe === id && (
              <motion.div
                layoutId="timeframe-indicator"
                className="absolute inset-0 bg-blue-500/20 rounded-md"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector; 