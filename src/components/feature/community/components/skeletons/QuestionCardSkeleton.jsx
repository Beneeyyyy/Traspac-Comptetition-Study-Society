const QuestionCardSkeleton = () => {
  return (
    <div className="group bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden animate-pulse">
      <div className="flex">
        {/* Vote Column */}
        <div className="py-6 px-4 flex flex-col items-center gap-2 border-r border-white/10 min-w-[80px]">
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="w-6 h-6 rounded bg-white/5" />
          <div className="w-8 h-8 rounded-lg bg-white/5" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-32 h-5 rounded bg-white/5" />
                <div className="w-24 h-5 rounded-full bg-white/5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-20 h-4 rounded bg-white/5" />
                <div className="w-24 h-4 rounded bg-white/5" />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-3 mb-4">
            <div className="w-3/4 h-7 rounded bg-white/5" />
            <div className="space-y-2">
              <div className="w-full h-4 rounded bg-white/5" />
              <div className="w-2/3 h-4 rounded bg-white/5" />
            </div>
          </div>

          {/* Tags & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-20 h-7 rounded-lg bg-white/5" />
              <div className="w-20 h-7 rounded-lg bg-white/5" />
              <div className="w-20 h-7 rounded-lg bg-white/5" />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-5 rounded bg-white/5" />
              <div className="w-28 h-5 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCardSkeleton 