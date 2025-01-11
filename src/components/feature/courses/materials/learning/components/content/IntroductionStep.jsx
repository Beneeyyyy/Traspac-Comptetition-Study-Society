import { FiBook, FiSearch } from 'react-icons/fi';
import { useState, useMemo, useCallback, lazy, Suspense, useEffect } from 'react';
import { useAuth } from '../../../../../../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const StageCard = lazy(() => import('./introduction/StageCard'));
const GlossaryItem = lazy(() => import('./introduction/GlossaryItem'));

const IntroductionStep = ({ material, onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [materialProgress, setMaterialProgress] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [stageProgress, setStageProgress] = useState({});
  const [activeStage, setActiveStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { categoryId, subcategoryId } = useParams();

  // Function to load progress
  const loadProgress = useCallback(async () => {
    if (!user?.id || !material?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Checking database for progress:', {
        userId: user.id,
        materialId: material.id
      });

      const response = await fetch(`http://localhost:3000/api/progress/material/${user.id}/${material.id}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('📂 Database records found:', {
          progress: data.data?.progress,
          stageProgress: data.data?.stageProgress,
          completedStages: data.data?.completedStages,
          activeStage: data.data?.activeStage
        });

        // Set material progress
        setMaterialProgress(data.data);
        
        // Set stage progress
        setStageProgress(data.data.stageProgress || {});
        
        // Set completed stages
        const completed = new Set(data.data.completedStages || []);
        setCompletedStages(completed);

        // Set active stage
        setActiveStage(data.data.activeStage || 0);

        console.log('🔄 Current state after loading:', {
          activeStage: data.data.activeStage || 0,
          completedStages: Array.from(completed),
          stageProgress: data.data.stageProgress || {}
        });
      } else {
        console.log('🆕 No database records found, initializing new progress');
        const initialProgress = {};
        material.stages?.forEach((_, index) => {
          initialProgress[index] = 0;
        });
        setStageProgress(initialProgress);
        setCompletedStages(new Set());
        setActiveStage(0);
      }
    } catch (error) {
      console.error('❌ Database error:', error);
      // Initialize empty progress on error
      const initialProgress = {};
      material.stages?.forEach((_, index) => {
        initialProgress[index] = 0;
      });
      setStageProgress(initialProgress);
      setCompletedStages(new Set());
      setActiveStage(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, material?.id]);

  // Load initial progress
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Refresh progress when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Component visible, refreshing progress...');
        loadProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadProgress);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadProgress);
    };
  }, [loadProgress]);

  // Helper function to check if all previous stages are completed
  const areAllPreviousStagesCompleted = useCallback((stageIndex) => {
    if (stageIndex === 0) return true;
    for (let i = 0; i < stageIndex; i++) {
      if (!completedStages.has(i)) return false;
    }
    return true;
  }, [completedStages]);

  // Process stages with progress and locking
  const stages = useMemo(() => {
    if (!Array.isArray(material?.stages)) return [];
    
    // Get highest completed stage
    const maxCompletedStage = Math.max(...Array.from(completedStages), -1);
    
    return material.stages.map((stage, index) => {
      // Get stage progress
      const stageProgressData = typeof stageProgress[index] === 'object' 
        ? stageProgress[index]
        : { progress: stageProgress[index] || 0 };

      // Determine stage status
      const isCompleted = completedStages.has(index) || stageProgressData.progress === 100;
      const allPreviousCompleted = areAllPreviousStagesCompleted(index);
      
      // Next stage is the first uncompleted stage after the last completed stage
      const isNextStage = !isCompleted && allPreviousCompleted && (index === maxCompletedStage + 1 || index === 0);
      
      // Stage is locked if not completed and not the next stage
      const isLocked = !isCompleted && !isNextStage;
      
      // Current stage is ONLY the next stage
      const isCurrent = isNextStage;

      console.log(`Stage ${index} Status:`, {
        isCompleted,
        isCurrent,
        allPreviousCompleted,
        isLocked,
        isNextStage,
        progress: stageProgressData.progress,
        maxCompletedStage,
        completedStages: Array.from(completedStages)
      });

      return {
        ...stage,
        isCompleted,
        isCurrent,
        isLocked,
        progress: stageProgressData.progress || 0,
        time: stage.time || '15-20 menit'  // Default time if not specified
      };
    });
  }, [material?.stages, completedStages, activeStage, stageProgress, areAllPreviousStagesCompleted]);

  // Handle stage selection
  const handleStageSelect = useCallback((stage, index) => {
    if (stage.isLocked) {
      console.log('🔒 Cannot access locked stage:', index);
      return;
    }
    
    console.log('🎯 Selected stage:', index);
    setActiveStage(index);
  }, []);

  // Handle stage completion
  const handleStageComplete = async (stageIndex) => {
    if (!user?.id || !material?.id || isLoading) return;

    try {
      console.log('🎯 Starting stage completion process:', {
        currentStage: stageIndex,
        previouslyCompleted: Array.from(completedStages),
        currentProgress: stageProgress[stageIndex]
      });

      // Add stage to completed stages
      const newCompletedStages = new Set(completedStages);
      newCompletedStages.add(stageIndex);

      // Save to database first
      console.log('💾 Saving to database...');
      
      const progressResponse = await fetch(
        `http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stageIndex,
            contentProgress: 100,
            completedStages: Array.from(newCompletedStages)
          })
        }
      );

      if (!progressResponse.ok) {
        const errorData = await progressResponse.json();
        throw new Error(errorData.error || 'Failed to save progress to database');
      }

      const progressData = await progressResponse.json();
      if (!progressData.success) {
        throw new Error('Failed to save progress to database');
      }

      console.log('✅ Progress saved to database:', progressData.data);
      
      // Update local state from response
      setStageProgress(progressData.data.stageProgress || {});
      setCompletedStages(new Set(progressData.data.completedStages || []));
      setActiveStage(progressData.data.activeStage || stageIndex);
      setMaterialProgress(progressData.data);

      // Final state check
      console.log('🔄 Final state:', {
        completedStages: progressData.data.completedStages,
        activeStage: progressData.data.activeStage,
        stageProgress: progressData.data.stageProgress
      });

      // Notify parent component
      if (typeof onComplete === 'function') {
        onComplete(stageIndex);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      console.log('⚠️ Reverted to previous state due to error:', error.message);
    }
  };

  // Filter glossary items
  const glossaryItems = useMemo(() => {
    if (!Array.isArray(material?.glossary)) return [];
    return material.glossary.filter(item => Array.isArray(item) && item.length === 2);
  }, [material]);

  const filteredGlossary = useMemo(() => {
    if (searchTerm.trim() === '') return glossaryItems;
    return glossaryItems.filter(([term]) => 
      term.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [glossaryItems, searchTerm]);

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
                <div className="text-xl font-semibold text-yellow-400">{material.total_xp || material.xp_reward || 0} XP</div>
                <div className="text-sm text-white/40">Experience Points</div>
              </div>
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-blue-400">{material.stages?.length || 0} Bagian</div>
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
                {stages.map((stage, index) => (
                  <StageCard 
                    key={stage.id} 
                    stage={stage} 
                    material={material}
                    stageIndex={index}
                    onComplete={() => handleStageComplete(index)}
                    onSelect={() => handleStageSelect(stage, index)}
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
                  {filteredGlossary.map(([term, def], index) => (
                    <GlossaryItem 
                      key={`${term}-${index}`} 
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