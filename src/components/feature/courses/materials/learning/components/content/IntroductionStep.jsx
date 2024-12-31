import { FiBook, FiSearch } from 'react-icons/fi';
import { useState, useMemo, useCallback, lazy, Suspense } from 'react';

const StageCard = lazy(() => import('./introduction/StageCard'));
const GlossaryItem = lazy(() => import('./introduction/GlossaryItem'));

const IntroductionStep = ({ material, onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const glossaryItems = useMemo(() => material?.glossary || [], [material]);

  const stages = useMemo(() => material?.stages || [], [material]);

  const filteredGlossary = useMemo(() => 
    glossaryItems.filter(([term]) => 
      term.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [glossaryItems, searchTerm]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (!material) return null;

  return (
    <div className="w-full space-y-8 px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative px-8 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {material.title}
              </h1>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-white/60">{material.level}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-lg text-white/60">{material.category}</span>
              </div>
            </div>

            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {material.description}
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-yellow-400">{material.total_xp} XP</div>
                <div className="text-sm text-white/40">Experience Points</div>
              </div>
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-blue-400">{material.total_stages} Bagian</div>
                <div className="text-sm text-white/40">Materi Pembelajaran</div>
              </div>
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-purple-400">{material.estimated_time}</div>
                <div className="text-sm text-white/40">Estimasi Waktu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Content */}
      <div className="grid grid-cols-4 gap-8">
        {/* Learning Path - 3 columns */}
        <div className="col-span-3">
          <div className="relative">
            <div className="absolute top-0 left-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent" />
            <div className="space-y-6">
              <Suspense fallback={null}>
                {stages.map((stage) => (
                  <StageCard 
                    key={stage.title} 
                    stage={stage} 
                    onComplete={onComplete}
                  />
                ))}
              </Suspense>
            </div>
          </div>
        </div>

        {/* Glossary - 1 column */}
        <div className="col-span-1">
          <div className="bg-black/[0.02] border border-white/[0.05] rounded-2xl sticky top-4">
            <div className="p-8 border-b border-white/[0.05]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <FiBook className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Istilah Penting</h2>
                </div>
                <div className="px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-sm text-white/60">
                  {filteredGlossary.length} istilah
                </div>
              </div>
              
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Cari istilah..."
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl pl-12 pr-4 py-3 text-base placeholder:text-white/40 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>

            <div className="p-8 max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <Suspense fallback={null}>
                  {filteredGlossary.map(([term, def]) => (
                    <GlossaryItem 
                      key={term} 
                      term={term} 
                      def={def}
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `
      }} />
    </div>
  );
};

export default IntroductionStep; 