import { FiSearch, FiFilter } from 'react-icons/fi'

const SearchBar = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input 
          type="text"
          placeholder="Search discussions..."
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
        />
      </div>
      <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors">
        <FiFilter />
        <span>Filters</span>
      </button>
    </div>
  )
}

export default SearchBar 