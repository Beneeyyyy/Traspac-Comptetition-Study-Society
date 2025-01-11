import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiBook, FiUsers, FiArrowLeft } from 'react-icons/fi'
import { useCourse } from '../../../../contexts/CourseContext'
import Footer from '../../../layouts/Footer'
import MaterialCard from './components/MaterialCard'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorState from './components/ErrorState'

const MaterialsPage = () => {
  const { categoryId, subcategoryId } = useParams()
  const navigate = useNavigate()
  const { 
    materials,
    subcategories,
    isLoading,
    error,
    getMaterials
  } = useCourse()

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        // Validate parameters
        if (!categoryId || !subcategoryId) {
          throw new Error('Category ID and Subcategory ID are required');
        }

        // Validate that subcategoryId is a number
        const parsedSubcategoryId = parseInt(subcategoryId, 10);
        if (isNaN(parsedSubcategoryId)) {
          throw new Error('Invalid subcategory ID format');
        }

        await getMaterials(categoryId, parsedSubcategoryId);
      } catch (err) {
        console.error('Error loading materials:', err);
      }
    };

    loadMaterials();
  }, [categoryId, subcategoryId]);

  // If no subcategoryId, redirect back to categories
  if (!subcategoryId) {
    return <ErrorState 
      error="No subcategory selected" 
      onBack={() => navigate(`/courses/${categoryId}`)} 
    />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState 
      error={error} 
      onBack={() => navigate(`/courses/${categoryId}`)} 
    />;
  }

  const subcategory = subcategories.find(sub => sub.id === parseInt(subcategoryId))

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <main className="relative flex-1">
        {/* Top Gradient */}
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        </div>

        {/* Content Wrapper */}
        <div className="relative w-full">
          <section className="py-12 pt-20">
            <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
              {/* Navigation and Stats Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                {/* Back Button */}
                <button 
                  onClick={() => navigate(`/courses/${categoryId}`)}
                  className="flex items-center gap-2 text-white/60 hover:text-white group w-fit"
                >
                  <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Subcategories</span>
                </button>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FiBook className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{materials.length}</div>
                      <div className="text-xs">Materials</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <FiUsers className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{Math.floor(Math.random() * 1000) + 500}</div>
                      <div className="text-xs">Active Students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subcategory Header */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-sm font-medium text-blue-400">{subcategory?.name}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Available Materials</h1>
                <p className="text-lg text-white/60 max-w-2xl">{subcategory?.description}</p>
              </div>

              {/* Materials Grid */}
              {materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      categoryId={categoryId}
                      subcategoryId={subcategoryId}
                      onClick={() => navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/learn/${material.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FiBook className="text-2xl text-white/40" />
                  </div>
                  <h3 className="text-xl font-medium text-white/60 mb-2">No materials available</h3>
                  <p className="text-white/40 mb-6">This subcategory doesn't have any materials yet.</p>
                  <button 
                    onClick={() => navigate(`/courses/${categoryId}`)}
                    className="px-6 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Explore Other Subcategories
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MaterialsPage 