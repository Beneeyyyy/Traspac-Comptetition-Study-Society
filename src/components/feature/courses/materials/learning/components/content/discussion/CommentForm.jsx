import React from 'react';
import { FiSmile, FiImage, FiPaperclip, FiSend } from 'react-icons/fi';

const CommentForm = ({ onSubmit, newComment, setNewComment }) => {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex-shrink-0" />
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis pertanyaan atau komentar..."
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/10 resize-none min-h-[100px]"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button type="button" className="p-2 text-white/40 hover:text-white/60 transition-colors">
                <FiSmile className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-white/40 hover:text-white/60 transition-colors">
                <FiImage className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-white/40 hover:text-white/60 transition-colors">
                <FiPaperclip className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white text-sm font-medium transition-all"
            >
              <FiSend className="w-4 h-4" />
              Kirim Komentar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 