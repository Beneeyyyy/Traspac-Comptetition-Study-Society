import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiMessageSquare, FiEye, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../../../../context/AuthContext';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Get token from localStorage
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const Comment = ({ comment, onReply, onLike, onDelete, currentUserId, creationId, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post(
        `/api/creations/${creationId}/comments/${comment.id}/replies`,
        { content: replyContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add the new reply to the replies state
        const newReply = response.data.data;
        setReplies(prev => [...prev, newReply]);
        setShowReplies(true); // Show replies after adding new one
        
        // Clear the reply form
        setReplyContent('');
        setShowReplyForm(false);
        
        // Update the reply count in the parent comment
        if (comment._count) {
          const newReplyCount = (comment._count.replies || 0) + 1;
          comment._count.replies = newReplyCount;
        }
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLike = async () => {
    // Optimistic update
    const wasLiked = comment.isLiked;
    const prevCount = comment.likeCount;

    // Update local state optimistically
    comment.isLiked = !wasLiked;
    comment.likeCount = wasLiked ? prevCount - 1 : prevCount + 1;

    // Animate heart
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 1000);

    try {
      // Make API call
      const response = await axios.post(
        `/api/creations/${creationId}/comments/${comment.id}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update with server data to ensure consistency
        comment.isLiked = response.data.data.isLiked;
        comment.likeCount = response.data.data.likeCount;
      } else {
        // Revert on error
        comment.isLiked = wasLiked;
        comment.likeCount = prevCount;
      }
    } catch (error) {
      // Revert on error
      comment.isLiked = wasLiked;
      comment.likeCount = prevCount;
      console.error('Failed to toggle like:', error);
    }
  };

  const loadReplies = async () => {
    if (!showReplies) {
      setIsLoadingReplies(true);
      try {
        const response = await axios.get(
          `/api/creations/${creationId}/comments/${comment.id}/replies`
        );
        if (response.data.success) {
          // Limit to 5 replies
          setReplies(response.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading replies:', error);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`/api/creations/${creationId}/comments/replies/${replyId}`);
      setReplies(prev => prev.filter(reply => reply.id !== replyId));
      // Update the reply count in the parent comment
      if (comment._count) {
        comment._count.replies = (comment._count.replies || 0) - 1;
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <img
          src={comment.user?.image || 'https://ui-avatars.com/api/?background=0D8ABC&color=fff'}
          alt={comment.user?.name || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{comment.user?.name || 'Anonymous'}</span>
              <div className="flex items-center gap-2">
                {currentUserId === comment.userId && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-all duration-200 ${
                comment.isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
              }`}
            >
              <FiHeart 
                className={`w-4 h-4 transform transition-all duration-200 ${
                  comment.isLiked ? 'fill-current scale-110' : ''
                } ${isLikeAnimating ? 'scale-150' : ''}`}
              />
              <span className="transition-all duration-200">
                {comment.likeCount || 0}
              </span>
            </button>
            {depth < 3 && ( // Limit reply depth to 3 levels
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-400 hover:text-blue-500"
              >
                Reply
              </button>
            )}
            {comment._count?.replies > 0 && (
              <button
                onClick={loadReplies}
                className="text-gray-400 hover:text-blue-500 flex items-center gap-1"
              >
                {isLoadingReplies ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    {showReplies ? 'Close' : 'Show'} {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            )}
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 text-sm"
                rows="2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Show replies */}
      {showReplies && (
        <div className={`ml-8 space-y-4 ${depth > 0 ? 'border-l border-gray-700 pl-4' : ''}`}>
          {isLoadingReplies ? (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          ) : (
            replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDelete={handleDeleteReply}
                currentUserId={currentUserId}
                creationId={creationId}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const WorkDetail = ({ work: initialWork, setSelectedWork }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [work, setWork] = useState({
    ...initialWork,
    liked: initialWork.liked || initialWork.likeCount > 0,
    likeCount: initialWork.likeCount || 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const { user } = useAuth();
  const currentUserId = user?.id;

  // If no auth context is available, show a message
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={() => setSelectedWork(null)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="relative w-full max-w-md bg-[#1F2937] rounded-xl shadow-2xl overflow-hidden p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4">Authentication Required</h3>
          <p className="text-gray-300 mb-6">Please log in to view and interact with this content.</p>
          <button
            onClick={() => setSelectedWork(null)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    );
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`/api/creations/${work.id}/comments`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          // Process the comments to ensure all required fields are present
          const processedComments = response.data.data.map(comment => {
            // Calculate actual reply count from replies array if available
            const replyCount = comment.replies?.length || comment._count?.replies || 0;
            
            return {
              ...comment,
              isLiked: comment.isLiked || false,
              likeCount: comment.likeCount || 0,
              _count: {
                ...comment._count,
                replies: replyCount
              },
              replies: (comment.replies || []).map(reply => ({
                ...reply,
                isLiked: reply.isLiked || false,
                likeCount: reply.likeCount || 0,
                _count: {
                  ...reply._count,
                  replies: reply._count?.replies || 0
                }
              }))
            };
          });
          
          setComments(processedComments);
        } else {
          console.error('Failed to fetch comments:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (error.response?.status === 404) {
          setComments([]);
    } else {
          setError('Failed to load comments. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (work.id && user?.id) {
      fetchComments();
    }
  }, [work.id, user?.id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError(null);
      const response = await axios.post(
        `/api/creations/${work.id}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      console.log('Add comment response:', response.data);

      if (response.data.success) {
        setComments(prev => [response.data.data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleReply = async (commentId, content) => {
    try {
      setError(null);
      const response = await axios.post(
        `/api/creations/${work.id}/comments/${commentId}/replies`,
        { content },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update comments state to include the new reply
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                _count: {
                  ...comment._count,
                  replies: (comment._count?.replies || 0) + 1
                }
              };
            }
            return comment;
          })
        );
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      // Find the comment to update (either in main comments or in replies)
      const findCommentInReplies = (comments) => {
        for (const comment of comments) {
          if (comment.id === commentId) return comment;
          if (comment.replies) {
            for (const reply of comment.replies) {
              if (reply.id === commentId) return reply;
              // Check nested replies if they exist
              if (reply.replies) {
                const found = reply.replies.find(r => r.id === commentId);
                if (found) return found;
              }
            }
          }
        }
        return null;
      };

      const commentToUpdate = findCommentInReplies(comments);
      if (!commentToUpdate) return;

      // Optimistic update
      const wasLiked = commentToUpdate.isLiked;
      const prevCount = commentToUpdate.likeCount;

      // Update state optimistically
      const updateCommentLikes = (comments, targetId, newLikeStatus, newLikeCount) => {
        return comments.map(comment => {
          if (comment.id === targetId) {
            return {
              ...comment,
              isLiked: newLikeStatus,
              likeCount: newLikeCount
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === targetId) {
                  return {
                    ...reply,
                    isLiked: newLikeStatus,
                    likeCount: newLikeCount
                  };
                }
                // Check nested replies
                if (reply.replies) {
                  return {
                    ...reply,
                    replies: reply.replies.map(nestedReply => {
                      if (nestedReply.id === targetId) {
                        return {
                          ...nestedReply,
                          isLiked: newLikeStatus,
                          likeCount: newLikeCount
                        };
                      }
                      return nestedReply;
                    })
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        });
      };

      setComments(prevComments => 
        updateCommentLikes(
          prevComments,
          commentId,
          !wasLiked,
          wasLiked ? prevCount - 1 : prevCount + 1
        )
      );

      // Make API call
      const response = await axios.post(
        `/api/creations/${work.id}/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update with server data to ensure consistency
        setComments(prevComments => 
          updateCommentLikes(
            prevComments,
            commentId,
            response.data.data.isLiked,
            response.data.data.likeCount
          )
        );
      } else {
        // Revert on error
        setComments(prevComments => 
          updateCommentLikes(
            prevComments,
            commentId,
            wasLiked,
            prevCount
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `/api/creations/${work.id}/comments/${commentId}`,
        { withCredentials: true }
      );

      // Remove comment from state
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const handleLikeCreation = async () => {
    try {
      // Optimistic update
      const wasLiked = work.liked;
      const prevLikeCount = work.likeCount || 0;
      const newLiked = !wasLiked;
      const newCount = wasLiked ? prevLikeCount - 1 : prevLikeCount + 1;

      // Update state optimistically
      setWork(prev => ({
        ...prev,
        liked: newLiked,
        likeCount: newCount
      }));

      // Animate heart
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);

      // Make API call
      const response = await axios.post(
        `/api/creations/${work.id}/like`,
        {},
        { withCredentials: true }
      );

      if (!response.data.success) {
        // Revert on error
        setWork(prev => ({
          ...prev,
          liked: wasLiked,
          likeCount: prevLikeCount
        }));
      }
    } catch (error) {
      console.error('Error liking creation:', error);
      // Revert on error
      setWork(prev => ({
        ...prev,
        liked: wasLiked,
        likeCount: prevLikeCount
      }));
    }
  };

  // Sync work state with props
  useEffect(() => {
    setWork(prev => ({
      ...prev,
      liked: initialWork.liked || initialWork.likeCount > 0,
      likeCount: initialWork.likeCount || 0
    }));
  }, [initialWork.liked, initialWork.likeCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={() => setSelectedWork(null)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-6xl bg-[#1F2937] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
                  <button
          onClick={() => setSelectedWork(null)}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 rounded-full z-10"
        >
          <FiX className="w-6 h-6" />
                  </button>

        <div className="flex flex-col md:flex-row h-[90vh]">
          {/* Left Side - Image */}
          <div className="w-full md:w-2/3 bg-black relative">
            <img
              src={work.files[0]?.data}
              alt={work.title}
              className="w-full h-full object-contain"
            />
        </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-1/3 flex flex-col bg-[#1F2937] border-l border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={work.authorAvatar}
                    alt={work.author}
                    className="w-10 h-10 rounded-full border-2 border-gray-800"
                  />
                  <div>
                    <h3 className="font-medium text-white">{work.author}</h3>
                      {work.badge && (
                      <span className="text-xs text-gray-400">{work.badge}</span>
                      )}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

              <h2 className="text-xl font-semibold text-white mb-2">{work.title}</h2>
              <p className="text-gray-300 mb-4">{work.description}</p>

              <div className="flex items-center gap-6 text-gray-400">
                <button 
                  onClick={handleLikeCreation}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    work.liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                  }`}
                >
                  <FiHeart 
                    className={`w-5 h-5 transform transition-all duration-200 ${
                      work.liked ? 'fill-current scale-110' : ''
                    } ${isLikeAnimating ? 'scale-150' : ''}`}
                  />
                  <span>{work.likeCount || 0}</span>
                </button>
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-5 h-5" />
                  <span>{comments.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiEye className="w-5 h-5" />
                  <span>{work.views}</span>
                </div>
                <button className="ml-auto text-gray-400 hover:text-white">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto">
              {error && (
                <div className="p-4 text-red-500 bg-red-500/10 border-b border-red-500/20">
                  {error}
                </div>
              )}

              <div className="p-4 space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FiMessageSquare className="w-8 h-8 mb-2" />
                    <p>No comments yet. Be the first to comment!</p>
              </div>
                ) : (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      onLike={handleCommentLike}
                      onDelete={handleDeleteComment}
                      currentUserId={currentUserId}
                      creationId={work.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-gray-800">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                className="w-full bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                      />
              <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                  Comment
                      </button>
                    </div>
                  </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkDetail; 