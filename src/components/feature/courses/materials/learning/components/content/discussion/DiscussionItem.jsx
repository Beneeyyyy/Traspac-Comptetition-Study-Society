import React from 'react';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import ReplyList from './ReplyList';

const DiscussionItem = ({ 
  discussion, 
  currentUser,
  isExpanded,
  onToggle,
  onLike,
  onResolve 
}) => {
  return (
    <div className={`space-y-4 ${discussion.resolvedReply ? 'bg-green-500/10 p-4 rounded-lg' : ''}`}>
      <div className="flex gap-4">
        <img 
          src={discussion.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.user.name)}`}
          alt={discussion.user.name}
          className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">{discussion.user.name}</span>
            {discussion.user.role === 'teacher' && (
              <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/80 text-xs border border-white/[0.05]">
                Guru
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs">
              {discussion.user.rank}
            </span>
            <span className="text-white/40 text-sm">
              {new Date(discussion.createdAt).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-4 mb-3">
            <p className="text-white/80 leading-relaxed">{discussion.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(discussion.id)}
              className={`flex items-center gap-1.5 ${discussion.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiHeart className={`w-4 h-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{discussion._count?.likes || 0}</span>
            </button>
            <button 
              onClick={() => onToggle(discussion.id)}
              className={`flex items-center gap-1.5 ${isExpanded ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <FiMessageSquare className="w-4 h-4" />
              <span className="text-sm">
                {discussion._count?.replies || 0} {isExpanded ? 'Tutup' : 'Balas'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {isExpanded && (
        <ReplyList 
          discussionId={discussion.id}
          isResolved={!!discussion.resolvedReply}
          currentUserId={currentUser?.id}
          discussionUserId={discussion.user.id}
          onResolve={onResolve}
          showReplyForm={true}
        />
      )}
    </div>
  );
};

export default DiscussionItem; 