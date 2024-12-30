import { motion } from 'framer-motion'

export default function ProfileHeader({ userData }) {
  return (
    <div className="relative mb-12">
      {/* Banner Image - Half Height */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-2xl">
        <img 
          src={userData.bannerImage || "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=2047&auto=format&fit=crop"}
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-32 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col md:flex-row gap-8 p-8 rounded-2xl bg-white/[0.02] border border-white/10"
      >
        {/* Left Side - Profile Image & Quick Stats */}
        <div className="md:w-1/3 flex flex-col gap-4">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 transition-all group-hover:border-white/20">
              <img 
                src={userData.image} 
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm">✏️</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="px-4 py-2 rounded-lg bg-white/[0.02] border border-white/10">
              <span className="text-sm text-white/60">Rank</span>
              <p className="font-medium text-gradient">{userData.stats.rank}</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/[0.02] border border-white/10">
              <span className="text-sm text-white/60">Points</span>
              <p className="font-medium">{userData.stats.totalPoints}</p>
            </div>
          </div>

          {/* Time Screen Card */}
          <div className="flex-1 w-full p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-sm text-white/60 mb-1">Time Spent</h3>
                <div className="text-3xl font-bold">
                  {userData.stats.studyHours}h
                </div>
                <p className="text-sm text-white/60 mt-2">Total time on platform</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">Today</span>
                  <span className="text-sm font-medium">2h 15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">This Week</span>
                  <span className="text-sm font-medium">12h 30m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - User Info & Description */}
        <div className="md:w-2/3 space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
            <p className="text-white/60">{userData.school}</p>
            <p className="text-lg text-white mt-4 font-medium italic">{userData.bio}</p>
          </div>

          {/* Interests & Goals */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-white/60 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/10 text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-white/60 mb-2">Current Goal</h3>
              <div className="flex items-center gap-2 text-white/80">
       
                {userData.currentGoal}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-bold">{userData.stats.completedCourses}</div>
              <div className="text-sm text-white/60">Courses</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-bold">45h</div>
              <div className="text-sm text-white/60">Rata-rata/minggu</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-bold">{userData.stats.achievements}</div>
              <div className="text-sm text-white/60">Achievements</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-bold">
                <span className="text-sm">Since</span> {userData.joinedDate}
              </div>
              <div className="text-sm text-white/60">Member</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 