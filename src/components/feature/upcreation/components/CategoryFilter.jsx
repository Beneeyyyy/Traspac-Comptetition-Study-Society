const CategoryFilter = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedCategory('All')}
        className={
          selectedCategory === 'All'
            ? 'px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 shadow-lg shadow-white/5'
            : 'px-6 py-2 rounded-full bg-transparent text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300'
        }
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={
            selectedCategory === cat
              ? 'px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 shadow-lg shadow-white/5 whitespace-nowrap'
              : 'px-6 py-2 rounded-full bg-transparent text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300 whitespace-nowrap'
          }
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter 