import React, { useState, useEffect } from 'react';
import { FiUsers, FiTarget, FiCalendar, FiAward, FiTrendingUp, FiInfo, FiBook, FiFlag, FiStar, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { useSquads } from '../../../../../../contexts/community/CommunityContext';
import { updateSquad } from '../../../../../../api/squad';
import Modal from '../../../../../../components/common/Modal';

function CircularProgress({ percentage, size = 120, label, sublabel }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.1)"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#gradient)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-sm text-white/60">{label}</span>
        {sublabel && <span className="text-xs text-white/40">{sublabel}</span>}
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-gray-800">
    <div className={`p-1.5 rounded-lg ${color}/10`}>
      <Icon className={`text-base ${color}`} />
    </div>
    <div>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-xs font-medium text-white">{value}</p>
    </div>
  </div>
)

const OverviewSection = ({ squad, onRefresh }) => {
  const { user } = useAuth();
  const { setSquads } = useSquads();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    about: squad?.about || '',
    newRule: ''
  });

  // Update formData when squad changes
  useEffect(() => {
    if (squad) {
      setFormData(prev => ({
        ...prev,
        about: squad.about || ''
      }));
    }
  }, [squad]);

  const isAdminOrModerator = squad?.members?.some(
    member => member.userId === user?.id && ['ADMIN', 'MODERATOR'].includes(member.role)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    try {
      const updatedSquad = await updateSquad(squad.id, {
        about: formData.about
      });
      
      setSquads(prev => prev.map(s => s.id === squad.id ? updatedSquad : s));
      setIsEditModalOpen(false);
      toast.success('Squad info updated successfully');
      
      // Refresh squad data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update squad info');
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!formData.newRule.trim()) return;

    try {
      const newRules = [...(squad.rules || []), formData.newRule];
      const updatedSquad = await updateSquad(squad.id, {
        rules: newRules
      });
      
      setSquads(prev => prev.map(s => s.id === squad.id ? updatedSquad : s));
      setFormData(prev => ({ ...prev, newRule: '' }));
      setIsRulesModalOpen(false);
      toast.success('Rule added successfully');
      
      // Refresh squad data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add rule');
    }
  };

  const handleRemoveRule = async (index) => {
    try {
      const newRules = (squad.rules || []).filter((_, i) => i !== index);
      const updatedSquad = await updateSquad(squad.id, {
        rules: newRules
      });
      
      setSquads(prev => prev.map(s => s.id === squad.id ? updatedSquad : s));
      toast.success('Rule removed successfully');
      
      // Refresh squad data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove rule');
    }
  };

  const stats = [
    { 
      icon: FiUsers, 
      label: "Total Members", 
      value: squad?.memberCount || 0, 
      color: "text-blue-400" 
    },
    { 
      icon: FiBook, 
      label: "Materials", 
      value: squad?._count?.materials || 0, 
      color: "text-purple-400" 
    },
    { 
      icon: FiStar, 
      label: "Discussions", 
      value: squad?._count?.discussions || 0, 
      color: "text-amber-400" 
    },
    { 
      icon: FiCalendar, 
      label: "Created", 
      value: squad?.createdAt ? new Date(squad.createdAt).toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      }) : '-', 
      color: "text-emerald-400" 
    }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Circles - Hide for now since we don't have real data */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] rounded-xl p-6 flex flex-col items-center">
          <CircularProgress 
            percentage={squadData.progress || 0} 
            label="Course Progress"
            sublabel={`${squadData.completedMaterials || 0}/${squadData.totalMaterials || 0} Completed`}
          />
        </div>
      </div> */}

      {/* About Section */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">About</h2>
          {isAdminOrModerator && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <FiEdit2 /> Edit
            </button>
          )}
        </div>
        <p className="text-gray-400">{squad?.about || 'No description available.'}</p>
      </div>

      {/* Squad Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Rules Section */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Squad Rules</h2>
          {isAdminOrModerator && (
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <FiPlus /> Add Rule
            </button>
          )}
        </div>
        {squad?.rules?.length > 0 ? (
          <ul className="space-y-3">
            {squad.rules.map((rule, index) => (
              <li key={index} className="flex items-start justify-between group">
                <span className="text-gray-400">{rule}</span>
                {isAdminOrModerator && (
                  <button
                    onClick={() => handleRemoveRule(index)}
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No rules have been set for this squad.</p>
        )}
      </div>

      {/* Squad Leaders */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Squad Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squad?.members?.filter(member => member.role === 'ADMIN').map((leader, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={leader.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.user.name)}&background=6366F1&color=fff`}
                alt={leader.user.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-white">{leader.user.name}</h3>
                <p className="text-sm text-gray-400">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit About Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Squad Info"
      >
        <form onSubmit={handleUpdateAbout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              About Squad
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              rows="4"
              placeholder="Write about your squad..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Rule Modal */}
      <Modal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        title="Add Squad Rule"
      >
        <form onSubmit={handleAddRule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              New Rule
            </label>
            <input
              type="text"
              name="newRule"
              value={formData.newRule}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Enter new rule..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRulesModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default OverviewSection 