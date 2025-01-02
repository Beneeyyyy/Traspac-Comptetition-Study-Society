import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useDiscussion = (materialId, filter) => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const discussionsWithResolvedState = data.data.discussions.map(discussion => ({
        ...discussion,
        replies: discussion.replies?.map(reply => ({
          ...reply,
          isResolved: reply.id === discussion.resolvedReplyId || reply.isResolved
        }))
      }));

      setDiscussions(discussionsWithResolvedState);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching discussions:', err);
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

      setDiscussions(prevDiscussions => 
        prevDiscussions.map(discussion => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              isLiked: !discussion.isLiked,
              _count: {
                ...discussion._count,
                likes: discussion.isLiked ? discussion._count.likes - 1 : discussion._count.likes + 1
              }
            };
          }
          return discussion;
        })
      );

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
      throw err;
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [materialId, filter]);

  return {
    discussions,
    isLoading,
    error,
    handleLike,
    handleResolve,
    refreshDiscussions: fetchDiscussions
  };
};

export default useDiscussion; 