import React from 'react';

const QuestionCardSkeleton = () => {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-full" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-white/10 rounded mb-2" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-6 w-3/4 bg-white/10 rounded" />
        <div className="h-4 w-full bg-white/10 rounded" />
        <div className="h-4 w-2/3 bg-white/10 rounded" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-20 bg-white/10 rounded-full" />
        <div className="h-6 w-16 bg-white/10 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-24 bg-white/10 rounded" />
      </div>
    </div>
  );
};

export default QuestionCardSkeleton; 