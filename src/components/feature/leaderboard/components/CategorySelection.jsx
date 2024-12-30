import { FiCalendar, FiBook, FiAward } from 'react-icons/fi'

const categories = [ 
  { id: 'weekly', name: 'Weekly Rankings', icon: FiBook },
  { id: 'all', name: 'All of Time', icon: FiCalendar },
  { id: 'school', name: 'School Rankings', icon: FiAward }
];

export default function CategorySelection({ activeCategory, setActiveCategory }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]'
            }`}
          >
            <Icon className={`w-4 h-4 ${
              activeCategory === category.id ? 'text-purple-400' : 'text-white/60'
            }`} />
            <span className={activeCategory === category.id ? 'text-purple-400' : 'text-white/60'}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
} 