import { useState } from 'react';
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import ReplyList from './ReplyList';

const CommentItem = ({ comment, onLike }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">{comment.user.name}</span>
            {comment.user.role === 'teacher' && (
              <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/80 text-xs border border-white/[0.05]">
                Guru
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs">
              {comment.user.badge}
            </span>
            <span className="text-white/40 text-sm">{comment.timestamp}</span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-4 mb-3">
            <p className="text-white/80 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1.5 ${comment.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiHeart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{comment.likes}</span>
            </button>
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/60"
            >
              <FiMessageSquare className="w-4 h-4" />
              <span className="text-sm">{comment.replies?.length || 0} Balasan</span>
            </button>
            <button className="flex items-center gap-1.5 text-white/40 hover:text-white/60">
              <FiShare2 className="w-4 h-4" />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {showReplies && comment.replies?.length > 0 && (
        <ReplyList replies={comment.replies} onLike={onLike} />
      )}
    </div>
  );
};

export default CommentItem; 