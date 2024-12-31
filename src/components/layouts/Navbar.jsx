import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/check-auth', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (response.ok) {
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/signout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setIsAuthenticated(false)
        setUser(null)
        setShowProfileMenu(false)
        navigate('/login')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <Link to="/about" className="text-white/60 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/features" className="text-white/60 hover:text-white transition-colors">
                  Features
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons or Profile */}
          <div className="relative">
            {isAuthenticated ? (
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all"
              >
                <img 
                  src={user?.image}
                  alt={`${user?.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`;
                  }}
                />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <AnimatePresence>
              {showProfileMenu && isAuthenticated && (
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
                    onClick={handleSignOut}
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