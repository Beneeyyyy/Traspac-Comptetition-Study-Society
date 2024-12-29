import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { FiBook, FiMessageSquare, FiInfo, FiUsers, FiAward, FiClock, FiSettings } from 'react-icons/fi'
import OverviewSection from './sections/OverviewSection'
import LearningSection from './sections/LearningSection'
import DiscussionSection from './sections/DiscussionSection'
import AdminSection from './sections/AdminSection'

const SquadDetail = ({ squad }) => {
  // Temporary admin check - replace with actual auth logic later
  const isAdmin = true // For testing purposes

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiInfo, component: <OverviewSection squad={squad} isAdmin={isAdmin} /> },
    { id: 'learning', label: 'Learning', icon: FiBook, component: <LearningSection squad={squad} isAdmin={isAdmin} /> },
    { id: 'discussion', label: 'Discussion', icon: FiMessageSquare, component: <DiscussionSection squad={squad} isAdmin={isAdmin} /> },
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: FiSettings, 
      component: <AdminSection squad={squad} />,
      isAdminOnly: true 
    }
  ].filter(tab => !tab.isAdminOnly || isAdmin) // Only show admin tab if user is admin

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="space-y-6">
          {/* Squad Banner */}
          <div className="relative h-64 rounded-xl overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
            <img 
              src={squad?.banner || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1470"} 
              alt="Squad Banner"
              className="w-full h-full object-cover opacity-60"
            />
            
            {/* Squad Info Container */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end gap-8">
                {/* Squad Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-black">
                    <img 
                      src={squad?.image || "https://ui-avatars.com/api/?name=Web+Development&background=6366F1&color=fff"} 
                      alt="Squad"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-green-500 border-4 border-black flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-200 animate-pulse" />
                  </div>
                </div>

                {/* Squad Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {squad?.name || "Web Development Squad"}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Level {squad?.level || 3}
                    </span>
                  </div>
                  
                  {/* Squad Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiUsers className="text-blue-400" />
                      <span>{squad?.members || 24} Members</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiAward className="text-purple-400" />
                      <span>{squad?.xp || "2,500"} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiClock className="text-emerald-400" />
                      <span>Created {squad?.createdAt || "Oct 2023"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Squad Content */}
          <div className="bg-black rounded-xl border border-gray-800">
            <Tab.Group>
              <Tab.List className="flex gap-2 px-6 pt-2">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    className={({ selected }) => 
                      `flex items-center gap-2 px-5 py-3 text-sm font-medium outline-none transition-colors relative ${
                        selected 
                          ? 'text-blue-400' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <tab.icon className="text-base" />
                        {tab.label}
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform origin-left transition-transform duration-200 ${
                            selected ? 'scale-x-100' : 'scale-x-0'
                          }`} 
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="p-6 border-t border-gray-800">
                {tabs.map(tab => (
                  <Tab.Panel key={tab.id}>
                    {tab.component}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SquadDetail 