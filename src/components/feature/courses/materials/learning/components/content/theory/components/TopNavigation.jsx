import { FiArrowLeft, FiClock, FiAward, FiX } from 'react-icons/fi';
import { RiBrainLine, RiFlashlightLine } from 'react-icons/ri';

function TopNavigation({ section, onBack, onClose, show = true }) {
  return (
    <div className={`
      fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-lg border-b border-white/[0.05] h-40
      transition-all duration-300 
      ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
    `}>
      <div className="max-w-[1920px] mx-auto px-6 py-10 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Back Buctton & Title */}
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="group relative flex items-center justify-center w-20 h-20"
          >
            {/* Static Glow Effect */}
            <div className="absolute inset-0">
              <div className="absolute -inset-4 bg-red-500/15 blur-2xl rounded-full" />
            </div>
            
            {/* Icon Only */}
            <FiX className="w-12 h-12 text-red-700 group-hover:text-red-500 transition-all duration-300 group-hover:rotate-90 relative" />
          </button>

          {/* Meta Info */}
          <div className="flex items-center gap-6">
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
}

export { TopNavigation };
export default TopNavigation; 