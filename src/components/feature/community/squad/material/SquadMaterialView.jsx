import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotesSidePanel from '../../../courses/materials/learning/components/sidePanel/NotesSidePanel';
import FeaturesSidebar from '../../../courses/materials/learning/components/sidePanel/FeaturesSidebar';
import QuickActions from '../../../courses/materials/learning/components/content/QuickActions';
import Footer from '../../../../layouts/Footer';
import api from '../../../../../utils/api';

// Lazy loaded components
const TheoryStep = lazy(() => import('../../../courses/materials/learning/components/content/theory/TheoryStep'));

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

const SquadMaterialView = () => {
  const { squadId, materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching squad material:', { squadId, materialId });
        
        const response = await api.get(`/api/squads/${squadId}/materials/${materialId}`);
        const materialData = response.data.material;
        
        // Validate material data
        if (!materialData || !materialData.stages) {
          throw new Error('Invalid material data received');
        }

        // Log material structure
        console.log('Received material data:', {
          id: materialData.id,
          title: materialData.title,
          stagesCount: materialData.stages.length,
          stages: materialData.stages.map(s => ({
            id: s.id,
            title: s.title,
            contentsCount: s.contents?.length || 0
          }))
        });

        setMaterial(materialData);
        setError(null);
      } catch (error) {
        console.error('Error fetching material:', error);
        setError(error.response?.data?.message || 'Failed to fetch material');
        setMaterial(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (materialId) {
      fetchMaterial();
    }
  }, [squadId, materialId]);

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

  // Side panel handlers
  const handleShowNotes = () => setShowNotes(true);
  const handleShowFeatures = () => setShowFeatures(true);
  const handleCloseNotes = () => setShowNotes(false);
  const handleCloseFeatures = () => setShowFeatures(false);

  if (isLoading) {
    return <ContentSkeleton />;
  }

  if (error) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-white/60">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!material || !material.stages || material.stages.length === 0) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Material Not Found</h2>
          <p className="text-white/60">The material content could not be loaded.</p>
          <button 
            onClick={() => navigate(`/squads/${squadId}`)} 
            className="mt-4 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
          >
            Back to Squad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-screen-2xl mx-auto px-6 py-8 pt-20">
        {/* Quick Actions */}
        <QuickActions 
          onShowNotes={handleShowNotes}
          onShowFeatures={handleShowFeatures}
        />

        {/* Content Area */}
        <div className="relative">
          <Suspense fallback={<ContentSkeleton />}>
            <div className="bg-black/[0.01] border border-white/[0.05] rounded-xl backdrop-blur-sm p-8">
              <TheoryStep 
                material={material} 
                key={material.id}
              />
            </div>
          </Suspense>
        </div>
      </div>

      {/* Side Panels */}
      <NotesSidePanel 
        show={showNotes} 
        onClose={handleCloseNotes}
        materialId={material?.id}
      />
      <FeaturesSidebar 
        show={showFeatures} 
        onClose={handleCloseFeatures}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SquadMaterialView; 