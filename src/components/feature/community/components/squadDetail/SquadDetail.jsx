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
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminSection from './sections/AdminSection';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useSquads } from '../../../../../contexts/community/CommunityContext';
import OverviewSection from './sections/OverviewSection';
import LearningSection from './sections/LearningSection';
import DiscussionSection from './sections/DiscussionSection';
import CommunitySection from './sections/CommunitySection';
import MaterialsSection from './sections/MaterialsSection';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiX className="text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const SquadDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { squads, setSquads } = useSquads();
  const [squad, setSquad] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    materialTitle: '',
    materialDescription: '',
    discussionTitle: '',
    discussionContent: ''
  });
  const [joining, setJoining] = useState(false);

  const fetchSquadData = async () => {
    try {
      setLoading(true);
      console.log('Fetching squad data for ID:', id);
      
      // Fetch squad data first
      const squadData = await getSquadById(id);
      console.log('Fetched squad data:', squadData);
      
      // Then fetch materials and discussions
      const [materialsData, discussionsData] = await Promise.all([
        getSquadMaterials(id),
        getDiscussions(id)
      ]);
      
      console.log('Fetched materials:', materialsData);
      console.log('Fetched discussions:', discussionsData);
      
      // Update squad data with counts
      const updatedSquadData = {
        ...squadData,
        _count: {
          materials: materialsData.length,
          discussions: discussionsData.length,
          members: squadData.memberCount || 0
        }
      };
      
      setSquad(updatedSquadData);
      setMaterials(materialsData);
      setDiscussions(discussionsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching squad data:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to fetch squad data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSquadData();
    }
  }, [id]);

  const handleJoinSquad = async () => {
    if (!user) {
      toast.error('Please login to join the squad');
      return;
    }
    setJoining(true);
    try {
      const updatedSquad = await joinSquad(id);
      setSquad(updatedSquad);
      setSquads(prev => prev.map(s => s.id === updatedSquad.id ? updatedSquad : s));
      toast.success('Successfully joined the squad');
    } catch (error) {
      toast.error(error.message || 'Failed to join squad');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveSquad = async () => {
    if (!window.confirm('Are you sure you want to leave this squad?')) return;
    try {
      await leaveSquad(id);
      const updatedSquad = { ...squad, isMember: false };
      setSquad(updatedSquad);
      setSquads(prev => prev.map(s => s.id === updatedSquad.id ? updatedSquad : s));
      toast.success('Successfully left the squad');
    } catch (error) {
      toast.error(error.message || 'Failed to leave squad');
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      const response = await createMaterial(id, {
        title: formData.materialTitle,
        description: formData.materialDescription
      });
      setMaterials([...materials, response]);
      setActiveModal(null);
      setFormData({ ...formData, materialTitle: '', materialDescription: '' });
      toast.success('Material created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create material');
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await createDiscussion(id, {
        title: formData.discussionTitle,
        content: formData.discussionContent
      });
      setDiscussions([...discussions, response]);
      setActiveModal(null);
      setFormData({ ...formData, discussionTitle: '', discussionContent: '' });
      toast.success('Discussion created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create discussion');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px] mt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 py-8 mt-20">Error: {error}</div>
  );
  
  if (!squad) return (
    <div className="text-center text-gray-500 py-8 mt-20">Squad not found</div>
  );

  const isAdmin = squad.role === 'ADMIN';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: 'Materials' },
    { id: 'discussions', label: 'Discussions' },
    { id: 'members', label: 'Members' }
  ];

  // Add admin tab if user is admin
  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Squad Header */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${squad.banner || '/default-banner.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex items-end pb-6">
            <div className="flex items-center gap-6">
              <img
                src={squad.image || '/default-squad.jpg'}
                alt={squad.name}
                className="w-24 h-24 rounded-lg border-4 border-gray-800"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{squad.name}</h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <span>{squad._count?.members || 0} members</span>
                  <span>{squad._count?.materials || 0} materials</span>
                  <span>{squad._count?.discussions || 0} discussions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Actions */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-500 -mb-[17px] pb-4'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {squad.isMember ? (
              <button
                onClick={handleLeaveSquad}
                className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
                disabled={isAdmin}
              >
                {isAdmin ? "Can't leave (Admin)" : "Leave Squad"}
              </button>
            ) : (
              <button
                onClick={handleJoinSquad}
                disabled={joining}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Squad'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewSection squad={squad} onRefresh={fetchSquadData} />
        )}
        {activeTab === 'materials' && (
          <MaterialsSection squad={squad} />
        )}
        {activeTab === 'discussions' && (
          <DiscussionSection squad={squad} />
        )}
        {activeTab === 'members' && (
          <CommunitySection squad={squad} />
        )}
        {activeTab === 'admin' && isAdmin && (
          <AdminSection squad={squad} />
        )}
      </div>

      {/* Create Material Modal */}
      <Modal
        isOpen={activeModal === 'material'}
        onClose={() => setActiveModal(null)}
        title="Create Material"
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              name="materialTitle"
              value={formData.materialTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Enter material title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              name="materialDescription"
              value={formData.materialDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
              placeholder="Enter material description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Material
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Discussion Modal */}
      <Modal
        isOpen={activeModal === 'discussion'}
        onClose={() => setActiveModal(null)}
        title="Create Discussion"
      >
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              name="discussionTitle"
              value={formData.discussionTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Enter discussion title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Content
            </label>
            <textarea
              name="discussionContent"
              value={formData.discussionContent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
              placeholder="Enter discussion content..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Discussion
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SquadDetail; 