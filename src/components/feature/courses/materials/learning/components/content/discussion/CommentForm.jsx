import React from 'react';

const CommentForm = ({ 
  onSubmit, 
  newComment = '',
  setNewComment = () => {},
  placeholder = 'Tulis komentar Anda...',
  submitLabel = 'Kirim',
  isLoading = false,
  onCancel = null
}) => {
  const handleChange = (e) => {
    if (typeof setNewComment === 'function') {
      setNewComment(e.target.value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea
        value={newComment}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/10 resize-none"
        rows="3"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-white/60 hover:text-white/80 rounded-lg text-sm"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !newComment?.trim()}
          className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Mengirim...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 