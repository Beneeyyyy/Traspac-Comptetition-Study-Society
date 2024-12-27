const ProgressCard = ({ activeSection, totalSections }) => {
  const progress = Math.round(((activeSection + 1) / totalSections) * 100);

  return (
    <div 
      className="bg-gradient-to-br pt-10 from-blue-500/10 to-purple-500/10 border border-white/[0.05] rounded-xl p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-white/80">Progress</span>
        <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {progress}%
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard; 