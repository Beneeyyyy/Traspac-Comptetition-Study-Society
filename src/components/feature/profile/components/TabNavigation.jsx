export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = ['overview', 'achievements', 'courses', 'settings']
  
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === tab
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
} 