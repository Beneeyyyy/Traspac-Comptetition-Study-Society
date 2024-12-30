import { FiGlobe, FiMap } from 'react-icons/fi'
import { motion } from 'framer-motion'

const scopes = [
  { id: 'national', name: 'National', icon: FiGlobe },
  { id: 'regional', name: 'Regional', icon: FiMap }
];

export default function ScopeSelection({ activeScope, setActiveScope, selectedRegion, onBackToRegion }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setActiveScope('national')}
          className={`px-6 py-2 rounded-lg border transition-all duration-300 ${
            activeScope === 'national'
              ? 'bg-blue-500/20 border-blue-500/50 text-white'
              : 'border-white/10 text-white/60 hover:border-blue-500/30 hover:text-white/90'
          }`}
        >
          National
        </button>
        <button
          onClick={() => setActiveScope('regional')}
          className={`px-6 py-2 rounded-lg border transition-all duration-300 ${
            activeScope === 'regional'
              ? 'bg-blue-500/20 border-blue-500/50 text-white'
              : 'border-white/10 text-white/60 hover:border-blue-500/30 hover:text-white/90'
          }`}
        >
          Regional
        </button>
      </div>

      {/* Back to Region Selection Button */}
      {activeScope === 'regional' && selectedRegion && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex justify-center"
        >
          <button
            onClick={onBackToRegion}
            className="text-sm text-white/60 hover:text-white/90 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Region Selection
          </button>
        </motion.div>
      )}
    </div>
  );
} 