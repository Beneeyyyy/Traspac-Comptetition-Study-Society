import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function SchoolRankings({ scope = 'national' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolRankings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Ensure scope is a string
        const scopeParam = typeof scope === 'string' ? scope : 'national';
        console.log('Fetching school rankings with scope:', scopeParam);
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/points/schools/rankings?scope=${scopeParam}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch school rankings');
        }

        const data = await response.json();
        console.log('School rankings response:', data);
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch school rankings');
        }

        if (!Array.isArray(data.data)) {
          console.error('Invalid data format - expected array:', data.data);
          throw new Error('Invalid data format received from server');
        }

        setSchools(data.data);
      } catch (err) {
        console.error('Error fetching school rankings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolRankings();
  }, [scope]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!Array.isArray(schools) || schools.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No schools found for this region</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">
        {scope === 'national' ? 'National School Rankings' : `School Rankings - ${scope}`}
      </h2>

      <div className="grid gap-4">
        {schools.map((school, index) => {
          console.log('Rendering school:', school);
          
          if (!school || typeof school !== 'object') {
            console.error('Invalid school data:', school);
            return null;
          }

          return (
            <motion.div
              key={school.schoolId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 relative overflow-hidden"
            >
              {/* Rank Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                #{index + 1}
              </div>

              {/* School Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {typeof school.name === 'string' ? school.name : 'Unknown School'}
                </h3>
                <p className="text-gray-400">
                  {typeof school.city === 'string' && typeof school.province === 'string' 
                    ? `${school.city}, ${school.province}`
                    : 'Location unavailable'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-400">Total Points</p>
                  <p className="text-xl font-bold text-blue-400">
                    {typeof school.totalPoints === 'number' 
                      ? school.totalPoints.toLocaleString() 
                      : '0'}
                  </p>
                </div>
                
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-400">Students</p>
                  <p className="text-xl font-bold text-blue-400">
                    {typeof school.studentCount === 'number' 
                      ? school.studentCount 
                      : '0'}
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-400">Avg Points/Student</p>
                  <p className="text-xl font-bold text-blue-400">
                    {typeof school.averagePoints === 'number' 
                      ? school.averagePoints.toLocaleString() 
                      : '0'}
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-400">Total Study Time</p>
                  <p className="text-xl font-bold text-blue-400">
                    {typeof school.totalStudyTime === 'string' 
                      ? school.totalStudyTime 
                      : '0h 0m'}
                  </p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Completed Materials</p>
                  <p className="text-lg font-semibold text-white">
                    {typeof school.totalCompletedMaterials === 'number' && typeof school.averageCompletedMaterials === 'number'
                      ? `${school.totalCompletedMaterials} (${school.averageCompletedMaterials}/student)`
                      : '0 (0/student)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average Study Time</p>
                  <p className="text-lg font-semibold text-white">
                    {typeof school.averageStudyTime === 'string' 
                      ? school.averageStudyTime 
                      : '0h 0m'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default SchoolRankings; 