const GlossaryItem = ({ term, def }) => {
  return (
    <div 
      className="group relative overflow-hidden"
    >
      <div className="relative p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-400/60" />
          <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
            {term}
          </h3>
        </div>
        
        <div className="pl-5 border-l-2 border-white/[0.05] group-hover:border-purple-500/20 transition-colors">
          <p className="text-base text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
            {def}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlossaryItem; 