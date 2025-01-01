import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { RiBookLine } from 'react-icons/ri';

export function SectionsList({ material, activeSection, onSectionChange }) {
  if (!material?.stages) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center pt-8 gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <RiBookLine className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white/90">Daftar Materi</h2>
          <p className="text-sm text-white/60">{material.stages.length} bagian materi</p>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {material.stages.map((stage, index) => {
          const isActive = index === activeSection;
          const isCompleted = index < activeSection;

          return (
            <button
              key={stage.id}
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
                    {stage.title}
                  </h3>
                  {/* Contents List */}
                  {isActive && stage.contents && (
                    <div className="mt-2 space-y-1">
                      {stage.contents.sort((a, b) => a.order - b.order).map((content, contentIndex) => (
                        <div key={contentIndex} className="text-sm text-white/50 pl-2">
                          • Content {contentIndex + 1}: {content.type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress line */}
              {index < material.stages.length - 1 && (
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