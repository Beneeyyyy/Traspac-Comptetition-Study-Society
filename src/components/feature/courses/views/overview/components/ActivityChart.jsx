import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiAward, FiTarget } from 'react-icons/fi'

const fadeInVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const ActivityChart = () => {
  const [selectedWeek, setSelectedWeek] = useState('This Week')

  const WEEKLY_ACTIVITY = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hours: [2.5, 1.8, 3.2, 2.0, 2.8, 4.0, 3.5]
  }
  
  const STATS = [
    {
      icon: FiZap,
      label: "Study Streak",
      value: "7 days",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/5",
      borderColor: "border-yellow-400/10",
      gradient: "from-yellow-400/10 to-yellow-400/0"
    },
    {
      icon: FiAward,
      label: "Total XP",
      value: "2840 points",
      color: "text-purple-400",
      bgColor: "bg-purple-400/5",
      borderColor: "border-purple-400/10",
      gradient: "from-purple-400/10 to-purple-400/0"
    },
    {
      icon: FiTarget,
      label: "Daily Goals",
      value: "2/3",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/5",
      borderColor: "border-emerald-400/10",
      gradient: "from-emerald-400/10 to-emerald-400/0"
    }
  ]

  return (
    <motion.section 
      className="mt-20"
      initial="hidden"
      animate="visible"
      variants={fadeInVariant}
    >
      <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Activity Chart */}
          <motion.div 
            className="lg:col-span-7"
            variants={fadeInVariant}
          >
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-medium text-white/90">Weekly Activity</h3>
                  <p className="text-xs text-white/50">Your learning progress</p>
                </div>
                <select 
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/60 focus:outline-none hover:bg-white/10 transition-colors"
                >
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              <div className="h-[85px] relative w-full mb-4">
                {/* Hours markers */}
                <div className="absolute -left-1 inset-y-0 w-6 flex flex-col justify-between text-[10px] text-white/40">
                  {[4, 3, 2, 1, 0].map((hour) => (
                    <span key={hour} className="font-medium">{hour}h</span>
                  ))}
                </div>

                {/* Grid lines */}
                <div className="absolute left-5 right-0 inset-y-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full border-t border-white/5"
                    />
                  ))}
                </div>

                {/* Chart line */}
                <div className="absolute left-5 right-0 inset-y-0 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.08 }} />
                        <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d={`
                        M 0,${100 - (WEEKLY_ACTIVITY.hours[0] / 4.5) * 100} 
                        ${WEEKLY_ACTIVITY.hours.map((hours, index) => {
                          const x = index * (100 / 6)
                          const y = 100 - (hours / 4.5) * 100
                          return `L ${x},${y}`
                        }).join(' ')} 
                        L 100,${100 - (WEEKLY_ACTIVITY.hours[6] / 4.5) * 100}
                        L 100,100 
                        L 0,100 Z
                      `}
                      fill="url(#chartGradient)"
                    />
                    {/* Line */}
                    <path
                      d={`
                        M 0,${100 - (WEEKLY_ACTIVITY.hours[0] / 4.5) * 100} 
                        ${WEEKLY_ACTIVITY.hours.map((hours, index) => {
                          const x = index * (100 / 6)
                          const y = 100 - (hours / 4.5) * 100
                          return `L ${x},${y}`
                        }).join(' ')}
                      `}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Days labels */}
                <div className="absolute -bottom-5 left-5 right-0 flex justify-between">
                  {WEEKLY_ACTIVITY.days.map((day, index) => (
                    <div 
                      key={index}
                      className="text-[11px] font-medium text-white/40"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Stats */}
              <div 
                className="grid grid-cols-3 gap-6 px-1 pt-4 border-t border-white/5"
              >
                <div>
                  <div className="text-white/40 text-[11px] mb-0.5">Average</div>
                  <div className="text-white/90 text-sm font-medium">2.8h / day</div>
                </div>
                <div>
                  <div className="text-white/40 text-[11px] mb-0.5">Total</div>
                  <div className="text-white/90 text-sm font-medium">19.8h</div>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-[11px] mb-0.5">Progress</div>
                  <div className="text-emerald-400 text-sm font-medium">+12.5%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="lg:col-span-5"
            variants={fadeInVariant}
          >
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-medium text-white/90">Quick Stats</h3>
                  <p className="text-xs text-white/50">Your achievements</p>
                </div>
              </div>
              <div className="space-y-3">
                {STATS.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInVariant}
                    custom={index}
                    className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`text-base ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white/50 mb-0.5">{stat.label}</div>
                      <div className={`text-sm font-medium truncate ${stat.color}`}>{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default ActivityChart 