import { motion } from 'framer-motion'

const Background = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0A0A1A]/90" />
      
      {/* Animated Lines */}
      <div className="absolute inset-y-0 left-0 w-1/3">
        <svg className="w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="url(#gradient1)"
            strokeWidth="0.2"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Gradient Orbs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-[35vw] h-[35vw] bg-gradient-to-r from-blue-500/[0.05] via-purple-500/[0.02] to-transparent rounded-full blur-[100px]"
      />
    </div>
  )
}

export default Background 