import { FiArrowLeft, FiClock, FiAward } from 'react-icons/fi';
import { RiBrainLine, RiFlashlightLine } from 'react-icons/ri';

const TopNavigation = ({ section, onBack }) => {
  return (
    <div className="fixed top-20 left-0 right-0 z-30 bg-black/80 backdrop-blur-lg border-b border-white/[0.05]">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Kembali</span>
            </button>
            <div className="h-4 w-px bg-white/[0.05]" />
            <h1
              className="text-lg font-medium text-white/80"
            >
              {section.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-white/60">
              <FiClock className="w-4 h-4" />
              <span>{section.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <FiAward className="w-4 h-4" />
              <span>{section.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <RiBrainLine className="w-4 h-4" />
              <span>{section.level}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <RiFlashlightLine className="w-4 h-4" />
              <span>{section.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation; 