import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSquads } from '../../../../../api/squad';
import { toast } from 'react-hot-toast';

const MySquads = () => {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySquads = async () => {
      try {
        // Get squads where user is a member
        const response = await getSquads({ isMember: true });
        setSquads(response);
      } catch (error) {
        toast.error('Failed to fetch your squads');
      } finally {
        setLoading(false);
      }
    };

    fetchMySquads();
  }, []);

  const handleViewDetail = (squadId) => {
    navigate(`/community/squad/${squadId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (squads.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Squads Yet</h2>
        <p className="text-gray-400 mb-6">You haven't joined any squads yet.</p>
        <button 
          onClick={() => navigate('/community')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Explore Squads
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">My Squads</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squads.map((squad) => (
          <div 
            key={squad.id}
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors"
          >
            {/* Squad Banner */}
            <div className="relative h-32">
              <img
                src={squad.banner || '/default-banner.jpg'}
                alt={squad.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>

            {/* Squad Info */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{squad.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{squad.description}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div>
                  <span className="font-medium text-white">{squad.membersCount}</span> members
                </div>
                <div>
                  <span className="font-medium text-white">{squad.materialsCount}</span> materials
                </div>
              </div>

              {/* View Detail Button */}
              <button
                onClick={() => handleViewDetail(squad.id)}
                className="w-full py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                View Squad
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySquads; 