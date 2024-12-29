import { FiBook, FiClock, FiUsers, FiLock, FiUnlock, FiPlay, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'

const CircularProgress = ({ progress, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-blue-500 transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-white">{progress}%</span>
      </div>
    </div>
  )
}

const LearningSection = ({ squad, isAdmin }) => {
  // Mock data for learning materials
  const learningData = {
    activeCourse: {
      title: "React Advanced Patterns",
      progress: 65,
      nextLesson: "Custom Hooks Deep Dive",
      timeLeft: "2 hours"
    },
    courses: [
      {
        id: 1,
        title: "React Advanced Patterns",
        description: "Master advanced React patterns and best practices",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300",
        totalLessons: 12,
        completedLessons: 8,
        enrolledUsers: 48,
        isLocked: false,
        tags: ["React", "Advanced"],
        progress: 67
      },
      {
        id: 2,
        title: "TypeScript Fundamentals",
        description: "Learn TypeScript from basics to advanced concepts",
        image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&q=80&w=300",
        totalLessons: 10,
        completedLessons: 10,
        enrolledUsers: 35,
        isLocked: false,
        tags: ["TypeScript", "Beginner"],
        progress: 100
      },
      {
        id: 3,
        title: "Node.js API Development",
        description: "Build scalable APIs with Node.js and Express",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=300",
        totalLessons: 15,
        completedLessons: 0,
        enrolledUsers: 27,
        isLocked: true,
        tags: ["Node.js", "API", "Backend"],
        progress: 0
      }
    ],
    popularTopics: [
      {
        title: "Frontend Development",
        count: 15,
        icon: FiBook
      },
      {
        title: "Backend Development",
        count: 12,
        icon: FiTrendingUp
      },
      {
        title: "Database Design",
        count: 8,
        icon: FiBook
      }
    ]
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Active Course Progress */}
        {learningData.activeCourse && (
          <div className="bg-[#0A0A0A] rounded-xl p-6 border border-gray-800 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiPlay className="text-green-400" />
                Continue Learning
              </h3>
              <span className="text-sm text-gray-400">
                <FiClock className="inline mr-1" />
                {learningData.activeCourse.timeLeft} left
              </span>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <CircularProgress progress={learningData.activeCourse.progress} size={80} />
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{learningData.activeCourse.title}</h4>
                <p className="text-gray-400">Next: {learningData.activeCourse.nextLesson}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">6 of 12 lessons</span>
                </div>
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
              <FiPlay />
              Continue Learning
            </button>
          </div>
        )}

        {/* Available Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiBook className="text-blue-400" />
              Available Courses
            </h3>
            {isAdmin && (
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors">
                Add Course
              </button>
            )}
          </div>

          <div className="space-y-4">
            {learningData.courses.map((course) => (
              <div 
                key={course.id}
                className="bg-[#0A0A0A] rounded-xl border border-gray-800 overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto relative">
                    <img 
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <FiLock className="text-2xl text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-2">{course.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <CircularProgress progress={course.progress} size={48} />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <FiBook />
                          <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <FiUsers />
                          <span>{course.enrolledUsers} Enrolled</span>
                        </div>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          course.isLocked
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        disabled={course.isLocked}
                      >
                        {course.isLocked ? (
                          <span className="flex items-center gap-1">
                            <FiLock />
                            Locked
                          </span>
                        ) : course.completedLessons === 0 ? (
                          'Start Learning'
                        ) : course.completedLessons === course.totalLessons ? (
                          'Review Course'
                        ) : (
                          'Continue'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Popular Topics */}
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-gray-800 transform hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-lg font-bold text-white mb-4">Popular Topics</h3>
          <div className="space-y-4">
            {learningData.popularTopics.map((topic, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <topic.icon className="text-blue-400" />
                  </div>
                  <span className="text-white font-medium">{topic.title}</span>
                </div>
                <span className="text-sm text-gray-400">{topic.count} courses</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningSection 