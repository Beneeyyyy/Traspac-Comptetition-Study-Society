import { FiX, FiBook, FiClock, FiMap, FiAward } from 'react-icons/fi'

export default function UserDetailModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#0A0A0B] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white/90 transition-colors z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* User Info Header */}
        <div className="relative p-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-6">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user)}&background=0D8ABC&color=fff`}
              alt={user.user}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/30"
            />
            <div>
              <h3 className="text-2xl font-bold text-white">{user.user}</h3>
              <p className="text-white/60">{user.school?.name || 'Unknown School'}</p>
              <p className="text-white/60 mt-1">{user.email}</p>
              <p className="text-purple-400 mt-1">
                <span className="inline-flex items-center">
                  <FiBook className="w-4 h-4 mr-1" />
                  {user.category || 'General'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* User Description */}
        <div className="px-8 py-6 border-b border-white/10">
          <h4 className="text-lg font-medium text-white/80 mb-2">About</h4>
          <p className="text-white/60 leading-relaxed">
            A dedicated student at {user.school?.name || 'their school'} with a strong focus on {user.category || 'learning'}. 
            Based in {user.region || 'their region'}, they have completed {user.coursesCount || 0} courses and invested {user.timeSpent || '0h 0m'} in learning. 
            Their commitment to academic excellence is reflected in their impressive achievement of {(user.points || 0).toLocaleString()} points.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <span className="text-sm text-white/60">{user.category || 'Learning'} Enthusiast</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <span className="text-sm text-white/60">{user.region || 'Local'} Region</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <span className="text-sm text-white/60">{user.coursesCount || 0}+ Courses</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-8">
          {/* Points */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiAward className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/60">Total Points</span>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {(user.points || 0).toLocaleString()}
            </p>
          </div>

          {/* Time Invested */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FiClock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/60">Time Invested</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{user.timeSpent || '0h 0m'}</p>
          </div>

          {/* Courses */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiBook className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/60">Total Courses</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{user.coursesCount || 0}</p>
          </div>

          {/* Region */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FiMap className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/60">Region</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{user.region || 'Unknown'}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-8 pb-8">
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiAward className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/60">Learning Progress</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                  <span>Overall Progress</span>
                  <span className="text-purple-400">75%</span>
                </div>
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 rounded-full" style={{width: '75%'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 