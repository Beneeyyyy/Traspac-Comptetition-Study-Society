import { FiCheckCircle, FiCircle, FiLock } from 'react-icons/fi';
import { RiBookLine } from 'react-icons/ri';

export function SectionsList({ material, activeSection, onSectionChange, materialProgress, completedStages, stageProgress }) {
  if (!material?.stages) return null;

  // Helper function to check if all previous stages are completed
  const areAllPreviousStagesCompleted = (stageIndex) => {
    if (stageIndex === 0) return true;
    for (let i = 0; i < stageIndex; i++) {
      if (!completedStages?.has(i)) return false;
    }
    return true;
  };

  // Sort completedStages array to get the highest completed stage
  const sortedCompletedStages = Array.from(completedStages || []).sort((a, b) => b - a);
  const highestCompletedStage = Math.max(...Array.from(completedStages || []), -1);

  // Calculate highest accessible stage (next stage after highest completed)
  const highestAccessibleStage = Math.max(
    activeSection,
    highestCompletedStage + 1
  );

  console.log('Stage Access Debug:', {
    completedStages: Array.from(completedStages || []),
    highestCompletedStage,
    highestAccessibleStage,
    activeSection
  });

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
          // Get stage progress
          const stageProgressData = typeof stageProgress?.[index] === 'object' 
            ? stageProgress[index]
            : { progress: stageProgress?.[index] || 0 };

          // Determine stage status
          const isCompleted = completedStages?.has(index) || stageProgressData.progress === 100;
          const isActive = index === activeSection;
          const allPreviousCompleted = areAllPreviousStagesCompleted(index);
          const isLocked = !isCompleted && !isActive && !allPreviousCompleted;
          const isNextStage = !isCompleted && allPreviousCompleted && index === highestCompletedStage + 1;

          console.log(`Stage ${index} Status:`, {
            isActive,
            isCompleted,
            allPreviousCompleted,
            isLocked,
            isNextStage,
            progress: stageProgressData.progress,
            completedStages: Array.from(completedStages || [])
          });

          return (
            <button
              key={stage.id}
              onClick={() => !isLocked && onSectionChange(index)}
              disabled={isLocked}
              className={`
                w-full p-3 rounded-xl border transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/10' 
                  : isLocked
                    ? 'border-transparent opacity-40 cursor-not-allowed'
                    : isNextStage
                      ? 'border-white/10 bg-gradient-to-r from-green-500/5 to-blue-500/5 hover:from-green-500/10 hover:to-blue-500/10'
                      : isCompleted
                        ? 'bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20'
                        : 'border-transparent hover:border-white/5 hover:bg-white/5'
                }
                group relative
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isActive ? 'bg-blue-500/20' : isNextStage ? 'bg-green-500/20' : 'bg-white/5'}
                  ${isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : isNextStage ? 'text-green-400' : 'text-white/40'}
                `}>
                  {isCompleted ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : isLocked ? (
                    <FiLock className="w-4 h-4" />
                  ) : (
                    <FiCircle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`
                    font-medium transition-colors flex items-center gap-2
                    ${isActive ? 'text-white' : isNextStage ? 'text-green-400' : 'text-white/70 group-hover:text-white/90'}
                  `}>
                    {stage.title}
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        Aktif
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        Selesai
                      </span>
                    )}
                    {isNextStage && !isActive && !isCompleted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        Terbuka
                      </span>
                    )}
                  </h3>
                  {/* Progress Bar */}
                  {!isLocked && (
                    <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${stageProgressData.progress}%` }}
                      />
                    </div>
                  )}
                  {/* Contents List */}
                  {isActive && stage.contents && (
                    <div className="mt-2 space-y-1">
                      {Array.isArray(stage.contents) 
                        ? stage.contents
                            .sort((a, b) => a.order - b.order)
                            .map((content, contentIndex) => (
                              <div key={contentIndex} className="text-sm text-white/50 pl-2">
                                • Content {contentIndex + 1}: {content.type}
                              </div>
                            ))
                        : null
                      }
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