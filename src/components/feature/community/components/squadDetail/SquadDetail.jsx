import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getSquadById,
  joinSquad,
  leaveSquad,
  getSquadMaterials,
  getDiscussions
} from '../../../../../api/squad';
import { toast } from 'react-hot-toast';

const SquadDetail = () => {
  const { id } = useParams();
  const [squad, setSquad] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const fetchSquadData = async () => {
      try {
        const [squadData, materialsData, discussionsData] = await Promise.all([
          getSquadById(id),
          getSquadMaterials(id),
          getDiscussions(id)
        ]);
        
        setSquad(squadData);
        setMaterials(materialsData);
        setDiscussions(discussionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSquadData();
  }, [id]);

  const handleJoinSquad = async () => {
    try {
      await joinSquad(id);
      toast.success('Successfully joined the squad!');
      // Refresh squad data
      const updatedSquad = await getSquadById(id);
      setSquad(updatedSquad);
    } catch (err) {
      toast.error(err.message || 'Failed to join squad');
    }
  };

  const handleLeaveSquad = async () => {
    try {
      await leaveSquad(id);
      toast.success('Successfully left the squad!');
      // Refresh squad data
      const updatedSquad = await getSquadById(id);
      setSquad(updatedSquad);
    } catch (err) {
      toast.error(err.message || 'Failed to leave squad');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 py-8">Error: {error}</div>
  );
  
  if (!squad) return (
    <div className="text-center text-gray-500 py-8">Squad not found</div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Squad Header */}
      <div className="relative h-[200px]">
        <img
          src={squad.banner || '/default-banner.jpg'}
          alt={squad.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{squad.name}</h1>
            <p className="text-gray-200">{squad.description}</p>
          </div>
        </div>
      </div>

      {/* Join/Leave Button */}
      <div className="p-4">
        <button
          onClick={squad.isMember ? handleLeaveSquad : handleJoinSquad}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            squad.isMember 
              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {squad.isMember ? "Leave Squad" : "Join Squad"}
        </button>
      </div>

      {/* Squad Content */}
      <div className="mt-6">
        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex gap-8">
            {['materials', 'discussions', 'members'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="mt-6">
          {/* Materials Panel */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {materials.map(material => (
                <div key={material.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">{material.title}</h3>
                  <p className="text-gray-400">{material.description}</p>
                </div>
              ))}
              {materials.length === 0 && (
                <p className="text-center text-gray-400 py-8">No materials available</p>
              )}
            </div>
          )}

          {/* Discussions Panel */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {discussions.map(discussion => (
                <div key={discussion.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">{discussion.title}</h3>
                  <p className="text-gray-400">{discussion.content}</p>
                </div>
              ))}
              {discussions.length === 0 && (
                <p className="text-center text-gray-400 py-8">No discussions yet</p>
              )}
            </div>
          )}

          {/* Members Panel */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {squad.members?.map(member => (
                <div key={member.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-4">
                  <img
                    src={member.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}`}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-white">{member.user.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
              {!squad.members?.length && (
                <p className="text-center text-gray-400 py-8">No members yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SquadDetail; 