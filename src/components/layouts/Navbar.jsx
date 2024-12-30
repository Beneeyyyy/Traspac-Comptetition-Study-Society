import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            StudySociety
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/courses" className="text-white/60 hover:text-white transition-colors">
              Courses
            </Link>
            <Link to="/community" className="text-white/60 hover:text-white transition-colors">
              Community
            </Link>
            <Link to="/leaderboard" className="text-white/60 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link to="/upcreation" className="text-white/60 hover:text-white transition-colors">
              Up Creation
            </Link>
            <Link to="/upservice" className="text-white/60 hover:text-white transition-colors">
              Up Service
            </Link>
          </div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all"
            >
              <img 
                src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 py-2 bg-[#1A1A1B] rounded-xl border border-white/10 shadow-xl"
                >
                  <Link 
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span className="text-lg">👤</span>
                    Profile
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span className="text-lg">⚙️</span>
                    Settings
                  </Link>
                  <div className="h-px bg-white/10 my-2" />
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false)
                      // Handle sign out
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <span className="text-lg">🚪</span>
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}