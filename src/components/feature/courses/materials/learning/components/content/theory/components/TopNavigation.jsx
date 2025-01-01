import { FiArrowLeft, FiClock, FiAward, FiX } from 'react-icons/fi';
import { RiBrainLine, RiFlashlightLine } from 'react-icons/ri';

const TopNavigation = ({ section, onBack, show }) => {
  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${show ? 'translate-y-0' : '-translate-y-full'}
    `}>
      {/* Top Bar */}
      <div className="h-20 bg-black/80 backdrop-blur-lg border-b border-white/[0.05]">
        <div className="h-full max-w-[2000px] mx-auto px-4 lg:px-8 flex items-center justify-between">
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
              <p className="text-sm text-white/60">
                {section?.description || 'Memuat konten pembelajaran...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TopNavigation };
export default TopNavigation; 