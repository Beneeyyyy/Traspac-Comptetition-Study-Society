import { FiTrendingUp, FiMessageSquare, FiUsers } from 'react-icons/fi'

const tabs = [
  { id: 'trending', icon: FiTrendingUp, label: 'Trending' },
  { id: 'latest', icon: FiMessageSquare, label: 'Latest' },
  { id: 'following', icon: FiUsers, label: 'Following' }
]

const TabBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={\`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors \${
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08]'
          }\`}
        >
          <tab.icon className="text-lg" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TabBar 