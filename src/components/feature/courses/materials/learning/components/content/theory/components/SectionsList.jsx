const SectionsList = ({ sections, activeSection, onSectionChange }) => {
  return (
    <div className="space-y-2">
      {sections.map((section, index) => {
        const isActive = index === activeSection;
        const isCompleted = index < activeSection;
        const isLocked = index > activeSection + 1;

        return (
          <button
            key={section.id}
            onClick={() => !isLocked && onSectionChange(index)}
            disabled={isLocked}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-white/[0.05] border border-white/[0.1]' 
                : 'hover:bg-white/[0.02] border border-transparent'}
              ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-2 h-2 rounded-full flex-shrink-0 transition-colors
                ${isActive ? 'bg-blue-400' : isCompleted ? 'bg-green-400' : 'bg-white/20'}
              `} />
              
              <div>
                <h3 className={`
                  text-sm font-medium transition-colors
                  ${isActive ? 'text-white' : 'text-white/60'}
                `}>
                  {section.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-white/40">
                    {section.duration}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-xs text-white/40">
                    {section.xp} XP
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SectionsList; 