import React from 'react';
import { FiHeart } from 'react-icons/fi';

const ReplyList = ({ replies, onLike }) => {
  return (
    <div className="ml-14 space-y-4">
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-white">{reply.user.name}</span>
              {reply.user.role === 'teacher' && (
                <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/80 text-xs border border-white/[0.05]">
                  Guru
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-xs">
                {reply.user.badge}
              </span>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-4 mb-3">
              <p className="text-white/80 leading-relaxed">{reply.content}</p>
              {reply.attachments?.map((attachment, index) => (
                <div key={index} className="mt-3">
                  <img 
                    src={attachment.url} 
                    alt={attachment.caption}
                    className="rounded-lg border border-white/[0.05] w-full max-w-md"
                  />
                  <p className="text-sm text-white/40 mt-2">{attachment.caption}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onLike(reply.id)}
                className={`flex items-center gap-1.5 ${reply.isLiked ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <FiHeart className={`w-4 h-4 ${reply.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{reply.likes}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyList; 