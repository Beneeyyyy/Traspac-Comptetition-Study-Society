import { FiArrowRight, FiZap, FiLock, FiCheck } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const StageCard = ({ stage, material, onComplete, onSelect, stageIndex }) => {
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  
  // Calculate XP for this stage
  const calculateStageXP = () => {
    const totalXP = material.total_xp || material.xp_reward || 0;
    const baseXP = Math.floor(totalXP / material.stages.length);
    
    // Add remainder to last stage
    if (stageIndex === material.stages.length - 1) {
      const remainder = totalXP % material.stages.length;
      return baseXP + remainder;
    }
    
    return baseXP;
  };

  const stageXP = calculateStageXP();

  const handleStartLearning = (e) => {
    e.stopPropagation();
    // Navigate to theory step with the correct stage index and force refresh
    const url = `/courses/${categoryId}/subcategory/${subcategoryId}/learn/${material.id}/theory?stage=${stageIndex}`;
    window.location.href = url;
  };

  const handleClick = () => {
    if (stage.isLocked) return;
    if (stage.isCurrent) {
      handleStartLearning();
    } else {
      onSelect?.();
    }
  };

  return (
    <div className="relative flex items-start gap-8">
      {/* Stage Marker */}
      <div className="relative z-10 flex-shrink-0 mt-6">
        <div className={`
          w-5 h-5 rounded-full transition-colors flex items-center justify-center
          ${stage.isCurrent 
            ? 'bg-blue-500 ring-4 ring-blue-500/20' 
            : stage.isCompleted
              ? 'bg-green-500'
              : 'bg-white/10'}
        `}>
          {stage.isCompleted && <FiCheck className="w-3 h-3 text-white" />}
        </div>
      </div>

      {/* Stage Card */}
      <div 
        onClick={handleClick}
        className={`
          flex-grow relative overflow-hidden rounded-2xl border transition-all duration-200
          ${stage.isCurrent 
            ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 transform hover:scale-[1.02]' 
            : stage.isCompleted
              ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-transparent border-green-500/20 hover:border-green-500/40 transform hover:scale-[1.01]'
              : stage.isLocked
                ? 'bg-white/[0.02] border-white/[0.05] cursor-not-allowed opacity-50'
                : 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent border-white/[0.05] hover:border-white/20 cursor-pointer'}
      `}>
        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <h3 className="text-xl font-medium flex items-center gap-3">
                {stage.title}
                {stage.isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    Aktif
                  </span>
                )}
                {stage.isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                    <FiCheck className="w-3 h-3" />
                    Selesai
                  </span>
                )}
                {stage.isLocked && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/40">
                    <FiLock className="w-4 h-4" />
                  </span>
                )}
              </h3>
              <p className="text-base text-white/60">{stage.description}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              stage.isCompleted ? 'bg-green-500/10' : 'bg-white/5'
            }`}>
              <FiZap className={`w-5 h-5 ${stage.isCompleted ? 'text-green-400' : 'text-yellow-400'}`} />
              <span className={`${stage.isCompleted ? 'text-green-400' : 'text-white/60'}`}>{stageXP} XP</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {stage.isCurrent && (
              <button
                onClick={handleStartLearning}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="font-medium text-white">Mulai Belajar</span>
                <FiArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {stage.isCompleted && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">Stage Selesai</span>
              </div>
            )}
            {!stage.isCompleted && !stage.isCurrent && !stage.isLocked && (
              <button
                onClick={handleStartLearning}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="font-medium text-white">Mulai Belajar</span>
                <FiArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            <div className="text-sm text-white/40 ml-auto">
              Estimasi: {stage.time}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="h-full bg-white/10">
              <div 
                className={`h-full transition-all duration-500 ${
                  stage.isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : stage.isCurrent 
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500' 
                      : stage.isLocked
                        ? 'bg-white/5'
                        : 'bg-gradient-to-r from-blue-500/50 to-purple-500/50'
                }`}
                style={{ width: `${stage.isCompleted ? 100 : stage.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Overlay for locked stages */}
        {stage.isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white/40 flex items-center gap-2">
              <FiLock className="w-6 h-6" />
              <span>Selesaikan stage sebelumnya</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageCard; 