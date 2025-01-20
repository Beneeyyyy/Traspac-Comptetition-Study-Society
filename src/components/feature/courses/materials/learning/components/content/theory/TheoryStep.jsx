import { useState, Suspense, useEffect, useRef, lazy, useCallback, useLayoutEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMenu, FiAward, FiStar } from 'react-icons/fi';
import { RiBookLine, RiLightbulbLine } from 'react-icons/ri';
import { useAuth } from '../../../../../../../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import iconCourse2 from '../../../../../../../../assets/images/courses/iconCourse2.svg';
import { toast } from 'react-hot-toast';


// Lazy load components
const TopNavigation = lazy(() => import('./components/TopNavigation'));
const ContentSkeleton = lazy(() => import('./components/ContentSkeleton'));
const SectionsList = lazy(() => import('./components/SectionsList'));
const ContentRenderer = lazy(() => import('./components/ContentRenderer'));
const QuickTips = lazy(() => import('./components/QuickTips'));
const QuickQuiz = lazy(() => import('./components/QuickQuiz'));
const DiscussionPanel = lazy(() => import('../DiscussionPanel'));

const STORAGE_KEY = 'material_progress_';
const WELCOME_MODAL_KEY = 'theory_welcome_shown';
const POINTS_STORAGE_KEY = 'earned_points_';

// Add CSS animation for stars
const styles = `
  .stars-container {
    perspective: 500px;
  }
  
  .star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    animation: star-animation 2s infinite;
  }
  
  @keyframes star-animation {
    0% {
      transform: scale(0) rotate(0deg) translateZ(0);
      opacity: 0;
    }
    50% {
      transform: scale(1) rotate(360deg) translateZ(100px);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(720deg) translateZ(0);
      opacity: 0;
    }
  }
`;

// Add new completion modal component
const CompletionModal = ({ show, onClose, earnedPoints, material }) => {
  const { categoryId, subcategoryId } = useParams();

  const handleBackClick = () => {
    window.location.href = `/courses/${categoryId}/subcategory/${subcategoryId}`;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-[#1A1B1E] to-[#2C2D32] rounded-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden"
          >
            {/* Animated stars background */}
            <div className="stars-container absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="relative text-center space-y-6">
              <motion.div 
                className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 1.5 }}
              >
                <FiAward className="w-10 h-10 text-white" />
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Congratulations!
                </h2>
                <p className="text-white/60">
                  You've successfully completed {material?.title}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total Points Earned</span>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {earnedPoints} XP
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Stages Completed</span>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {material?.stages?.length || 0}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleBackClick}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Back to Materials
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TheoryStep = ({ material }) => {
  const [searchParams] = useSearchParams();
  const initialStage = parseInt(searchParams.get('stage')) || 0;
  const [activeSection, setActiveSection] = useState(initialStage);
  const [activeContentIndex, setActiveContentIndex] = useState(0);

  console.log('TheoryStep Material:', material);
  console.log('TheoryStep Stages:', material?.stages);
  console.log('Current Stage:', material?.stages?.[activeSection]);

  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [materialProgress, setMaterialProgress] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [stageProgress, setStageProgress] = useState({});
  const [earnedPoints, setEarnedPoints] = useState(0);
  const mainContentRef = useRef(null);
  const [isStageLoading, setIsStageLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    const hasSeenModal = localStorage.getItem(`welcome_modal_seen_${material?.id}`);
    return !hasSeenModal;
  });
  const [totalMaterialXP, setTotalMaterialXP] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const isSquadMaterial = location.pathname.includes('/squads/');
  const { squadId } = useParams();

  const currentStage = material?.stages?.[activeSection] || null;
  const sortedContents = currentStage?.contents || [];

  // Early return if no material or stages
  if (!material || !material.stages || material.stages.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">No content available for this material.</p>
      </div>
    );
  }

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

    // Load earned points from localStorage
    const savedPoints = localStorage.getItem(POINTS_STORAGE_KEY + material.id);
    if (savedPoints) {
      setEarnedPoints(parseInt(savedPoints));
      console.log('📍 Loaded points from localStorage:', parseInt(savedPoints));
    }

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
        
        // Determine if this is a squad material
        const isSquadMaterial = window.location.pathname.includes('/squads/');
        const squadId = isSquadMaterial ? window.location.pathname.split('/')[2] : null;
        
        // Use appropriate endpoint
        const progressEndpoint = isSquadMaterial
          ? `http://localhost:3000/api/squads/${squadId}/stage-progress/material/${user.id}/${material.id}/complete`
          : `http://localhost:3000/api/progress/material/${user.id}/${material.id}`;

        const response = await fetch(progressEndpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load progress');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          console.log('✅ Progress data loaded:', data.data);
          
          // Update material progress
          setMaterialProgress(data.data);
          
          // Restore stage progress
          if (data.data.stageProgress) {
            const parsedProgress = typeof data.data.stageProgress === 'string' 
              ? JSON.parse(data.data.stageProgress)
              : data.data.stageProgress;
              
            setStageProgress(parsedProgress);
            
            // Update completed stages from server data
            if (data.data.completedStages && Array.isArray(data.data.completedStages)) {
              const completed = new Set(data.data.completedStages);
              setCompletedStages(completed);
              
              console.log('📊 Restored completed stages:', Array.from(completed));
            }
          }
          
          // Restore position if specified in URL, otherwise use saved position
          const urlParams = new URLSearchParams(window.location.search);
          const stageParam = urlParams.get('stage');
          if (stageParam !== null) {
            setActiveSection(parseInt(stageParam));
          } else if (data.data.activeStage !== undefined) {
            setActiveSection(data.data.activeStage);
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
  const handleProgressUpdate = useCallback(async (progress) => {
    if (!user?.id || !material?.id) return;

    try {
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

      console.log('📈 Progress update:', {
        stage: activeSection,
        content: activeContentIndex,
        progress,
        stageProgress: newStageProgress
      });

      // Determine if this is a squad material based on URL and material type
      const isSquadMaterial = material.type === 'squad' || window.location.pathname.includes('/squads/');
      const squadId = isSquadMaterial ? window.location.pathname.split('/')[2] : null;

      // Use the appropriate endpoint based on material type
      const progressEndpoint = isSquadMaterial
        ? `http://localhost:3000/api/squads/${squadId}/stage-progress/material/${user.id}/${material.id}/complete`
        : `http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`;

      console.log('🔄 Using endpoint:', progressEndpoint);

      const response = await fetch(progressEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          stageIndex: activeSection,
          contentIndex: activeContentIndex,
          contentProgress: progress,
          completedStages: Array.from(completedStages),
          isStageCompleted: progress === 100
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }
        throw new Error('Failed to save progress');
      }

      const data = await response.json();
      
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

        // Update completed stages
        if (parsedStageProgress[activeSection]?.progress === 100 && 
            !completedStages.has(activeSection)) {
          const newCompletedStages = new Set(completedStages);
          newCompletedStages.add(activeSection);
          setCompletedStages(newCompletedStages);
        }
      }
    } catch (error) {
      console.error('❌ Error in progress update:', error);
      if (error.message !== 'Failed to save progress') {
        toast.error('Failed to save progress. Please try again.');
      }
    }
  }, [activeSection, activeContentIndex, completedStages, material, stageProgress, user?.id]);

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
    window.location.href = `/courses/${categoryId}/subcategory/${subcategoryId}`;
  };

  // Fungsi untuk mencatat point
  const recordStagePoints = async (stageIndex, material, user, categoryId, subcategoryId) => {
    // Calculate XP reward per stage
    const stageXP = Math.floor(material.xp_reward / material.stages.length);
    const isLastStage = stageIndex === material.stages.length - 1;
    const remainderXP = isLastStage ? (material.xp_reward % material.stages.length) : 0;

    console.log('📝 Recording points:', {
      stage: stageIndex + 1,
      stageXP,
      isLastStage,
      remainderXP,
      total: stageXP + (isLastStage ? remainderXP : 0)
    });

    // Create point record
    const pointResponse = await fetch('http://localhost:3000/api/points', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        materialId: material.id,
        categoryId: parseInt(categoryId),
        subcategoryId: parseInt(subcategoryId),
        value: stageXP,
        isLastStage,
        remainderXP
      })
    });

    if (!pointResponse.ok) {
      throw new Error(`Server error: ${pointResponse.status} ${pointResponse.statusText}`);
    }

    const pointData = await pointResponse.json();
    
    // Validate response
    if (!pointData.id) {
      console.error('Invalid point response:', pointData);
      throw new Error('Failed to create point record: Invalid response');
    }

    return {
      pointData,
      stageXP,
      totalXP: stageXP + (isLastStage ? remainderXP : 0)
    };
  };

  // Fungsi untuk update progress stage
  const updateStageProgress = async (stageIndex, contentIndex, user, material, completedStages) => {
    const response = await fetch(
      `http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageIndex,
          contentIndex,
          contentProgress: 100,
          completedStages: Array.from(completedStages)
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update progress: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to save progress');
    }

    return data;
  };

  const handleNext = async () => {
    console.log('Next button clicked:', {
      currentStage,
      activeContentIndex,
      sortedContents,
      totalStages: material?.stages?.length,
      currentSection: activeSection
    });

    if (!currentStage?.contents?.length) {
      console.log('No contents in current stage');
      return;
    }

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // If not at the last content of current stage
    if (activeContentIndex < sortedContents.length - 1) {
      console.log('Moving to next content:', activeContentIndex + 1);
      setActiveContentIndex(activeContentIndex + 1);
      return;
    }

    // If at last content of current stage
    if (material?.stages) {
      try {
        setIsStageLoading(true);

        // Determine if this is a squad material
        const isSquadMaterial = window.location.pathname.includes('/squads/');
        const squadId = isSquadMaterial ? window.location.pathname.split('/')[2] : null;

        // Calculate new completed stages
        const newCompletedStages = new Set(completedStages);
        newCompletedStages.add(activeSection);

        // Update stage progress
        const progressEndpoint = isSquadMaterial
          ? `http://localhost:3000/api/squads/${squadId}/stage-progress/material/${user.id}/${material.id}/complete`
          : `http://localhost:3000/api/stage-progress/material/${user.id}/${material.id}/complete`;

        const progressResponse = await fetch(progressEndpoint, {
          method: 'POST',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            stageIndex: activeSection,
            contentIndex: activeContentIndex,
            contentProgress: 100,
            completedStages: Array.from(newCompletedStages),
            isStageCompleted: true
          })
        });

        if (!progressResponse.ok) {
          throw new Error('Failed to update stage progress');
        }

        const progressData = await progressResponse.json();
        console.log('Stage progress updated:', progressData);

        if (progressData.success) {
          // Update local state with new progress data
          setMaterialProgress(progressData.data);
          
          // Update completed stages from server response
          if (progressData.data.completedStages && Array.isArray(progressData.data.completedStages)) {
            setCompletedStages(new Set(progressData.data.completedStages));
          } else {
            setCompletedStages(newCompletedStages);
          }
          
          // Update stage progress state
          if (progressData.data.stageProgress) {
            const parsedProgress = typeof progressData.data.stageProgress === 'string'
              ? JSON.parse(progressData.data.stageProgress)
              : progressData.data.stageProgress;
            setStageProgress(parsedProgress);
          }

          // Award points for completing the stage
          try {
            // Calculate XP reward per stage
            const totalXP = material.xp_reward || 0;
            const totalStages = material.stages.length;
            const baseXP = Math.floor(totalXP / totalStages);
            const isLastStage = activeSection === totalStages - 1;
            const remainderXP = isLastStage ? (totalXP % totalStages) : 0;
            const stageXP = baseXP + remainderXP;

            console.log('Point calculation:', {
              totalXP,
              totalStages,
              baseXP,
              isLastStage,
              remainderXP,
              stageXP,
              activeSection
            });

            // Create point record
            const pointsEndpoint = isSquadMaterial
              ? `http://localhost:3000/api/squads/${squadId}/points`
              : 'http://localhost:3000/api/points';

            const pointResponse = await fetch(pointsEndpoint, {
              method: 'POST',
              credentials: 'include',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                userId: user.id,
                materialId: material.id,
                categoryId: parseInt(categoryId),
                subcategoryId: parseInt(subcategoryId),
                value: stageXP,
                stageIndex: activeSection,
                isLastStage,
                remainderXP,
                squadId: isSquadMaterial ? parseInt(squadId) : undefined
              })
            });

            const pointData = await pointResponse.json();
            console.log('Point response:', pointData);

            if (pointData.success) {
              // Update earned points
              const newPoints = earnedPoints + stageXP;
              setEarnedPoints(newPoints);
              
              // Show point earned notification
              toast.success(`🎉 Earned ${stageXP} XP!`, {
                duration: 3000,
                position: 'top-center'
              });
            }
          } catch (error) {
            console.error('Error awarding points:', error);
          }

          // Check if this is the last stage
          if (activeSection === material.stages.length - 1) {
            // Show completion modal when material is finished
            setShowCompletionModal(true);
          } else {
            // Move to next stage
            setActiveSection(activeSection + 1);
            setActiveContentIndex(0);
          }
        }
      } catch (error) {
        console.error('❌ Error in handleNext:', error);
        toast.error('Failed to update progress. Please try again.');
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

  // Tambahkan useLayoutEffect untuk mengatur scroll
  useLayoutEffect(() => {
    if (showWelcomeModal) {
      // Prevent scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Reset scroll position
      window.scrollTo(0, 0);
    } else {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = 'unset';
    }
  }, [showWelcomeModal]);

  // Tambahkan effect untuk menyimpan status modal
  useEffect(() => {
    if (!showWelcomeModal) {
      localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    }
  }, [showWelcomeModal]);

  // Handle modal close
  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    // Save to localStorage that user has seen the modal for this material
    if (material?.id) {
      localStorage.setItem(`welcome_modal_seen_${material.id}`, 'true');
    }
  };

  // Tambahkan useEffect baru untuk menyimpan points ke localStorage setiap kali berubah
  useEffect(() => {
    if (!material?.id) return;
    
    localStorage.setItem(POINTS_STORAGE_KEY + material.id, earnedPoints.toString());
    console.log('💾 Saved points to localStorage:', earnedPoints);
  }, [earnedPoints, material?.id]);

  // Tambahkan useEffect untuk mengambil dan menghitung total XP dari database
  useEffect(() => {
    const fetchTotalXP = async () => {
      if (!material?.id || !user?.id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/points/material/${material.id}/${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          const totalXP = data.points.reduce((sum, point) => sum + point.value, 0);
          setTotalMaterialXP(totalXP);
          setEarnedPoints(totalXP);
          console.log('📊 Loaded total XP:', totalXP);
        }
      } catch (error) {
        console.error('Failed to fetch total XP:', error);
      }
    };

    fetchTotalXP();
  }, [material?.id, user?.id]);

  // Tambahkan useEffect untuk logging user data
  useEffect(() => {
    console.log('👤 Auth check:', {
      isAuthenticated: !!user,
      userId: user?.id,
      materialId: material?.id
    });
  }, [user, material]);

  const handleNextStage = async () => {
    if (activeSection < material?.stages?.length - 1) {
      try {
        console.log('Processing next stage:', activeSection);

        // Calculate points for this stage
        const pointsPerStage = Math.floor(material.points / material.stages.length);
        
        // Prepare point data
        const pointData = {
          userId: user.id,
          materialId: material.id,
          categoryId: parseInt(categoryId),
          subcategoryId: parseInt(subcategoryId),
          value: pointsPerStage,
          stageIndex: activeSection
        };

        console.log('Attempting to create point:', pointData);

        // Try to create point
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pointData),
          credentials: 'include'
        });

        const responseData = await response.json();
        
        if (response.ok && responseData.success) {
          // Point was created successfully (stage was not completed before)
          console.log('Points awarded successfully:', responseData);
          setEarnedPoints(prev => prev + pointsPerStage);
          
          // Add to completedStages
          const newCompletedStages = new Set(completedStages);
          newCompletedStages.add(activeSection);
          setCompletedStages(newCompletedStages);
        } else if (response.status === 400) {
          // Stage was already completed
          console.log('Stage already completed:', responseData.message);
          
          // Still add to completedStages if not already there
          if (!completedStages.has(activeSection)) {
            const newCompletedStages = new Set(completedStages);
            newCompletedStages.add(activeSection);
            setCompletedStages(newCompletedStages);
          }
        } else {
          // Other error occurred
          console.error('Error creating point:', responseData);
          throw new Error(responseData.message);
        }

        // Always update progress
        const newProgress = {
          ...stageProgress,
          [currentStage.id]: {
            completed: true,
            timestamp: new Date().toISOString()
          }
        };
        setStageProgress(newProgress);

        // Move to next stage
        setActiveSection(prev => prev + 1);
        setActiveContentIndex(0);
        
      } catch (error) {
        console.error('Error in handleNextStage:', error);
        // Continue with navigation even if point awarding fails
        setActiveSection(prev => prev + 1);
        setActiveContentIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Add style tag for animations */}
      <style>{styles}</style>
      
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1B1E] rounded-xl p-6 max-w-md w-full mx-4 relative overflow-hidden"
            >
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/10" />
              <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-purple-500/10" />
              
              {/* Content */}
              <div className="relative text-center space-y-4">
                <img 
                  src="/iconCourse2.svg" 
                  alt="Course Icon"
                  className="w-16 h-16 mx-auto mb-4 animate-float"
                />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Good Luck Learning!
                </h3>
                <p className="text-white/60">
                  Selamat belajar! Jangan lupa untuk selalu fokus dan mencatat poin-poin penting.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Let's Begin!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <CompletionModal
        show={showCompletionModal}
        onClose={handleBackToMaterials}
        earnedPoints={earnedPoints}
        material={material}
      />

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
                    contents={sortedContents}
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