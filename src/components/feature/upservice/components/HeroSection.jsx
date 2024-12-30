import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black/95"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left Content */}
          <div className="flex-1 lg:pr-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Teach What You Love, 
              <span className="text-blue-400 block mt-2">Impact Lives Globally</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-xl">
              Share your expertise with students worldwide. Our platform connects passionate educators with eager learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center">
                <span className="text-xl font-medium">Start Teaching</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-xl font-medium">
                Explore Courses
              </button>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="flex-1 grid grid-cols-2 gap-6 relative">
            {/* Container for Images 1 & 2 - Marquee Top to Bottom */}
            <div className="relative -mt-6">
              <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm relative overflow-hidden h-[600px]">
                {/* Top overlay for smooth transition */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                
                <div className="animate-marquee-down flex flex-col gap-6">
                  {/* First set of images */}
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop" 
                      alt="Teaching 1" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop" 
                      alt="Teaching 2" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=500&h=300&fit=crop" 
                      alt="Teaching 3" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop" 
                      alt="Teaching 4" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&h=300&fit=crop" 
                      alt="Teaching 5" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop" 
                      alt="Teaching 1" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop" 
                      alt="Teaching 2" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Bottom overlay for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
              </div>
            </div>

            {/* Container for Images 3 & 4 - Marquee Bottom to Top */}
            <div className="relative mt-24">
              <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm relative overflow-hidden h-[600px]">
                {/* Top overlay for smooth transition */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                
                <div className="animate-marquee-up flex flex-col gap-6">
                  {/* First set of images */}
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop" 
                      alt="Workshop 1" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500&h=300&fit=crop" 
                      alt="Workshop 2" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop" 
                      alt="Workshop 3" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=300&fit=crop" 
                      alt="Workshop 4" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop" 
                      alt="Workshop 5" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop" 
                      alt="Workshop 1" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white/5 p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500&h=300&fit=crop" 
                      alt="Workshop 2" 
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Bottom overlay for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes marquee-up {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-marquee-down {
          animation: marquee-down 20s linear infinite;
        }

        .animate-marquee-up {
          animation: marquee-up 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroSection 