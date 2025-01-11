import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiX, FiHeart, FiMessageSquare, FiEye, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../../../../contexts/AuthContext';

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

      if (response.data) {
        // Add the new reply to the replies state
        const newReply = response.data;
        setReplies(prev => [...prev, newReply]);
        setShowReplies(true); // Show replies after adding new one
        
        // Clear the reply form
        setReplyContent('');
        setShowReplyForm(false);
        
        // Update the reply count in the parent comment
        if (comment._count) {
          comment._count.replies = (comment._count.replies || 0) + 1;
        }
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      throw new Error('Failed to add reply');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <img
          src={comment.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=0D8ABC&color=fff`}
          alt={comment.author}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{comment.author}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 ${
                comment.liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
              }`}
            >
              <FiHeart className={comment.liked ? 'fill-current' : ''} />
              <span>{comment._count?.likes || 0}</span>
            </button>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-400 hover:text-white"
            >
              Reply
            </button>
            
            {comment._count?.replies > 0 && !showReplies && (
              <button
                onClick={() => setShowReplies(true)}
                className="text-gray-400 hover:text-white"
              >
                Show {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
              </button>
            )}
            
            {currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-500 hover:text-red-400 ml-auto"
              >
                Delete
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
                onDelete={onDelete}
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

const WorkDetail = ({ work: initialWork, setSelectedWork, onLikeUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [work, setWork] = useState(initialWork);
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

  // Fetch comments when work changes
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/creations/${work.id}/comments`, {
          withCredentials: true
        });
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [work.id]);

  // Sync work state with props
  useEffect(() => {
    setWork(initialWork);
  }, [initialWork]);

  const handleLikeCreation = async (e) => {
    e.stopPropagation();
    
    // Optimistic update
    const wasLiked = work.liked;
    const prevCount = work.likeCount;
    const newLiked = !wasLiked;
    
    // Update local state immediately
    setWork(prev => ({
      ...prev,
      liked: newLiked,
      likeCount: newLiked ? prevCount + 1 : prevCount - 1
    }));
    
    // Animate heart
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 1000);

    // Call parent handler
    try {
      await onLikeUpdate(work.id, newLiked);
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setWork(prev => ({
        ...prev,
        liked: wasLiked,
        likeCount: prevCount
      }));
    }
  };

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

      if (response.data) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(
        `/api/creations/${work.id}/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId
              ? { ...comment, liked: response.data.liked, _count: { ...comment._count, likes: response.data.likeCount } }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to update like');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/creations/${work.id}/comments/${commentId}`, {
        withCredentials: true
      });
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
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
              src={work.image}
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
                    src={work.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(work.author)}&background=0D8ABC&color=fff`}
                    alt={work.author}
                    className="w-10 h-10 rounded-full border-2 border-gray-800"
                  />
                  <div>
                    <h3 className="font-medium text-white">{work.author}</h3>
                    {work.user?.school?.name && (
                      <span className="text-xs text-gray-400">{work.user.school.name}</span>
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
                  <span>{work.views || 0}</span>
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
                      onReply={handleAddComment}
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