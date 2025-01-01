import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import NotesSidePanel from './components/sidePanel/NotesSidePanel';
import FeaturesSidebar from './components/sidePanel/FeaturesSidebar';
import QuickActions from './components/content/QuickActions';
import Footer from '/src/components/layouts/Footer';

// Lazy loaded components
const IntroductionStep = lazy(() => import('./components/content/IntroductionStep'));
const TheoryStep = lazy(() => import('./components/content/theory/TheoryStep'));

// Learning steps configuration
const LEARNING_STEPS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'theory', title: 'Theory' },
  { id: 'quiz', title: 'Quiz' },
  { id: 'practice', title: 'Practice' },
  { id: 'final', title: 'Final Test' }
];

// Loading skeleton
const ContentSkeleton = () => (
  <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-white/5 rounded-lg w-3/4" />
      <div className="h-4 bg-white/5 rounded-lg w-full" />
      <div className="h-4 bg-white/5 rounded-lg w-5/6" />
    </div>
  </div>
);

// Error component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
      <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Material</h2>
      <p className="text-white/60 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const LearningPage = () => {
  const { categoryId, subcategoryId, materialId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showGuides, setShowGuides] = useState(true);

  // Get current step from URL
  const currentStep = LEARNING_STEPS.findIndex(
    step => location.pathname.includes(step.id)
  );

  // Fetch material data
  const fetchMaterial = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch material data
      const response = await fetch(`http://localhost:3000/api/materials/${materialId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized, redirect to login
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: 'Please login to access the learning materials' 
            } 
          });
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to fetch material data');
      }
      
      const data = await response.json();
      console.log('Fetched material data:', data);
      
      if (!data || !data.id) {
        throw new Error('Invalid material data received');
      }
      
      setMaterial(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  // Control body overflow when sidebar is open
  useEffect(() => {
    if (showNotes || showFeatures) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showNotes, showFeatures]);

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < LEARNING_STEPS.length - 1) {
      navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/learn/${materialId}/${LEARNING_STEPS[currentStep + 1].id}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/learn/${materialId}/${LEARNING_STEPS[currentStep - 1].id}`);
    }
  };

  const handleStepComplete = () => {
    setShowGuides(false);
    handleNext();
  };

  // Side panel handlers
  const handleShowNotes = () => setShowNotes(true);
  const handleShowFeatures = () => setShowFeatures(true);
  const handleCloseNotes = () => setShowNotes(false);
  const handleCloseFeatures = () => setShowFeatures(false);

  if (isLoading) {
    return <ContentSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchMaterial} />;
  }

  if (!material) {
    return <ErrorDisplay error="Material not found" onRetry={fetchMaterial} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
        {/* Content Area */}
        <div className="relative">
          <Suspense fallback={<ContentSkeleton />}>
            <Routes location={location}>
              <Route 
                index 
                element={<Navigate to="introduction" replace />} 
              />
              <Route
                path="introduction"
                element={
                  <div className="bg-black/[0.01] border border-white/[0.05] rounded-xl p-8 backdrop-blur-sm">
                    <IntroductionStep 
                      material={material} 
                      onComplete={handleStepComplete}
                    />
                  </div>
                }
              />
              <Route
                path="theory"
                element={
                  <div className="bg-black/[0.01] border border-white/[0.05] rounded-xl backdrop-blur-sm p-8">
                    <TheoryStep 
                      material={material} 
                      onComplete={handleStepComplete}
                    />
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onShowNotes={handleShowNotes}
        onShowFeatures={handleShowFeatures}
        isDisabled={showNotes || showFeatures}
      />

      {/* Side Panels */}
      {showNotes && (
        <NotesSidePanel
          show={showNotes}
          onClose={handleCloseNotes}
          materialId={material?.id}
        />
      )}
      {showFeatures && (
        <FeaturesSidebar
          show={showFeatures}
          onClose={handleCloseFeatures}
          material={material}
        />
      )}
      <Footer />
    </div>
  );
};

export { LearningPage as default }; 