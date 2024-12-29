const SkeletonCard = ({ index }) => {
  return (
    <div 
      className={`group relative animate-pulse ${
        index % 5 === 0 ? 'row-span-2 col-span-2' : 
        index % 7 === 0 ? 'row-span-2' : 
        index % 3 === 0 ? 'col-span-2' : ''
      }`}
    >
      <div className="relative w-full h-full bg-[#1F2937] rounded-xl overflow-hidden">
        {/* Profile and Stats - Top */}
        <div className="absolute inset-x-0 top-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#374151]"></div>
              <div className="h-4 w-24 bg-[#374151] rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 bg-[#374151] rounded"></div>
              <div className="h-4 w-12 bg-[#374151] rounded"></div>
            </div>
          </div>
        </div>

        {/* Title and Tags - Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="h-6 w-3/4 bg-[#374151] rounded mb-2"></div>
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-[#374151] rounded"></div>
            <div className="h-4 w-16 bg-[#374151] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard 