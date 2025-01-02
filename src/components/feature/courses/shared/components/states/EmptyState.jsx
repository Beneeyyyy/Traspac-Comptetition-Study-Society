import { FiBook } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const EmptyState = () => {
  const navigate = useNavigate()

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
        <FiBook className="text-2xl text-white/40" />
      </div>
      <h3 className="text-xl font-medium text-white/60 mb-2">No materials available</h3>
      <p className="text-white/40 mb-6">This subcategory doesn't have any materials yet.</p>
      <button 
        onClick={() => navigate(-1)}
        className="px-6 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
      >
        Back to Subcategories
      </button>
    </div>
  )
}

export default EmptyState 