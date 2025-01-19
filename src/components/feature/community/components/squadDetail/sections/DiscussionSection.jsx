import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMessageSquare, FiClock, FiCornerDownRight, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { useSquads } from '../../../../../../contexts/community/CommunityContext';
import { createDiscussion, updateDiscussion, deleteDiscussion, getDiscussions, addDiscussionReply } from '../../../../../../api/squad';
import Modal from '../../../../../../components/common/Modal';

// Simple function to format date
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

const DiscussionSection = ({ squad }) => {
  const { user } = useAuth();
  const { setSquads } = useSquads();
  const [discussions, setDiscussions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: false
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  // Helper function to recursively process replies
  const processReplies = (replies) => {
    return replies.map(reply => ({
      ...reply,
      children: reply.children ? processReplies(reply.children) : []
    }));
  };

  // Fetch initial discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const data = await getDiscussions(squad.id);
        // Process the discussions to ensure proper nested structure
        const processedData = data.map(discussion => ({
          ...discussion,
          replies: discussion.replies ? processReplies(discussion.replies) : []
        }));
        console.log('Processed discussions:', processedData);
        setDiscussions(processedData);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [squad.id]);

  const isAdminOrModerator = squad.members?.some(
    member => member.userId === user?.id && ['admin', 'moderator'].includes(member.role)
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDiscussion) {
        // Update existing discussion
        const updatedDiscussion = await updateDiscussion(squad.id, selectedDiscussion.id, formData);
        setDiscussions(prev => prev.map(d => d.id === updatedDiscussion.id ? updatedDiscussion : d));
        toast.success('Discussion updated successfully');
      } else {
        // Create new discussion
        const newDiscussion = await createDiscussion(squad.id, formData);
        setDiscussions(prev => [...prev, newDiscussion]);
        toast.success('Discussion created successfully');
      }
      setIsModalOpen(false);
      setSelectedDiscussion(null);
      setFormData({
        title: '',
        content: '',
        isPinned: false
      });
    } catch (error) {
      toast.error(error.message || 'Failed to save discussion');
    }
  };

  const handleEdit = (discussion) => {
    setSelectedDiscussion(discussion);
    setFormData({
      title: discussion.title,
      content: discussion.content,
      isPinned: discussion.isPinned
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      await deleteDiscussion(squad.id, discussionId);
      setDiscussions(prev => prev.filter(d => d.id !== discussionId));
      toast.success('Discussion deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete discussion');
    }
  };

  const handleReply = async (discussionId, parentReplyId = null) => {
    if (!replyContent.trim()) return;
    
    try {
      const reply = await addDiscussionReply(squad.id, discussionId, { 
        content: replyContent,
        parentId: parentReplyId 
      });
      
      // After successful reply, refetch the discussions to get updated structure
      const updatedData = await getDiscussions(squad.id);
      setDiscussions(updatedData);
      
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add reply');
    }
  };

  // Helper function to calculate the actual level of a reply
  const calculateReplyLevel = (reply, replies, currentLevel = 0) => {
    if (currentLevel >= 5) return currentLevel; // Max level check
    
    if (!reply.parentId) return 0;
    
    const findParentLevel = (replyList, targetId, level) => {
      for (const r of replyList) {
        if (r.id === targetId) return level;
        if (r.children?.length > 0) {
          const foundLevel = findParentLevel(r.children, targetId, level + 1);
          if (foundLevel !== -1) return foundLevel;
        }
      }
      return -1;
    };
    
    return findParentLevel(replies, reply.parentId, 1);
  };

  // Helper function to toggle reply expansion
  const toggleReplyExpansion = (replyId) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  // Helper function to check if a reply has any children at any level
  const hasNestedReplies = (reply) => {
    if (reply.children?.length > 0) return true;
    return reply.children?.some(child => hasNestedReplies(child)) || false;
  };

  // Helper function to render a reply and its nested replies
  const renderReply = (reply, discussionId, replies, level = null) => {
    const actualLevel = level ?? calculateReplyLevel(reply, replies);
    const maxLevel = 5;
    const hasChildren = hasNestedReplies(reply);
    const isExpanded = expandedReplies.has(reply.id);
    
    return (
      <div key={reply.id} className="relative mb-4">
        <div className="relative">
          {actualLevel > 0 && (
            <>
              {/* Vertical line for current level */}
              <div 
                className="absolute left-0 top-0 w-[2px] bg-slate-800"
                style={{
                  left: '-16px',
                  top: '40px',
                  bottom: (hasChildren && isExpanded) ? '0px' : '20px'
                }}
              />
              {/* Horizontal line connecting to parent */}
              <div 
                className="absolute h-[2px] bg-slate-800"
                style={{
                  left: '-16px',
                  top: '40px',
                  width: '16px'
                }}
              />
            </>
          )}
          <div className={`bg-slate-950 p-4 rounded-lg border border-slate-800/50 hover:border-blue-700/50 transition-colors ${actualLevel > 0 ? 'ml-8' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={reply.user?.image || '/default-avatar.png'}
                alt={reply.user?.name}
                className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
              />
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">{reply.user?.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-400">{formatTimeAgo(reply.createdAt)}</span>
                  {actualLevel > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-800 text-blue-400">
                      Level {actualLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-slate-300 ml-11 leading-relaxed">
              {reply.parentId && (
                <span className="text-blue-400 font-medium">
                  @{replies.find(r => r.id === reply.parentId)?.user?.name}{' '}
                </span>
              )}
              {reply.content}
            </p>
            
            <div className="mt-2 ml-11 flex items-center gap-4">
              {actualLevel < maxLevel - 1 ? (
                <button
                  onClick={() => setReplyingTo(reply.id)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 hover:scale-105 transform duration-200"
                >
                  <FiCornerDownRight className="text-blue-500" /> Reply
                </button>
              ) : (
                <span className="text-sm text-slate-500 italic">Maximum reply depth reached</span>
              )}
              
              {hasChildren && (
                <button
                  onClick={() => toggleReplyExpansion(reply.id)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <FiMessageSquare className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  View replies
                  {!isExpanded && ' ▼'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nested reply input */}
        {replyingTo === reply.id && actualLevel < maxLevel - 1 && (
          <div className={`mt-3 flex gap-3 relative ${actualLevel > 0 ? 'ml-8' : ''}`}>
            <div 
              className="absolute w-[2px] bg-slate-800"
              style={{
                left: '-16px',
                top: '0px',
                bottom: '0px'
              }}
            />
            <div className="flex-1 flex flex-col gap-2">
              <div className="text-sm text-blue-400">
                Replying to <span className="text-blue-400">@{reply.user?.name}</span>
              </div>
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Write your reply...`}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => handleReply(discussionId, reply.id)}
              disabled={!replyContent.trim()}
              className="self-end bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2.5 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 disabled:hover:shadow-none"
            >
              <FiSend className="text-lg" />
            </button>
          </div>
        )}

        {/* Render nested replies */}
        {hasChildren && isExpanded && (
          <div className={`mt-3 relative ${actualLevel > 0 ? 'ml-8' : ''}`}>
            {reply.children.map(childReply => renderReply(childReply, discussionId, replies, actualLevel + 1))}
          </div>
        )}
      </div>
    );
  };

  // Sort discussions with pinned ones first
  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-slate-950 to-black min-h-screen">
      <button
        onClick={() => {
          setSelectedDiscussion(null);
          setFormData({
            title: '',
            content: '',
            isPinned: false
          });
          setIsModalOpen(true);
        }}
        className="mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 font-medium shadow-lg shadow-blue-500/20 hover:scale-[1.02] transform"
      >
        <FiPlus className="text-lg" /> Start Discussion
      </button>

      <div className="space-y-6">
        {sortedDiscussions.map(discussion => (
          <div key={discussion.id} className="bg-gradient-to-br from-slate-900/50 to-black p-6 rounded-xl shadow-xl border border-slate-800/30 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={discussion.user?.image || '/default-avatar.png'}
                    alt={discussion.user?.name}
                    className="w-12 h-12 rounded-xl ring-2 ring-blue-500/30 object-cover"
                  />
                  <div>
                    <span className="font-semibold text-slate-50">{discussion.user?.name}</span>
                    <div className="text-sm text-slate-300/70">{formatTimeAgo(discussion.createdAt)}</div>
                  </div>
                  {discussion.isPinned && (
                    <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      Pinned
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-50 tracking-wide">{discussion.title}</h3>
                <p className="text-slate-100/80 mb-4 leading-relaxed">{discussion.content}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <button 
                    onClick={() => setExpandedDiscussion(expandedDiscussion === discussion.id ? null : discussion.id)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <FiMessageSquare className="text-lg group-hover:scale-110 transition-transform" />
                    <span>{discussion.replyCount || 0} replies</span>
                  </button>
                  {(isAdminOrModerator || discussion.user?.id === user?.id) && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(discussion)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-all hover:scale-105"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(discussion.id)}
                        className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-all hover:scale-105"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            {expandedDiscussion === discussion.id && (
              <div className="mt-6 pl-8 border-l-2 border-slate-800/50">
                {discussion.replies?.filter(reply => !reply.parentId).map(reply => 
                  renderReply(reply, discussion.id, discussion.replies)
                )}
                
                {/* Main reply input */}
                {!replyingTo && (
                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 rounded-xl bg-slate-950/50 border border-slate-800/50 px-4 py-3 text-slate-50 placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={() => handleReply(discussion.id)}
                      disabled={!replyContent.trim()}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 disabled:hover:shadow-none"
                    >
                      <FiSend className="text-lg" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDiscussion ? 'Edit Discussion' : 'Start Discussion'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-xl bg-slate-950/50 border-slate-800/50 text-slate-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-xl bg-slate-950/50 border-slate-800/50 text-slate-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          {isAdminOrModerator && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPinned"
                id="isPinned"
                checked={formData.isPinned}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-800/50 rounded bg-slate-950/50"
              />
              <label htmlFor="isPinned" className="ml-2 block text-sm text-slate-200">
                Pin this discussion
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-950/50 rounded-xl hover:bg-slate-900/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              {selectedDiscussion ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DiscussionSection; 