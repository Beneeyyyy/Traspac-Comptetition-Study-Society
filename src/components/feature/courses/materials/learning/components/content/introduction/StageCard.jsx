import { FiArrowRight, FiZap, FiLock } from 'react-icons/fi';

const StageCard = ({ stage, onComplete, material }) => {
  // Calculate XP per stage evenly with remainder handling
  const calculateStageXP = () => {
    if (!material?.total_xp || !material?.stages?.length) return 0;
    
    const baseXP = Math.floor(material.total_xp / material.stages.length);
    const remainder = material.total_xp % material.stages.length;
    
    // Get stage index (order - 1 karena order dimulai dari 1)
    const stageIndex = stage.order - 1;
    
    // Jika ini stage terakhir, tambahkan sisa pembagian
    if (stageIndex === material.stages.length - 1) {
      return baseXP + remainder;
    }
    
    return baseXP;
  };

  const stageXP = calculateStageXP();
  const isLocked = stage.status === 'locked';
  const isCurrent = stage.status === 'current';
  const isCompleted = stage.status === 'completed';

  return (
    <div className="relative flex items-start gap-8">
      {/* Stage Marker */}
      <div className="relative z-10 flex-shrink-0 mt-6">
        <div className={`
          w-5 h-5 rounded-full transition-colors
          ${isCurrent 
            ? 'bg-blue-500 ring-4 ring-blue-500/20' 
            : isCompleted
              ? 'bg-green-500'
              : 'bg-white/10'}
        `} />
      </div>

      {/* Stage Card */}
      <div className={`
        flex-grow relative overflow-hidden rounded-2xl border transition-colors
        ${isCurrent 
          ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border-blue-500/20 hover:border-blue-500/40' 
          : `bg-white/[0.02] border-white/[0.05] ${stage.opacity || ''}`}
      `}>
        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <h3 className="text-xl font-medium flex items-center gap-3">
                {stage.title}
                {isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    Aktif
                  </span>
                )}
                {isLocked && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/40">
                    <FiLock className="w-4 h-4" />
                  </span>
                )}
              </h3>
              <p className="text-base text-white/60">{stage.description}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
              <FiZap className="w-5 h-5 text-yellow-400" />
              <span className="text-white/60">{stageXP} XP</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isCurrent && (
              <button
                onClick={onComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-colors group"
              >
                <span className="font-medium">Mulai Belajar</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            <div className="text-sm text-white/40 ml-auto">
              Estimasi: {stage.time}
            </div>
          </div>

          {isCurrent && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50" />
          )}
        </div>

        {/* Overlay for locked stages */}
        {isLocked && (
          <div 
            className="absolute inset-0 bg-black transition-opacity" 
            style={{ opacity: stage.darknessLevel / 100 }}
          />
        )}
      </div>
    </div>
  );
};

export default StageCard; 