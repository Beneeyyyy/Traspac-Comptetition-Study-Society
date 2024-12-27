import { FiBook, FiArrowRight, FiUsers } from 'react-icons/fi'

const SubCategoryCard = ({ subcategory, onClick }) => {
  return (
    <div
      className="group relative bg-black hover:bg-gradient-to-t hover:from-blue-500/5 hover:to-transparent border border-white/[0.08] hover:border-blue-500/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
      onClick={onClick}
    >
      <div className="relative flex flex-col">
        {/* Image Section with Overlaid Content */}
        <div className="relative h-[150px] w-full overflow-hidden rounded-t-2xl">
          {subcategory.image ? (
            <div className="absolute inset-0 h-[150px] overflow-hidden">
              <img 
                src={subcategory.image} 
                alt={subcategory.name}
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

          {/* Title and Description Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 z-10">
            <h3 className="text-xl font-semibold text-white mb-2">
              {subcategory.name}
            </h3>
            <p className="text-base text-white/80 line-clamp-1 group-hover:text-white/90 transition-colors duration-300">
              {subcategory.description}
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
                <span>Materials</span>
              </div>
              <div className="text-base font-medium text-white">{subcategory.materialCount || 0}</div>
            </div>
            <div className="bg-black hover:bg-purple-500/5 rounded-lg p-3 border border-white/[0.05] group-hover:border-purple-500/20 transition-all duration-500">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <FiUsers className="text-purple-400" />
                <span>Students</span>
              </div>
              <div className="text-base font-medium text-white">{Math.floor(Math.random() * 500) + 100}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pt-4 mt-4 border-t border-white/[0.05] group-hover:border-blue-500/10 transition-colors duration-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FiBook className="text-blue-400" />
              </div>
              <div className="text-sm text-white/60">
                <div className="font-medium text-white">Level {subcategory.level || 1}</div>
                <div className="text-xs">Difficulty</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/60 group-hover:text-blue-400 transition-colors duration-300">
              <span className="text-sm font-medium">View Materials</span>
              <FiArrowRight className="text-base transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubCategoryCard 