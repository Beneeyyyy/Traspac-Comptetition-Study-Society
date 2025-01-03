import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiBook, FiAward } from 'react-icons/fi';

export default function SchoolRankings({ scope }) {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/points/schools/rankings${scope !== 'national' ? `?scope=${scope}` : ''}`);
        const data = await response.json();
        if (data.success) {
          setSchools(data.data);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, [scope]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Schools */}
      <div className="flex justify-center items-end gap-4 mb-16 mt-8">
        {schools.slice(0, 3).map((school, index) => {
          const position = index + 1;
          const isFirst = position === 1;
          const scale = isFirst ? 1.1 : 0.95;
          const order = position === 2 ? 0 : position === 1 ? 1 : 2;

          return (
            <motion.div
              key={school.schoolId}
              className="relative"
              style={{ order }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: isFirst ? 0 : 40, scale }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Position Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {position}
                </div>
              </div>

              {/* School Card */}
              <div className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors">
                {/* Avatar/Logo */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={school.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(school.name)}&background=0D8ABC&color=fff`}
                    alt={school.name}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {position}
                  </div>
                </div>

                {/* School Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">{school.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{school.city}, {school.province}</p>
                  <div className="flex justify-center gap-2 text-sm text-gray-400 mb-3">
                    <span>{school.averageStudyTime}</span>
                    <span>•</span>
                    <span>{school.studentCount} students</span>
                  </div>
                  <div className="bg-blue-500 rounded-full py-1 px-4 text-white font-bold">
                    {school.totalPoints.toLocaleString()} points
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Other Schools */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white/90">Other Top Schools</h3>
          </div>
          <div className="divide-y divide-white/10">
            {schools.slice(3).map((school, index) => (
              <motion.div
                key={school.schoolId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 text-right">
                    <span className="text-white/60 font-medium">#{index + 4}</span>
                  </div>
                  
                  {/* School Info */}
                  <div>
                    <h4 className="font-medium text-white/90">{school.name}</h4>
                    <p className="text-sm text-white/60">{school.city}, {school.province}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm text-white/60">Students</p>
                    <p className="font-medium text-blue-400">{school.studentCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Total Points</p>
                    <p className="font-medium text-yellow-500">{school.totalPoints.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Avg. Time</p>
                    <p className="font-medium text-purple-500">{school.averageStudyTime}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 