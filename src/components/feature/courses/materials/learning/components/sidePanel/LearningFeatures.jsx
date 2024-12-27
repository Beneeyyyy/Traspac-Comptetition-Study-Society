import { useState } from 'react';
import { FiTarget, FiTrendingUp, FiClock, FiAward, FiUsers, FiStar } from 'react-icons/fi';

const LearningFeatures = ({ material, progress }) => {
  const [showAchievement, setShowAchievement] = useState(false);

  const learningStreak = 5; // Days in a row
  const xpGained = 250;
  const rank = "Pelajar Rajin";
  const nextRank = "Ahli Matematika";
  const xpToNextRank = 500;

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
    },
    {
      icon: FiUsers,
      title: "Kolaborator",
      description: "Bantu 5 teman dalam diskusi",
      progress: 3,
      total: 5
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
            {learningStreak} Hari
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FiTrendingUp className="text-blue-400" />
            </div>
            <span className="text-white/60">XP</span>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            +{xpGained}
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
            {rank}
          </div>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60">Progress Rank</span>
          <span className="text-white/40 text-sm">{xpToNextRank} XP ke {nextRank}</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.02] border border-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${(xpGained / (xpGained + xpToNextRank)) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Pencapaian</h3>
          </div>
          <button
            onClick={() => setShowAchievement(!showAchievement)}
            className="text-white/60 hover:text-white"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const progressPercent = (achievement.progress / achievement.total) * 100;

            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{achievement.title}</span>
                      <span className="text-white/40 text-sm">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
                    <div className="h-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Buddies */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Teman Belajar</h3>
          </div>
          <button className="text-white/60 hover:text-white">Cari Teman</button>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05]" />
              {i === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#0A0A0B]" />
              )}
            </div>
          ))}
          <button className="w-10 h-10 rounded-full bg-white/[0.02] border-2 border-dashed border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white/60">
            +
          </button>
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