import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { RiBookLine } from 'react-icons/ri';

export function SectionsList({ sections, activeSection, onSectionChange }) {
  return (
    <div className="space-y-6">
      {/* Headxer */}
      <div className="flex items-center pt-8 gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <RiBookLine className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white/90">Daftar Materi</h2>
          <p className="text-sm text-white/60">{sections.length} bagian materi</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section, index) => {
          const isActive = index === activeSection;
          const isCompleted = index < activeSection;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(index)}
              className={`
                w-full p-3 rounded-xl border transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/10' 
                  : 'border-transparent hover:border-white/5 hover:bg-white/5'
                }
                group relative
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isActive ? 'bg-blue-500/20' : 'bg-white/5'}
                  ${isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-white/40'}
                `}>
                  {isCompleted ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : (
                    <FiCircle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`
                    font-medium transition-colors
                    ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'}
                  `}>
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-white/40">{section.duration}</span>
                    <span className="text-sm text-white/40">•</span>
                    <span className="text-sm text-yellow-400/80">{section.xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Progress line */}
              {index < sections.length - 1 && (
                <div className="absolute left-[1.625rem] top-12 bottom-0 w-px bg-white/5">
                  <div 
                    className="absolute top-0 w-full bg-blue-400/50 transition-all duration-500"
                    style={{ 
                      height: isCompleted ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SectionsList; 