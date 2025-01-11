import { motion } from 'framer-motion'

const fadeInUpVariant = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: "easeOut"
    }
  }
};

const containerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const StatItem = ({ icon, value, label, index }) => (
  <motion.div 
    className="group"
    variants={fadeInUpVariant}
  >
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <span className="text-4xl mb-2" role="img" aria-label={label}>{icon}</span>
      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {value}
      </span>
      <span className="text-sm text-white/60 mt-2">{label}</span>
    </div>
  </motion.div>
);

// Data statis untuk stats dan features
const STATS_DATA = [
  { label: 'Active Learners', value: '25K+', icon: '👥' },
  { label: 'Course Materials', value: '1.2K+', icon: '📚' },
  { label: 'Success Rate', value: '98%', icon: '🎯' },
  { label: 'Daily Active Users', value: '12K+', icon: '📈' }
];

const FEATURES_DATA = [
  'Interactive Learning',
  'Progress Tracking',
  'Gamified Experience',
  'Expert Support'
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Abstract Background Elements */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] rotate-12" />
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariant}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column */}
              <motion.div 
                className="space-y-8"
                variants={fadeInUpVariant}
              >
                {/* Floating Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white/80">Welcome to Study Society</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Elevate Your
                  </span>
                  <span className="block mt-2">Learning Journey</span>
                </h1>

                <p className="text-lg text-white/60 max-w-xl">
                  Experience education reimagined through gamification. Join a community 
                  where learning becomes an exciting adventure of discovery and achievement.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl overflow-hidden"
                    aria-label="Start Learning"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative">Start Learning</span>
                  </button>
                  <button 
                    className="px-8 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                    aria-label="Watch Demo"
                  >
                    Watch Demo
                  </button>
                </div>
              </motion.div>

              {/* Right Column - Stats Display */}
              <motion.div 
                className="relative"
                variants={fadeInUpVariant}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                  <div className="flex items-center justify-center w-full h-full">
                    <img 
                      src="https://media.giphy.com/media/YMRQOBkN4xQGSWCMG3/giphy.gif"
                      alt="Learning Animation"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <motion.section 
            className="py-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariant}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES_DATA.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUpVariant}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative">
                    <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">{feature}</h3>
                    <p className="mt-2 text-white/60">Experience learning like never before with our innovative platform.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  )
}

export default LandingPage 