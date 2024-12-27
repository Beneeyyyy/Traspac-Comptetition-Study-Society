import { FiArrowRight } from 'react-icons/fi'

export const CategoryHeader = () => (
  <header className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Learning Paths</h2>
      <p className="text-white/60">Choose your path and start learning today</p>
    </div>
    <button className="px-5 py-2.5 rounded-xl text-sm text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/5">
      View All
    </button>
  </header>
)

export default CategoryHeader 