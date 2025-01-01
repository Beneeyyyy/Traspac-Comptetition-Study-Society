import React, { useState, lazy, Suspense, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

// Optimize lazy loading with prefetch
const CommentForm = lazy(() => import(
  /* webpackChunkName: "comment-form" */
  /* webpackPrefetch: true */
  './discussion/CommentForm'
));

const CommentItem = lazy(() => import(
  /* webpackChunkName: "comment-item" */
  /* webpackPrefetch: true */
  './discussion/CommentItem'
));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DiscussionPanel = ({ materialId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // '', 'resolved', or 'unresolved'

  // Fetch discussions
  const fetchDiscussions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Log request details
      console.log('Fetching discussions from:', `${API_URL}/api/discussions/material/${materialId}?filter=${filter}`);
      
      const response = await fetch(`${API_URL}/api/discussions/material/${materialId}?filter=${filter}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch discussions');
      }

      if (data.success && data.data.discussions) {
        setComments(data.data.discussions);
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching discussions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch when filter changes
  useEffect(() => {
    if (materialId) {
      fetchDiscussions();
    }
  }, [materialId, filter]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Log request details
      console.log('Sending request to:', `${API_URL}/api/discussions/material/${materialId}`);
      console.log('Request body:', { content: newComment.trim() });

      const response = await fetch(`${API_URL}/api/discussions/material/${materialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: newComment.trim() }),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create discussion');
      }

      // Add new comment to the list and clear input
      setComments([data.data, ...comments]);
      setNewComment('');
      
      // Refresh the discussions list
      fetchDiscussions();
    } catch (err) {
      setError(err.message);
      console.error('Error creating discussion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/api/discussions/discussion/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to toggle like');
      }

      // Update the comments list with the new like status
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            _count: {
              ...comment._count,
              likes: comment.isLiked ? comment._count.likes - 1 : comment._count.likes + 1
            },
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

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
          <span className="text-white/60 text-sm">{comments.length} komentar</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-white/60 border border-white/[0.05] text-sm"
          >
            {isExpanded ? 'Tutup' : 'Perluas'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <Suspense fallback={
        <div className="animate-pulse h-32 bg-white/[0.02] rounded-lg mb-8" />
      }>
        <CommentForm 
          onSubmit={handleSubmitComment}
          newComment={newComment}
          setNewComment={setNewComment}
        />
      </Suspense>

      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-white/[0.02] rounded-lg" />
            ))}
          </div>
        ) : (
          <Suspense fallback={
            <div className="animate-pulse space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-40 bg-white/[0.02] rounded-lg" />
              ))}
            </div>
          }>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                onLike={handleLike}
              />
            ))}
          </Suspense>
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(DiscussionPanel); 
// Use memo to prevent unnecessary re-renders