import { FiArrowLeft, FiClock, FiAward } from 'react-icons/fi';
import { RiBrainLine } from 'react-icons/ri';

const TopNavigation = ({ section, onBack, show, material }) => {
  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${show ? 'translate-y-0' : '-translate-y-full'}
    `}>
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

            {/* XP Reward */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <FiAward className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">XP Reward</p>
                <p className="text-sm text-white/60">{material?.xp_reward || 0} XP</p>
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