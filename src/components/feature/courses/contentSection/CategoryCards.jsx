import { useNavigate } from 'react-router-dom'
import { FiBook, FiAward, FiArrowRight } from 'react-icons/fi'
import { useEffect } from 'react'

// Stat Item Component
const StatItem = ({ icon: Icon, value, label, iconClass, bgClass }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center`}>
      <Icon className={`text-sm ${iconClass}`} />
    </div>
    <div>
      <div className="font-medium text-white">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  </div>
)

// Category Content Component
const CategoryContent = ({ category }) => (
  <div>
    <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
    <p className="text-white/60 text-sm line-clamp-2 mb-4">{category.description}</p>
    
    <div className="flex items-center gap-6 text-sm text-white/40">
      <StatItem 
        icon={FiBook} 
        value={category._count?.materials || 0} 
        label="Lessons" 
        iconClass="text-blue-400" 
        bgClass="bg-blue-500/10" 
      />
      <StatItem 
        icon={FiAward} 
        value={category._sum?.materials?.pointValue || 0} 
        label="XP Points" 
        iconClass="text-purple-400" 
        bgClass="bg-purple-500/10" 
      />
    </div>
  </div>
)

// Category Footer Component
const CategoryFooter = () => (
  <div className="pt-4 border-t border-white/5">
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-[#0A0A0B] flex items-center justify-center text-xs text-white/60"
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div className="text-sm">
        <span className="text-white/40">Active Students: </span>
        <span className="text-white font-medium">{Math.floor(Math.random() * 500) + 100}</span>
      </div>
    </div>
  </div>
)

// Main Category Cards Component
const CategoryCards = ({ categories, onSelect }) => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🎯 CategoryCards component loaded')
    const loadTime = performance.now()
    console.log(`⏱️ Load time: ${Math.round(loadTime)}ms`)
  }, [])

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No categories available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => {
            console.log('Navigating to category with ID:', category.id)
            navigate(`/courses/${category.id}`)
            if (onSelect) onSelect(category)
          }}
          className="group bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:from-blue-500/10 hover:to-purple-500/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-300"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center shrink-0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                <FiBook className="text-2xl text-blue-400" />
              </div>
              <div className="flex items-center gap-2 text-white/40 group-hover:text-blue-400 transition-colors">
                <span className="text-sm font-medium">Start Learning</span>
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <CategoryContent category={category} />
            <CategoryFooter />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryCards 