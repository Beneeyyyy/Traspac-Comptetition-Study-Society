import { useState, lazy, Suspense, memo } from 'react';
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

const DiscussionPanel = ({ materialId }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: 'Sarah',
        avatar: '/avatars/sarah.jpg',
        role: 'student',
        badge: 'Active Learner'
      },
      content: 'Saya masih bingung tentang teorema Pythagoras, bisa tolong jelaskan lebih detail?',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 2,
          user: {
            name: 'Mr. John',
            avatar: '/avatars/john.jpg',
            role: 'teacher',
            badge: 'Math Expert'
          },
          content: 'Teorema Pythagoras menyatakan bahwa dalam segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi lainnya. Jadi, a² + b² = c², dimana c adalah sisi miring.',
          likes: 8,
          isLiked: false,
          attachments: [
            {
              type: 'image',
              url: '/materials/pythagoras.jpg',
              caption: 'Ilustrasi Teorema Pythagoras'
            }
          ]
        }
      ],
      timestamp: '2 jam yang lalu'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      user: {
        name: 'Anda',
        avatar: '/avatars/default.jpg',
        role: 'student',
        badge: 'New Learner'
      },
      content: newComment,
      likes: 0,
      isLiked: false,
      replies: [],
      timestamp: 'Baru saja'
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const handleLike = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
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
          <span className="text-white/60 text-sm">{comments.length} komentar</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-white/60 border border-white/[0.05] text-sm"
          >
            {isExpanded ? 'Tutup' : 'Perluas'}
          </button>
        </div>
      </div>

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
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(DiscussionPanel); 