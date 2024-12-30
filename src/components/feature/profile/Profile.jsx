import { motion } from 'framer-motion'
import { useState } from 'react'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import ProfileHeader from './components/ProfileHeader'
import TabNavigation from './components/TabNavigation'
import OverviewTab from './components/OverviewTab'
import AchievementTab from './components/AchievementTab'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Dummy data - akan diganti dengan data dari backend
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    school: "SMA Negeri 1 Jakarta",
    joinedDate: "January 2024",
    image: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    bio: "Passionate learner | Math & Physics Enthusiast",
    interests: ["Mathematics", "Physics", "Computer Science"],
    currentGoal: "Master Advanced Calculus",
    stats: {
      totalPoints: 1250,
      completedCourses: 15,
      studyHours: 45,
      achievements: 8,
      rank: "Gold Scholar"
    },
    recentActivities: [
      {
        type: "course_completed",
        title: "Advanced Mathematics",
        date: "2 days ago",
        points: 100
      },
      {
        type: "achievement_earned",
        title: "Quick Learner",
        date: "5 days ago",
        points: 50
      },
      {
        type: "joined_group",
        title: "Physics Study Group",
        date: "1 week ago"
      }
    ],
    achievements: [
      {
        title: "Fast Learner",
        description: "Complete 5 courses in a week",
        icon: "🚀",
        earned: true
      },
      {
        title: "Math Wizard",
        description: "Score perfect in 3 math quizzes",
        icon: "🧙‍♂️",
        earned: true
      },
      {
        title: "Team Player",
        description: "Join 3 study groups",
        icon: "👥",
        earned: false
      }
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <ProfileHeader userData={userData} />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab userData={userData} />}

            {activeTab === 'achievements' && <AchievementTab />}

            {activeTab === 'courses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Courses</h2>
                {/* Courses content */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                {/* Settings content */}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />    
    </div>
  )
} 