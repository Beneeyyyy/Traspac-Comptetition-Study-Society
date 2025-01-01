import { useState, Suspense, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';
import { RiBookLine, RiLightbulbLine } from 'react-icons/ri';

import {
  TopNavigation,
  ContentSkeleton,
  SectionsList,
  ContentRenderer,
  QuickTips,
  QuickQuiz
} from './components';

const TheoryStep = ({ material }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mainContentRef = useRef(null);
  
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();

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

  const handleBackToMaterials = () => {
    navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/materials`);
  };

  // Debug logs
  console.log('Material Data:', {
    id: material?.id,
    title: material?.title,
    stages: material?.stages?.map(stage => ({
      id: stage.id,
      title: stage.title,
      order: stage.order,
      contents: stage.contents
    }))
  });

  const currentStage = material?.stages?.[activeSection];
  const sortedContents = currentStage?.contents?.sort((a, b) => a.order - b.order) || [];
  const currentContent = sortedContents[activeContentIndex];

  useEffect(() => {
    setActiveContentIndex(0);
  }, [activeSection]);

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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Navigation */}
      <TopNavigation 
        section={currentStage} 
        onBack={handleBackToMaterials}
        show={showNav}
      />

      <div className={`fixed inset-0 transition-all duration-300 ${showNav ? 'top-[160px]' : 'top-0'} bottom-0 flex`}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowLeftSidebar(true)}
          className="lg:hidden fixed left-4 top-4 z-50 p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Left Sidebar - Fixed */}
        <aside className={`
          fixed left-0 ${showNav ? 'top-[160px]' : 'top-0'} bottom-0 w-80 lg:w-72 
          bg-black/80 backdrop-blur-lg border-r border-white/[0.05]
          transition-all duration-300 z-40 overflow-y-auto
          ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <SectionsList 
              material={material}
              activeSection={activeSection}
              onSectionChange={(index) => {
                setActiveSection(index);
                setShowLeftSidebar(false);
              }}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main ref={mainContentRef} className="flex-1 ml-0 lg:ml-72 overflow-y-auto">
          <div className="min-h-full">
            <div className="max-w-[2000px] mx-auto px-4 lg:px-8 py-8">
              {/* Welcome Message - Only show on first stage */}
              {activeSection === 0 && currentStage?.order === 1 && (
                <div className="flex flex-col items-center gap-6 mb-12 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <RiBookLine className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Selamat datang di pembelajaran {material.title}!
                    </h2>
                    <p className="text-white/60 max-w-2xl">
                      Mari kita mulai petualangan belajar yang menyenangkan. Setiap langkah membawamu lebih dekat ke penguasaan materi!
                    </p>
                  </div>
                </div>
              )}

              <Suspense fallback={<ContentSkeleton />}>
                {/* Stage Progress */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <RiLightbulbLine className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{currentStage?.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-white/5 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ 
                              width: sortedContents.length 
                                ? `${((activeContentIndex + 1) / sortedContents.length) * 100}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-white/60">
                          Content {activeContentIndex + 1} dari {sortedContents.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  {currentStage?.contents && (
                    <ContentRenderer 
                      contents={currentStage.contents}
                      currentStage={currentStage}
                    />
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/[0.05]">
                  <button
                    onClick={handlePrevious}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeContentIndex > 0 || activeSection > 0
                        ? 'text-white/80 hover:text-white hover:bg-white/5' 
                        : 'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={activeContentIndex === 0 && activeSection === 0}
                  >
                    <FiArrowLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      (activeContentIndex < sortedContents.length - 1) || (material?.stages && activeSection < material.stages.length - 1)
                        ? 'text-white/80 hover:text-white hover:bg-white/5' 
                        : 'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={activeContentIndex === sortedContents.length - 1 && (!material?.stages || activeSection === material.stages.length - 1)}
                  >
                    <span>Next</span>
                    <FiArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </Suspense>
            </div>
          </div>
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        />
      )}
    </div>
  );
};

export default TheoryStep; 