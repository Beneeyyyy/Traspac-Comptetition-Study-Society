import { useState, Suspense, useEffect, useRef, lazy, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';
import { RiBookLine, RiLightbulbLine } from 'react-icons/ri';
import { useAuth } from '../../../../../../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components
const TopNavigation = lazy(() => import('./components/TopNavigation'));
const ContentSkeleton = lazy(() => import('./components/ContentSkeleton'));
const SectionsList = lazy(() => import('./components/SectionsList'));
const ContentRenderer = lazy(() => import('./components/ContentRenderer'));
const QuickTips = lazy(() => import('./components/QuickTips'));
const QuickQuiz = lazy(() => import('./components/QuickQuiz'));
const DiscussionPanel = lazy(() => import('../DiscussionPanel'));

const STORAGE_KEY = 'material_progress_';

const TheoryStep = ({ material }) => {
  const [searchParams] = useSearchParams();
  const initialStage = parseInt(searchParams.get('stage')) || 0;
  
  const [activeSection, setActiveSection] = useState(initialStage);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [materialProgress, setMaterialProgress] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [stageProgress, setStageProgress] = useState({});
  const [earnedPoints, setEarnedPoints] = useState(0);
  const mainContentRef = useRef(null);
  const [isStageLoading, setIsStageLoading] = useState(false);
  
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const { user } = useAuth();

  const currentStage = material?.stages?.[activeSection];
  const sortedContents = currentStage?.contents?.sort((a, b) => a.order - b.order) || [];

  // Initialize material data
  useEffect(() => {
    if (!material?.id) return;
    
    console.log('📚 Material initialization:', {
      raw: material,
      id: material.id,
      title: material.title,
      xp_reward: material.xp_reward,
      stages: material.stages?.length,
      hasXpReward: 'xp_reward' in material
    });

    // Get stage from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const stageParam = urlParams.get('stage');
    if (stageParam !== null) {
      const stageIndex = parseInt(stageParam);
      setActiveSection(stageIndex);
      console.log('📍 Setting initial stage from URL:', stageIndex);
    }

    // Initialize stage progress for new users
    const initialProgress = {};
    material.stages?.forEach((_, index) => {
      initialProgress[index] = {
        progress: 0,
        contents: {}
      };
    });
    setStageProgress(initialProgress);

    // Initialize completed stages as empty Set
    setCompletedStages(new Set());
  }, [material]);

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id || !material?.id) return;

      try {
        console.log('🔄 Loading progress for material:', material.id);
        const response = await fetch(`http://localhost:3000/api/progress/material/${user.id}/${material.id}`);
        if (!response.ok) {
          throw new Error('Failed to load progress');
        }
        const data = await response.json();
        
        if (data.success && data.data) {
          console.log('✅ Progress data:', data.data);
          
          // Update material progress
          setMaterialProgress(data.data);
          
          // Restore stage progress
          if (data.data.stageProgress) {
            const parsedProgress = typeof data.data.stageProgress === 'string' 
              ? JSON.parse(data.data.stageProgress)
              : data.data.stageProgress;
              
            setStageProgress(parsedProgress);
            
            // Update completed stages
            const completed = new Set(
              Array.isArray(data.data.completedStages)
                ? data.data.completedStages
                : Object.entries(parsedProgress)
                    .filter(([_, progress]) => progress.progress === 100)
                    .map(([index]) => parseInt(index))
            );
            setCompletedStages(completed);
            
            console.log('📊 Restored progress:', {
              stageProgress: parsedProgress,
              completedStages: Array.from(completed)
            });
          }
          
          // Restore position
          if (data.data.activeSection !== undefined) {
            setActiveSection(data.data.activeSection);
          }
          if (data.data.activeContentIndex !== undefined) {
            setActiveContentIndex(data.data.activeContentIndex);
          }
        }
      } catch (error) {
        console.error('❌ Error loading progress:', error);
      }
    };

    loadProgress();
  }, [user?.id, material?.id]);

  // Load progress from localStorage
  useEffect(() => {
    const loadLocalProgress = () => {
      try {
        const key = STORAGE_KEY + material?.id;
        const savedProgress = localStorage.getItem(key);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setStageProgress(parsed.stageProgress);
          setCompletedStages(new Set(parsed.completedStages));
          setEarnedPoints(parsed.earnedPoints);
          console.log('📝 Loaded progress from localStorage:', parsed);
        }
      } catch (error) {
        console.error('❌ Error loading progress from localStorage:', error);
      }
    };

    loadLocalProgress();
  }, [material?.id]);

  // Save progress to localStorage
  useEffect(() => {
    const saveLocalProgress = () => {
      try {
        const key = STORAGE_KEY + material?.id;
        const progress = {
          stageProgress,
          completedStages: Array.from(completedStages),
          earnedPoints,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(progress));
        console.log('💾 Saved progress to localStorage:', progress);
      } catch (error) {
        console.error('❌ Error saving progress to localStorage:', error);
      }
    };

    if (material?.id) {
      saveLocalProgress();
    }
  }, [stageProgress, completedStages, earnedPoints, material?.id]);

  // Update progress when content changes
  const handleProgressUpdate = useCallback((progress) => {
    if (!user?.id || !material?.id) return;

    // Ensure we have valid objects for new users
    const currentStageProgress = stageProgress[activeSection] || { progress: 0, contents: {} };
    const currentContents = currentStageProgress.contents || {};

    // Update stage progress
    const newStageProgress = {
      ...stageProgress,
      [activeSection]: {
        progress,
        contents: {
          ...currentContents,
          [activeContentIndex]: progress
        }
      }
    };
    setStageProgress(newStageProgress);

    console.log('📈 Progress update:', {
      stage: activeSection,
      content: activeContentIndex,
      progress,
      stageProgress: newStageProgress
    });

    // Save progress to backend
    fetch(`http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stageIndex: activeSection,
        contentIndex: activeContentIndex,
        contentProgress: progress,
        completedStages: Array.from(completedStages)
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        console.log('✅ Progress saved:', data);
        
        // Update material progress
        setMaterialProgress(data.data);

        // Parse stage progress if it's a string
        const parsedStageProgress = typeof data.data.stageProgress === 'string' 
          ? JSON.parse(data.data.stageProgress) 
          : data.data.stageProgress;

        // Update stage progress state
        setStageProgress(parsedStageProgress);

        // Check if stage is completed
        if (parsedStageProgress[activeSection]?.progress === 100 && 
            !completedStages.has(activeSection)) {
          const newCompletedStages = new Set(completedStages);
          newCompletedStages.add(activeSection);
          setCompletedStages(newCompletedStages);

          // Calculate XP reward
          const stageXP = Math.floor(material.xp_reward / material.stages.length);
          const isLastStage = activeSection === material.stages.length - 1;
          const remainderXP = isLastStage ? (material.xp_reward % material.stages.length) : 0;
          const totalStageXP = stageXP + remainderXP;

          console.log('⭐ Stage completed:', {
            stage: activeSection,
            xp: totalStageXP,
            isLastStage,
            totalXP: material.xp_reward
          });

          // Create point record
          fetch('http://localhost:3000/api/points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              materialId: material.id,
              categoryId: parseInt(categoryId),
              subcategoryId: parseInt(subcategoryId),
              value: totalStageXP,
              stageIndex: activeSection
            })
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(err => Promise.reject(err));
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              console.log('💰 Stage Completion Check:', {
                activeSection,
                progress: parsedStageProgress[activeSection]?.progress,
                isCompleted: completedStages.has(activeSection),
                stageXP,
                isLastStage,
                remainderXP,
                totalStageXP,
                material: {
                  id: material.id,
                  totalXP: material.xp_reward,
                  totalStages: material.stages.length
                },
                completedStages: Array.from(completedStages)
              });
              console.log('💰 Points awarded:', {
                stageIndex: activeSection,
                earnedPoints: totalStageXP,
                response: data,
                newTotalPoints: data.data.user.totalPoints,
                completedStages: Array.from(completedStages)
              });
              setEarnedPoints(totalStageXP);
            } else {
              throw new Error(data.error || 'Failed to award points');
            }
          })
          .catch(error => {
            console.error('❌ Error creating points:', error);
            // Don't block the UI for points error
          });
        }
      }
    })
    .catch(error => {
      console.error('❌ Error saving progress:', error);
      // Optionally show error to user
      // toast.error('Failed to save progress. Please try again.');
    });
  }, [activeSection, activeContentIndex, completedStages, material, stageProgress, user?.id, categoryId, subcategoryId]);

  // Handle scroll behavior
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const controlNavbar = () => {
      const currentScrollY = mainContent.scrollTop;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else if (currentScrollY === 0) {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    mainContent.addEventListener('scroll', controlNavbar);
    return () => mainContent.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Reset content index when section changes
  useEffect(() => {
    setActiveContentIndex(0);
  }, [activeSection]);

  const handleBackToMaterials = () => {
    // Force refresh when going back to materials
    window.location.href = `/courses/${categoryId}/subcategory/${subcategoryId}/materials`;
  };

  const handleNext = async () => {
    if (!currentStage?.contents?.length) return;

    // Scroll to top with window instead of mainContentRef
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // If not at the last content of current stage
    if (activeContentIndex < sortedContents.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
      return;
    }

    // If at last content of current stage
    if (material?.stages) {
      try {
        setIsStageLoading(true);
        
        // Create new completed stages set
        const newCompletedStages = new Set(completedStages);
        newCompletedStages.add(activeSection);

        // Save completion status to backend
        const response = await fetch(
          `http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stageIndex: activeSection,
              contentIndex: activeContentIndex,
              contentProgress: 100,
              completedStages: Array.from(newCompletedStages)
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to save completion status');
        }

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Stage completion saved:', {
            stage: activeSection,
            completedStages: Array.from(newCompletedStages)
          });

          // Update local state first
          setCompletedStages(newCompletedStages);
          
          // If not the last stage, move to next stage
          if (activeSection < material.stages.length - 1) {
            setActiveSection(activeSection + 1);
            setActiveContentIndex(0);
          } else {
            // This is the last stage, mark as complete
            console.log('🎉 Material completed!');
            setActiveSection(-1);
          }
        } else {
          throw new Error(data.error || 'Failed to save completion status');
        }
      } catch (error) {
        console.error('❌ Error saving completion:', error);
        // Show error message to user
        // toast.error('Failed to save progress. Please try again.');
      } finally {
        setIsStageLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (!currentStage?.contents?.length) return;

    // Scroll to top with window instead of mainContentRef
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    } else if (activeSection > 0 && material?.stages) {
      const prevStage = material.stages[activeSection - 1];
      const prevContents = prevStage?.contents || [];
      setActiveSection(activeSection - 1);
      setActiveContentIndex(Math.max(0, prevContents.length - 1));
    }
  };

  // Tambahkan useEffect untuk preloading
  useEffect(() => {
    const prefetchNextStage = async () => {
      // Jika bukan stage terakhir
      if (material?.stages && activeSection < material.stages.length - 1) {
        try {
          // Preload progress untuk stage berikutnya
          const nextStageIndex = activeSection + 1;
          console.log('🔄 Prefetching next stage:', nextStageIndex);
          
          await fetch(
            `http://localhost:3000/api/progress/material/${user.id}/${material.id}`, 
            { method: 'GET' }
          );
        } catch (error) {
          console.error('❌ Error prefetching next stage:', error);
        }
      }
    };

    prefetchNextStage();
  }, [activeSection, material?.stages, material?.id, user?.id]);

  // Sebelum render TopNavigation
  console.log('🎯 Pre-render check:', {
    material: {
      id: material?.id,
      xp_reward: material?.xp_reward,
      stages: material?.stages?.length,
      full: material
    },
    earnedPoints,
    completedStages: Array.from(completedStages),
    currentStage: {
      id: currentStage?.id,
      title: currentStage?.title,
      order: currentStage?.order
    }
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
        <TopNavigation 
          section={currentStage} 
          onBack={handleBackToMaterials}
          show={showNav}
          material={material}
          earnedPoints={earnedPoints}
          completedStages={Array.from(completedStages)}
        />
      </div>

      {/* Main Layout */}
      <div className="pt-20 flex min-h-screen">
        {/* Left Sidebar */}
        <aside className={`
          fixed lg:sticky top-20 h-[calc(100vh-5rem)] w-72
          bg-black/50 backdrop-blur-lg border-r border-white/5
          transition-transform duration-300 z-40
          ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <SectionsList 
                material={material}
                activeSection={activeSection}
                materialProgress={materialProgress}
                completedStages={completedStages}
                stageProgress={stageProgress}
                onSectionChange={(index) => {
                  // Scroll to top with window
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                  
                  setActiveSection(index);
                  setActiveContentIndex(0);
                  setShowLeftSidebar(false);
                }}
              />
            </div>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowLeftSidebar(true)}
          className="lg:hidden fixed left-4 top-24 z-50 p-2.5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div ref={mainContentRef} className="h-full px-4 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {isStageLoading ? (
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Title Skeleton */}
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
                      <div className="h-2 bg-white/5 rounded-full w-1/2"></div>
                    </div>
                    
                    {/* Content Skeleton */}
                    <div className="animate-pulse space-y-6">
                      <div className="h-48 bg-white/5 rounded-lg"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                        <div className="h-4 bg-white/5 rounded-full w-4/6"></div>
                        <div className="h-4 bg-white/5 rounded-full w-3/6"></div>
                      </div>
                    </div>

                    {/* Loading Progress */}
                    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-white/10 border-t-blue-500 rounded-full"></div>
                        <span className="text-sm text-white/60">Loading next stage...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Suspense fallback={<ContentSkeleton />}>
                    {/* Stage Progress */}
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                          <RiLightbulbLine className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white mb-2 truncate">{currentStage?.title}</h3>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                style={{ 
                                  width: sortedContents.length 
                                    ? `${((activeContentIndex + 1) / sortedContents.length) * 100}%`
                                    : '0%'
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-white/60 whitespace-nowrap">
                              {activeContentIndex + 1} / {sortedContents.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto">
                      {currentStage?.contents && (
                        <ContentRenderer 
                          contents={currentStage.contents}
                          currentStage={currentStage}
                          onNextStage={handleNext}
                          currentContentIndex={activeContentIndex}
                          onContentChange={setActiveContentIndex}
                          savedContentIndex={materialProgress?.activeContentIndex}
                          onProgressUpdate={handleProgressUpdate}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="max-w-4xl mx-auto mt-8 mb-16">
                      <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <button
                          onClick={handlePrevious}
                          disabled={activeContentIndex === 0 && activeSection === 0}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                            activeContentIndex === 0 && activeSection === 0
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/5 active:bg-white/10 hover:shadow-lg'
                          }`}
                        >
                          <FiArrowLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        <div className="text-sm font-medium text-white/60">
                          Stage {activeSection + 1} • Content {activeContentIndex + 1} / {sortedContents.length}
                        </div>
                        
                        <button
                          onClick={handleNext}
                          disabled={false}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                            activeContentIndex === sortedContents.length - 1 && material?.stages ? (
                              activeSection === material.stages.length - 1 ? (
                                'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700'
                              ) : (
                                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700'
                              )
                            ) : (
                              'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700'
                            )
                          } hover:shadow-lg`}
                        >
                          <span>
                            {activeContentIndex === sortedContents.length - 1 && material?.stages ? (
                              activeSection === material.stages.length - 1 ? (
                                'Complete Material'
                              ) : (
                                'Next Stage'
                              )
                            ) : (
                              'Next'
                            )}
                          </span>
                          <FiArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Discussion Panel */}
            <div className="max-w-4xl mx-auto">
              <DiscussionPanel materialId={material?.id} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
      `}</style>
    </div>
  );
};

export default TheoryStep; 