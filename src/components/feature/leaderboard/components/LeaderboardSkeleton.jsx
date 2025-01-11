import React from 'react';

const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="relative p-4 rounded-lg backdrop-blur-sm bg-white/5 animate-pulse"
        >
          {/* Rank Badge Skeleton */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
          </div>

          <div className="flex items-center gap-4 pl-8">
            {/* Avatar Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/10" />
            </div>

            {/* Info Skeleton */}
            <div className="flex-grow">
              <div className="h-4 w-32 bg-white/10 rounded mb-2" />
              <div className="h-3 w-48 bg-white/10 rounded" />
            </div>

            {/* Points Skeleton */}
            <div className="flex-shrink-0">
              <div className="h-6 w-20 bg-white/10 rounded mb-1" />
              <div className="h-3 w-12 bg-white/10 rounded" />
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mt-3 h-1 w-full bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default LeaderboardSkeleton; 