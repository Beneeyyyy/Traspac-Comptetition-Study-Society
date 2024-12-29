import { FiSearch, FiPlus } from 'react-icons/fi'

const SearchBar = ({ searchQuery, setSearchQuery, setIsUploadMode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
      <div className="relative flex-1 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search works..."
          className="w-full bg-transparent backdrop-blur-sm border border-white/10 rounded-full pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/20"
        />
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
      </div>
      <button
        onClick={() => setIsUploadMode(true)}
        className="relative group px-8 py-3 rounded-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center gap-2">
          <FiPlus className="w-5 h-5" />
          <span>Create</span>
        </div>
      </button>
    </div>
  )
}

export default SearchBar 