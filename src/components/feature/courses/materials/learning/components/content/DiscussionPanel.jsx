import React, { useState, useEffect, useRef } from 'react';
import CommentForm from './discussion/CommentForm';
import CommentItem from './discussion/CommentItem';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { useAuth } from '../../../../../../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DiscussionPanel = ({ materialId }) => {
  const auth = useAuth();
  const { user: currentUser, loading: authLoading } = auth || { user: null, loading: true };
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [filter, setFilter] = useState('');

  const fetchDiscussions = async () => {
    if (!materialId) return;
    
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

      console.log('=== fetchDiscussions Response ===');
      console.log('Raw discussions data:', data.data.discussions);

      const discussionsWithResolvedState = data.data.discussions.map(discussion => {
        console.log(`Discussion ${discussion.id} isLiked:`, discussion.isLiked);
        console.log(`Discussion ${discussion.id} likes count:`, discussion._count?.likes);
        
        return {
          ...discussion,
          replies: discussion.replies?.map(reply => ({
            ...reply,
            isResolved: reply.id === discussion.resolvedReplyId || reply.isResolved
          }))
        };
      });

      console.log('Processed discussions:', discussionsWithResolvedState);
      setDiscussions(discussionsWithResolvedState);
    } catch (err) {
      console.error('Error fetching discussions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log('=== handleLike START ===');
      console.log('Liking discussion:', discussionId);
      
      const response = await fetch(`${API_URL}/api/discussions/discussion/${discussionId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Like response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      setDiscussions(prevDiscussions => {
        const newDiscussions = prevDiscussions.map(discussion => {
          if (discussion.id === discussionId) {
            console.log('Updating discussion:', discussion.id);
            console.log('Old isLiked:', discussion.isLiked);
            console.log('New isLiked:', data.data.isLiked);
            return data.data;
          }
          return discussion;
        });
        console.log('Updated discussions:', newDiscussions);
        return newDiscussions;
      });

      return data.data;
    } catch (err) {
      console.error('Error toggling like:', err);
      throw err;
    }
  };

  const handleResolve = async (discussionId, replyId) => {
    try {
      const discussion = discussions.find(d => d.id === discussionId);
      if (!discussion) {
        throw new Error('Discussion not found');
      }

      // Hanya pembuat diskusi yang bisa resolve
      if (discussion.userId !== currentUser?.id) {
        throw new Error('Only the discussion creator can resolve the discussion');
      }

      setDiscussions(prevDiscussions => 
        prevDiscussions.map(discussion => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              isResolved: true,
              resolvedReplyId: replyId,
              replies: discussion.replies?.map(reply => ({
                ...reply,
                isResolved: reply.id === replyId
              }))
            };
          }
          return discussion;
        })
      );

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
        if (data.error?.includes('already resolved')) {
          return;
        }
        throw new Error(data.error || 'Failed to resolve discussion');
      }

      if (data.data) {
        setDiscussions(prevDiscussions => 
          prevDiscussions.map(discussion => 
            discussion.id === discussionId ? {
              ...data.data,
              replies: data.data.replies?.map(reply => ({
                ...reply,
                isResolved: reply.id === replyId || reply.isResolved
              }))
            } : discussion
          )
        );
      }
    } catch (err) {
      console.error('Error resolving discussion:', err);
      if (!err.message?.includes('already resolved')) {
        setDiscussions(prevDiscussions => 
          prevDiscussions.map(discussion => {
            if (discussion.id === discussionId) {
              return {
                ...discussion,
                isResolved: false,
                resolvedReplyId: null,
                replies: discussion.replies?.map(reply => ({
                  ...reply,
                  isResolved: false
                }))
              };
            }
            return discussion;
          })
        );
      }
      // Tampilkan error dalam UI
      setError(err.message);
    }
  };

  // Fetch discussions immediately when component mounts and when filter changes
  useEffect(() => {
    fetchDiscussions();
  }, [materialId, filter]);

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

      {/* Comment Form Section - Moved to top */}
      <div className="mb-8">
        {!authLoading && (
          <>
            {currentUser ? (
              <CommentForm
                onSubmit={handleSubmitDiscussion}
                newComment={newDiscussion}
                setNewComment={setNewDiscussion}
              />
            ) : (
              <div className="text-center py-4 bg-white/[0.02] rounded-lg">
                <p className="text-white/40">Silakan login untuk berpartisipasi dalam diskusi</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Discussions List */}
      <div className="mt-6 space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/[0.02] rounded-lg" />
            ))}
          </div>
        ) : discussions.length > 0 ? (
          discussions.map(discussion => (
            <CommentItem
              key={discussion.id}
              commentId={discussion.id}
              userId={discussion.userId}
              currentUserId={currentUser?.id}
              isResolved={discussion.isResolved}
              canResolve={currentUser?.id === discussion.userId && !discussion.isResolved}
              initialReplies={discussion.replies}
              isLiked={discussion.isLiked}
              likeCount={discussion._count?.likes || 0}
              onResolve={handleResolve}
              onLike={handleLike}
              comment={discussion}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/40">Belum ada diskusi untuk materi ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionPanel; 