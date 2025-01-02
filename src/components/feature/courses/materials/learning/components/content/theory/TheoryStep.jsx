import { useState, Suspense, useEffect, useRef, lazy, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';
import { RiBookLine, RiLightbulbLine } from 'react-icons/ri';
import { useAuth } from '../../../../../../../../context/AuthContext';

// Lazy load components
const TopNavigation = lazy(() => import('./components/TopNavigation'));
const ContentSkeleton = lazy(() => import('./components/ContentSkeleton'));
const SectionsList = lazy(() => import('./components/SectionsList'));
const ContentRenderer = lazy(() => import('./components/ContentRenderer'));
const QuickTips = lazy(() => import('./components/QuickTips'));
const QuickQuiz = lazy(() => import('./components/QuickQuiz'));
const DiscussionPanel = lazy(() => import('../DiscussionPanel'));

const TheoryStep = ({ material }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [materialProgress, setMaterialProgress] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [stageProgress, setStageProgress] = useState({});
  const [earnedPoints, setEarnedPoints] = useState(0);
  const mainContentRef = useRef(null);
  
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const { user } = useAuth();

  const currentStage = material?.stages?.[activeSection];
  const sortedContents = currentStage?.contents?.sort((a, b) => a.order - b.order) || [];

  // Initialize material data
  useEffect(() => {
    if (!material?.id) return;
    
    console.log('📚 Material data loaded:', {
      id: material.id,
      title: material.title,
      xp_reward: material.xp_reward,
      stages: material.stages?.length
    });

    // Initialize stage progress
    const initialProgress = {};
    material.stages?.forEach((_, index) => {
      initialProgress[index] = {
        progress: 0,
        contents: {}
      };
    });
    setStageProgress(initialProgress);
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

  // Update progress when content changes
  const handleProgressUpdate = useCallback((progress) => {
    if (!user?.id || !material?.id) return;

    // Update stage progress
    const newStageProgress = {
      ...stageProgress,
      [activeSection]: {
        progress,
        contents: {
          ...(stageProgress[activeSection]?.contents || {}),
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
              console.log('💰 Points awarded:', data);
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
    navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/materials`);
  };

  const handleNext = () => {
    if (!currentStage?.contents?.length) return;

    if (activeContentIndex < sortedContents.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    } else if (material?.stages && activeSection < material.stages.length - 1) {
      setActiveSection(activeSection + 1);
      setActiveContentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (!currentStage?.contents?.length) return;

    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    } else if (activeSection > 0 && material?.stages) {
      const prevStage = material.stages[activeSection - 1];
      const prevContents = prevStage?.contents || [];
      setActiveSection(activeSection - 1);
      setActiveContentIndex(Math.max(0, prevContents.length - 1));
    }
  };

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
            {/* Welcome Message */}
            {activeSection === 0 && currentStage?.order === 1 && (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <RiBookLine className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Selamat datang di pembelajaran {material.title}!
                    </h2>
                    <p className="text-white/60">
                      Mari kita mulai petualangan belajar yang menyenangkan. Setiap langkah membawamu lebih dekat ke penguasaan materi!
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    disabled={activeContentIndex === sortedContents.length - 1 && (!material?.stages || activeSection === material.stages.length - 1)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                      activeContentIndex === sortedContents.length - 1 && (!material?.stages || activeSection === material.stages.length - 1)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700'
                    }`}
                  >
                    <span>
                      {activeContentIndex === sortedContents.length - 1 && material?.stages && activeSection < material.stages.length - 1 
                        ? 'Next Stage' 
                        : 'Next'
                      }
                    </span>
                    <FiArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            </Suspense>

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