import { motion } from 'framer-motion'

export default function LeaderboardTitle({ activeCategory, activeScope }) {
  const getTitle = () => {
    if (activeCategory === 'weekly') {
      return 'Weekly Top Learners';
    }
    
    if (activeCategory === 'school') {
      return `${activeScope === 'national' ? 'National' : 'Regional'} School Rankings`;
    }
    
    return `${activeScope === 'national' ? 'National' : 'Regional'} Top Learners`;
  };

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white">{getTitle()}</h2>
    </div>
  );
} 