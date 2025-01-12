import { FiBook, FiArrowRight, FiClock, FiCheckCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const MaterialCard = ({ material, categoryId, subcategoryId, onClick }) => {
  const navigate = useNavigate()

  return (
    <div
      className="group relative bg-black hover:bg-gradient-to-t hover:from-blue-500/5 hover:to-transparent border border-white/[0.08] hover:border-blue-500/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
      onClick={() => navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/learn/${material.id}`)}
    >
      <div className="relative flex flex-col">
        {/* Image Section with Overlaid Content */}
        <div className="relative h-[150px] w-full overflow-hidden rounded-t-2xl">
          {material.image ? (
            <div className="absolute inset-0 h-[150px] overflow-hidden">
              <img 
                src={material.image} 
                alt={material.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <FiBook className="text-5xl text-blue-400/50" />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 h-[150px] bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute inset-0 h-[150px] bg-gradient-to-r from-black/50 via-transparent to-black/70" />

          {/* Progress Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-blue-500/20 transition-colors duration-500">
              <FiCheckCircle className="text-green-400 text-base" />
            </div>
          </div>

          {/* Title and Description Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 z-10">
            <h3 className="text-xl font-semibold text-white mb-2">
              {material.title}
            </h3>
            <p className="text-base text-white/80 line-clamp-1 group-hover:text-white/90 transition-colors duration-300">
              {material.description}
            </p>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="pb-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 px-4 -mt-3 relative z-20">
            <div className="bg-black hover:bg-blue-500/5 rounded-lg p-3 border border-white/[0.05] group-hover:border-blue-500/20 transition-all duration-500">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <FiBook className="text-blue-400" />
                <span>Points</span>
              </div>
              <div className="text-base font-medium text-white">{material.pointValue} XP</div>
            </div>
            <div className="bg-black hover:bg-purple-500/5 rounded-lg p-3 border border-white/[0.05] group-hover:border-purple-500/20 transition-all duration-500">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <FiClock className="text-purple-400" />
                <span>Duration</span>
              </div>
              <div className="text-base font-medium text-white">{Math.floor(Math.random() * 120) + 30} mins</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/40">Progress</span>
              <span className="text-white font-medium">
                {Math.floor(Math.random() * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.02] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform origin-left group-hover:scale-x-105 transition-transform duration-500"
                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pt-4 mt-4 border-t border-white/[0.05] group-hover:border-blue-500/10 transition-colors duration-500">
            <div className="flex -space-x-1.5">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-[#0A0A0B] flex items-center justify-center text-[8px] text-white/60"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/60 group-hover:text-blue-400 transition-colors duration-300">
              <span className="text-sm font-medium">Start Learning</span>
              <FiArrowRight className="text-base transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialCard 