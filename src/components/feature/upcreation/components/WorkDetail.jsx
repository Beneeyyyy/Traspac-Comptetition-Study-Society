import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiMessageSquare, FiEye, FiShare2, FiMoreVertical } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Comment = ({ comment, onReply, onLike, onDelete, currentUserId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await onReply(comment.id, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  const handleLike = async () => {
    await onLike(comment.id);
    setIsLiked(!isLiked);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <img
          src={comment.user.image}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{comment.user.name}</span>
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
              className={`flex items-center gap-1 ${isLiked ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500`}
            >
              <FiHeart className="w-4 h-4" />
              <span>{comment._count?.likes || 0}</span>
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-400 hover:text-blue-500"
            >
              Reply
            </button>
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full bg-gray-800/30 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Comments */}
      {comment.replies?.length > 0 && (
        <div className="ml-10 space-y-4 border-l-2 border-gray-800 pl-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WorkDetail = ({ work, setSelectedWork }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`/api/creations/${work.id}/comments`, {
          withCredentials: true
        });
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        // Don't show error for 404 (no comments yet)
        if (err.response?.status === 404) {
          setComments([]);
        } else {
          setError('Failed to load comments. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (work.id) {
      fetchComments();
    }
  }, [work.id]);

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

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
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

      // Update comments state to include the new reply
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data]
          };
        }
        return comment;
      });

      setComments(updatedComments);
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await axios.post(
        `/api/creations/${work.id}/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );

      // Update comment likes in state
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            _count: {
              ...comment._count,
              likes: comment._count.likes + 1
            }
          };
        }
        return comment;
      });

      setComments(updatedComments);
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Failed to like comment');
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
      await axios.post(
        `/api/creations/${work.id}/like`,
        {},
        { withCredentials: true }
      );
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error liking creation:', err);
      setError('Failed to like creation');
    }
  };

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
                  className={`flex items-center gap-2 ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                >
                  <FiHeart className="w-5 h-5" />
                  <span>{work.likes}</span>
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
                      onLike={handleLikeComment}
                      onDelete={handleDeleteComment}
                      currentUserId={currentUserId}
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