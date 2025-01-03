import { useState, useEffect } from 'react';
import { FiTarget, FiTrendingUp, FiClock, FiAward, FiStar } from 'react-icons/fi';
import { useAuth } from '../../../../../../../context/AuthContext';

const LearningFeatures = ({ material }) => {
  const { user } = useAuth();
  const [showAchievement, setShowAchievement] = useState(false);
  const [learningStats, setLearningStats] = useState({
    streak: 0,
    todayXP: 0
  });

  // Fetch learning stats
  useEffect(() => {
    const fetchLearningStats = async () => {
      try {
        console.log('🔄 Fetching learning stats for user:', user.id);
        
        // Get user points
        const pointsResponse = await fetch(`http://localhost:3000/api/points/user/${user.id}`);
        
        // Log raw response for debugging
        console.log('🌐 Raw response:', {
          status: pointsResponse.status,
          statusText: pointsResponse.statusText,
        });

        // Check if response is ok before parsing
        if (!pointsResponse.ok) {
          const errorText = await pointsResponse.text();
          throw new Error(`Failed to fetch points: ${pointsResponse.status} - ${errorText}`);
        }

        const pointsData = await pointsResponse.json();
        console.log('📊 Raw points data:', pointsData);

        if (!pointsData || !pointsData.success) {
          throw new Error('Invalid points data format');
        }

        if (!Array.isArray(pointsData.data)) {
          console.warn('⚠️ Points data is not an array:', pointsData.data);
          return;
        }

        // Get today's date at start of day for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('📅 Today reference:', {
          date: today.toISOString(),
          timestamp: today.getTime()
        });

        // Calculate total XP gained today from all sources
        const todayPoints = pointsData.data.filter(point => {
          if (!point || !point.createdAt) {
            console.warn('⚠️ Invalid point data:', point);
            return false;
          }

          const pointDate = new Date(point.createdAt);
          pointDate.setHours(0, 0, 0, 0);
          const isToday = pointDate.getTime() === today.getTime();
          
          console.log('🔍 Point date check:', {
            pointId: point.id,
            value: point.value,
            createdAt: point.createdAt,
            pointDate: pointDate.toISOString(),
            pointTimestamp: pointDate.getTime(),
            todayTimestamp: today.getTime(),
            isToday,
            materialId: point.materialId,
            materialTitle: point.material?.title
          });

          return isToday;
        });

        const todayXP = todayPoints.reduce((sum, point) => {
          const value = parseInt(point.value) || 0;
          console.log('➕ Adding point:', {
            pointId: point.id,
            value,
            currentSum: sum,
            newSum: sum + value,
            materialTitle: point.material?.title,
            createdAt: point.createdAt
          });
          return sum + value;
        }, 0);

        console.log('📊 Today\'s XP calculation:', {
          totalPoints: pointsData.data.length,
          todayPoints: todayPoints.length,
          todayXP,
          pointsList: todayPoints.map(p => ({
            id: p.id,
            value: p.value,
            createdAt: p.createdAt,
            materialId: p.materialId,
            materialTitle: p.material?.title
          }))
        });

        setLearningStats({
          streak: user.studyStreak || 0,
          todayXP
        });

        console.log('✅ Learning stats updated:', {
          streak: user.studyStreak,
          todayXP,
          todayPoints: todayPoints.length
        });
      } catch (error) {
        console.error('❌ Error fetching learning stats:', {
          message: error.message,
          error
        });
        // Set default values on error
        setLearningStats({
          streak: user.studyStreak || 0,
          todayXP: 0
        });
      }
    };

    if (user?.id) {
      fetchLearningStats();
    }
  }, [user?.id, user?.studyStreak]);

  // Add interval to refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        console.log('🔄 Refreshing learning stats...');
        fetchLearningStats();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user?.id]);

  const achievements = [
    {
      icon: FiTarget,
      title: "Fokus Tinggi",
      description: "Selesaikan 3 materi dalam sehari",
      progress: 2,
      total: 3
    },
    {
      icon: FiTrendingUp,
      title: "Konsisten",
      description: "Belajar 7 hari berturut-turut",
      progress: 5,
      total: 7
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FiClock className="text-blue-400" />
            </div>
            <span className="text-white/60">Streak</span>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {learningStats.streak} Hari
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FiTrendingUp className="text-blue-400" />
            </div>
            <span className="text-white/60">XP Hari Ini</span>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            +{learningStats.todayXP}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FiAward className="text-blue-400" />
            </div>
            <span className="text-white/60">Rank</span>
          </div>
          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {user?.rank || 'Pemula'}
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FiStar className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Tantangan Harian</h3>
            <p className="text-white/60 text-sm">Selesaikan untuk dapat 100 XP bonus!</p>
          </div>
        </div>
        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600">
          Mulai Tantangan
        </button>
      </div>
    </div>
  );
};

export default LearningFeatures; 