import { motion } from 'framer-motion'

export default function LeaderboardTitle({ activeCategory, activeScope, selectedRegion }) {
  const getTitle = () => {
    if (activeCategory === 'weekly') {
      return 'Weekly Top Learners';
    }
    
    if (activeCategory === 'school') {
      if (activeScope === 'national') {
        return 'National School Rankings';
      }
      return selectedRegion ? `School Rankings - ${selectedRegion}` : 'Regional School Rankings';
    }
    
    if (activeScope === 'national') {
      return 'National Top Learners';
    }
    
    return selectedRegion ? `Top Learners - ${selectedRegion}` : 'Regional Top Learners';
  };

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white">{getTitle()}</h2>
    </div>
  );
} 