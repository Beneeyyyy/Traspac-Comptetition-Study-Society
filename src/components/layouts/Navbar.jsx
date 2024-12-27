import { Link, useLocation } from 'react-router-dom'
import React from 'react'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Courses', href: '/courses' },
    { name: 'Community', href: '/community' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Up Creation', href: '/upcreation' },
    { name: 'Up Service', href: '/upservice' }
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50">
      <div className="relative bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/10">
        <div className="container max-w-screen-2xl mx-auto px-4">
          {/* Light effect lines */}
          <div className="absolute bottom-0 inset-x-0">
            {/* Static center glow */}
            <div className="absolute inset-x-0 h-[1px]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>
            
            {/* Animated lines */}
            <div className="absolute inset-x-0 h-[2px] overflow-hidden">
              {/* Left line */}
              <div className="absolute left-1/2 w-1/3 h-full -translate-x-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 animate-line-to-center" />
              </div>
              
              {/* Right line */}
              <div className="absolute right-1/2 w-1/3 h-full translate-x-full">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-500 animate-line-to-center" />
              </div>

              {/* Center glow */}
              <div className="absolute left-1/2 -translate-x-1/2 w-32 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse-slow" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/src/assets/images/logo/lemur.svg" alt="Logo" className="w-8 h-8" />
              <span className="text-white font-semibold">StudySociety</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Profile */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar