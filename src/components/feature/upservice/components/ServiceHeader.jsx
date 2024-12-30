import { FiPlus } from 'react-icons/fi'

const ServiceHeader = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories, onCreateClick }) => {
  return (
    <>
      {/* Header with Search and Create Button */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
        >
          <FiPlus className="text-xl" />
          <span>Create Service</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full border transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  )
}

export default ServiceHeader 