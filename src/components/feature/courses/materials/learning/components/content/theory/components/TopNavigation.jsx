import { FiArrowLeft, FiClock, FiZap } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../../../../../contexts/AuthContext';

const TopNavigation = ({ section, onBack, show, material, earnedPoints, completedStages = [] }) => {
  const { user } = useAuth();
  console.log('🔍 TopNavigation Props:', {
    material,
    earnedPoints,
    completedStages,
    section
  });

  const [showPointNotification, setShowPointNotification] = useState(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);

  // Show notification when points are earned
  useEffect(() => {
    if (earnedPoints > 0 && earnedPoints !== lastEarnedPoints) {
      setLastEarnedPoints(earnedPoints);
      setShowPointNotification(true);
      
      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowPointNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [earnedPoints]);

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${show ? 'translate-y-0' : '-translate-y-full'}
    `}>
      {/* Point Notification */}
      <div className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-4
        px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20
        border border-yellow-500/20 backdrop-blur-sm
        transition-all duration-300 transform
        ${showPointNotification ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
      `}>
        <div className="flex items-center gap-3">
          <FiZap className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">
            +{earnedPoints} XP Diperoleh!
          </span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="h-20 bg-black/80 backdrop-blur-lg border-b border-white/[0.05]">
        <div className="h-full max-w-[2000px] mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Left Side - Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-medium text-white">
                {section?.title || 'Loading...'}
              </h2>
            </div>
          </div>

          {/* Right Side - Stats */}
          <div className="flex items-center gap-6">
            {/* Stage XP */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <FiZap className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Stage XP</p>
                <p className="text-sm text-white/60">{earnedPoints} XP</p>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <FiClock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Estimasi</p>
                <p className="text-sm text-white/60">{material?.estimated_time || 0} menit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TopNavigation };
export default TopNavigation; 