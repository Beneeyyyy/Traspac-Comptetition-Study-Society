import { FiBook } from 'react-icons/fi'
import Navbar from '../../../../layouts/Navbar'
import Footer from '../../../../layouts/Footer'

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
    <Navbar />
    <main className="relative flex-1">
      {/* Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
      </div>

      {/* Content Wrapper */}
      <div className="relative w-full">
        <section className="py-12 pt-20">
          <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
            {/* Back Button Skeleton */}
            <div className="h-8 w-32 bg-white/[0.02] rounded-lg animate-pulse mb-8" />
            
            {/* Header Skeleton */}
            <div className="space-y-4 mb-12">
              <div className="h-12 w-2/3 bg-white/[0.02] rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-white/[0.02] rounded-lg animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="h-[150px] bg-white/[0.05] animate-pulse" />
                  
                  {/* Content Skeleton */}
                  <div className="p-5">
                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-3 -mt-8 relative z-10">
                      <div className="h-20 bg-white/[0.05] rounded-lg animate-pulse" />
                      <div className="h-20 bg-white/[0.05] rounded-lg animate-pulse" />
                    </div>

                    {/* Footer Skeleton */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-16 bg-white/[0.05] rounded animate-pulse" />
                          <div className="h-3 w-12 bg-white/[0.05] rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
)

export default LoadingSkeleton 