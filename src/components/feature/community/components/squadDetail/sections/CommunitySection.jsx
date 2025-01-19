import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { useSquads } from '../../../../../../contexts/community/CommunityContext';
import { updateMemberRole, removeMember } from '../../../../../../api/squad';
import Modal from '../../../../../../components/common/Modal';

const CommunitySection = ({ squad }) => {
  const { user } = useAuth();
  const { setSquads } = useSquads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    role: 'member'
  });

  const isAdminOrModerator = squad?.members?.some(
    member => member.userId === user?.id && ['admin', 'moderator'].includes(member.role)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await updateMemberRole(squad.id, selectedMember.id, formData.role);
      
      // Update local state
      const updatedSquad = {
        ...squad,
        members: squad.members.map(member => 
          member.id === selectedMember.id 
            ? { ...member, role: formData.role }
            : member
        )
      };
      
      setSquads(prev => prev.map(s => s.id === squad.id ? updatedSquad : s));
      setIsModalOpen(false);
      setSelectedMember(null);
      toast.success('Member role updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      await removeMember(squad.id, memberId);
      
      // Update local state
      const updatedSquad = {
        ...squad,
        members: squad.members.filter(member => member.id !== memberId),
        memberCount: (squad.memberCount || 1) - 1
      };
      
      setSquads(prev => prev.map(s => s.id === squad.id ? updatedSquad : s));
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  // Sort members by role (admin first, then moderator, then member)
  const sortedMembers = [...(squad?.members || [])].sort((a, b) => {
    const roleOrder = { admin: 0, moderator: 1, member: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className="space-y-6">
      {/* Members List */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Members ({squad?.memberCount || 0})</h2>
        <div className="space-y-4">
          {sortedMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg group">
              <div className="flex items-center gap-3">
                <img 
                  src={member.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=6366F1&color=fff`}
                  alt={member.user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-white font-medium">{member.user.name}</h4>
                  <span className="text-sm text-gray-400 capitalize">{member.role}</span>
                </div>
              </div>
              {isAdminOrModerator && member.userId !== user?.id && member.role !== 'admin' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setFormData({ role: member.role });
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-500 hover:text-blue-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Squad Stats */}
      <div className="bg-[#0A0A0A] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Squad Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FiUsers className="text-blue-400" />
              </div>
              <span className="text-gray-400">Total Members</span>
            </div>
            <span className="text-white font-medium">{squad?.memberCount || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FiMessageCircle className="text-purple-400" />
              </div>
              <span className="text-gray-400">Active Discussions</span>
            </div>
            <span className="text-white font-medium">{squad?._count?.discussions || 0}</span>
          </div>
        </div>
      </div>

      {/* Update Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        title="Update Member Role"
      >
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white"
            >
              <option value="member">Member</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedMember(null);
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommunitySection; 