import React, { useState, useEffect } from 'react';
import CommentForm from './discussion/CommentForm';
import CommentItem from './discussion/CommentItem';
import { FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../../../../../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DiscussionPanel = ({ materialId }) => {
  const { user: currentUser, loading } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [filter, setFilter] = useState('');

  // Debug log untuk currentUser dan auth state
  console.log('DiscussionPanel state:', {
    currentUser,
    loading,
    isLoading,
    discussionsCount: discussions.length,
    error
  });

  if (loading) {
    return (
      <div className="bg-black/[0.02] border border-white/[0.05] rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const fetchDiscussions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/discussions/material/${materialId}${filter ? `?filter=${filter}` : ''}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch discussions');
      }

      // Debug log untuk discussions
      console.log('Fetched discussions:', data.data.discussions);

      setDiscussions(data.data.discussions);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching discussions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [materialId, filter]);

  const handleSubmitDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/discussions/material/${materialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newDiscussion.trim() }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add discussion');
      }

      // Fetch the complete discussion data with replies
      const discussionResponse = await fetch(`${API_URL}/api/discussions/${data.data.id}`, {
        credentials: 'include'
      });
      const discussionData = await discussionResponse.json();

      if (!discussionResponse.ok) {
        throw new Error(discussionData.error || 'Failed to fetch discussion details');
      }

      setDiscussions([discussionData.data, ...discussions]);
      setNewDiscussion('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding discussion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (discussionId) => {
    try {
      const response = await fetch(`${API_URL}/api/discussions/discussion/${discussionId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      // Fetch updated discussion to get fresh data
      const discussionResponse = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
        credentials: 'include'
      });
      const discussionData = await discussionResponse.json();

      if (!discussionResponse.ok) {
        throw new Error(discussionData.error || 'Failed to fetch updated discussion');
      }

      setDiscussions(discussions.map(discussion => 
        discussion.id === discussionId ? discussionData.data : discussion
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleResolve = async (discussionId, replyId) => {
    try {
      console.log('DiscussionPanel handleResolve:', {
        discussionId,
        replyId,
        currentUser
      });

      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/resolve/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pointAmount: 10 }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resolve discussion');
      }

      console.log('Discussion resolved successfully:', data);
      // Refresh discussions list
      fetchDiscussions();
    } catch (err) {
      console.error('Error resolving discussion:', err);
    }
  };

  if (isLoading && discussions.length === 0) {
    return (
      <div className="bg-black/[0.02] border border-white/[0.05] rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/[0.02] border border-white/[0.05] rounded-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Diskusi Materi</h3>
            <p className="text-sm text-white/60">Tanyakan apa yang kamu tidak mengerti</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/[0.02] border border-white/[0.05] text-white/60 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Semua</option>
            <option value="resolved">Terjawab</option>
            <option value="unresolved">Belum Terjawab</option>
          </select>
          <span className="text-white/60 text-sm">{discussions.length} diskusi</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Discussion Form */}
      <CommentForm
        onSubmit={handleSubmitDiscussion}
        newComment={newDiscussion}
        setNewComment={setNewDiscussion}
      />

      {/* Discussions List */}
      <div className="mt-6 space-y-6">
        {discussions.map(discussion => (
          <CommentItem
            key={discussion.id}
            comment={discussion}
            onLike={handleLike}
            onResolve={handleResolve}
            currentUser={currentUser}
          />
        ))}
        {discussions.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-white/40">Belum ada diskusi. Mulai diskusi pertama!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionPanel; 