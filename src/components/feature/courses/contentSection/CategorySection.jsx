import { lazy, Suspense } from 'react'

const CategoryHeader = lazy(() => import('./CategoryHeader'))
const CategorySkeletons = lazy(() => import('./CategorySkeletons'))
const CategoryCards = lazy(() => import('./CategoryCards'))

export const CategorySection = ({ 
  categories, 
  isLoading, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <section className="min-h-screen py-20">
      <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="space-y-8">
          <Suspense fallback={
            <div className="h-20 bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />
          }>
            <CategoryHeader />
          </Suspense>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />
              ))}
            </div>
          }>
            {isLoading ? (
              <CategorySkeletons />
            ) : (
              <CategoryCards 
                categories={categories} 
                onSelect={setSelectedCategory} 
              />
            )}
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default CategorySection 