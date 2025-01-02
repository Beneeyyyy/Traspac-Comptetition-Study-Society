export const CategorySkeletons = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/[0.05] animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 bg-white/[0.05] rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/[0.05] rounded animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </>
)

export default CategorySkeletons 