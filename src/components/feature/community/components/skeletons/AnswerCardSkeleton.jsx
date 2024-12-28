const AnswerCardSkeleton = () => {
  return (
    <div className="group flex bg-white/[0.01] border-b border-white/10 animate-pulse">
      {/* Vote Column */}
      <div className="py-4 px-3 flex flex-col items-center gap-1.5 border-r border-white/10 min-w-[60px]">
        <div className="w-7 h-7 rounded-md bg-white/5" />
        <div className="w-5 h-5 rounded bg-white/5" />
        <div className="w-7 h-7 rounded-md bg-white/5" />
      </div>

      {/* Answer Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-28 h-5 rounded bg-white/5" />
              <div className="w-20 h-5 rounded-full bg-white/5" />
            </div>
            <div className="w-16 h-4 mt-1 rounded bg-white/5" />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/5" />
            <div className="w-7 h-7 rounded-lg bg-white/5" />
            <div className="w-7 h-7 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Answer Content */}
        <div className="pl-11 space-y-2">
          <div className="w-full h-4 rounded bg-white/5" />
          <div className="w-5/6 h-4 rounded bg-white/5" />
          <div className="w-4/6 h-4 rounded bg-white/5" />
        </div>
      </div>
    </div>
  )
}

export default AnswerCardSkeleton 