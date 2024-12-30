import { motion } from 'framer-motion'
import { FiAward, FiBook, FiTarget, FiTrendingUp } from 'react-icons/fi'

export default function AchievementTab() {
  const achievements = [
    {
      id: 1,
      title: "Pengenalan",
      desc: "Menyelesaikan materi pembelajaran pertama",
      status: "current",
      reward: "25 XP",
      color: "blue",
      time: "15-20 menit",
      progress: 100,
      icon: <FiBook className="w-5 h-5 text-blue-400" />
    },
    {
      id: 2,
      title: "Eksplorasi",
      desc: "Menyelesaikan 5 materi pembelajaran",
      status: "locked",
      reward: "35 XP",
      color: "purple",
      time: "20-25 menit",
      progress: 60,
      icon: <FiTarget className="w-5 h-5 text-purple-400" />,
      opacity: 0.6
    },
    {
      id: 3,
      title: "Praktik",
      desc: "Menyelesaikan 3 kuis dengan nilai sempurna",
      status: "locked",
      reward: "40 XP",
      color: "emerald",
      time: "25-30 menit",
      progress: 33,
      icon: <FiTrendingUp className="w-5 h-5 text-emerald-400" />,
      opacity: 0.3
    }
  ]

  return (
    <div className="w-full space-y-8 px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative px-8 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Achievement
              </h1>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-white/60">Level 1</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-lg text-white/60">Pemula</span>
              </div>
            </div>

            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Setiap langkah belajarmu akan membuka achievement baru. Terus belajar dan kumpulkan semua achievement!
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-yellow-400">100 XP</div>
                <div className="text-sm text-white/40">Total XP</div>
              </div>
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-blue-400">3 Bagian</div>
                <div className="text-sm text-white/40">Achievement</div>
              </div>
              <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <div className="text-xl font-semibold text-purple-400">60 Menit</div>
                <div className="text-sm text-white/40">Estimasi Waktu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Path */}
      <div className="relative">
        <div className="absolute top-0 left-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent" />
        <div className="space-y-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="relative p-6 rounded-2xl bg-black/[0.02] border border-white/[0.05]">
                {/* Connection Line */}
                <div className="absolute -left-10 top-1/2 w-4 h-[2px] bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                
                {/* Content */}
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${achievement.color}-500/20 to-${achievement.color}-500/10 flex items-center justify-center`}>
                    {achievement.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{achievement.title}</h3>
                        <p className="text-white/60 mt-1">{achievement.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <FiAward className="text-yellow-400" />
                          <span className="text-yellow-400">{achievement.reward}</span>
                        </div>
                        <span className="text-white/60 text-sm">{achievement.progress}% Selesai</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-white/[0.02] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-${achievement.color}-500 to-${achievement.color}-400`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lock Overlay with Gradient */}
                {achievement.status === 'locked' && (
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(180deg, 
                        rgba(0, 0, 0, ${0.3 + index * 0.3}) 0%, 
                        rgba(0, 0, 0, ${0.5 + index * 0.3}) 100%)`
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 