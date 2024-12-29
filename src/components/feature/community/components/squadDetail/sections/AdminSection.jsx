import React from 'react'
import { FiUsers, FiSettings, FiTrash2, FiEdit2, FiShield, FiBook, FiLayout, FiAward } from 'react-icons/fi'

const AdminSection = ({ squad }) => {
  const handleUpdateSquad = () => {
    // TODO: Implement squad update logic
    console.log('Updating squad settings')
  }

  const handleManageMembers = () => {
    // TODO: Implement member management logic
    console.log('Managing members')
  }

  const handleDeleteSquad = () => {
    // TODO: Implement squad deletion logic
    console.log('Deleting squad')
  }

  const adminActions = [
    {
      id: 'settings',
      label: 'Squad Settings',
      description: 'Update squad information, rules, and preferences',
      icon: FiSettings,
      onClick: handleUpdateSquad,
      color: 'blue'
    },
    {
      id: 'members',
      label: 'Manage Members',
      description: 'View, add, remove, or modify member roles',
      icon: FiUsers,
      onClick: handleManageMembers,
      color: 'purple'
    }
  ]

  const learningActions = [
    {
      id: 'learning-path',
      label: 'Learning Paths',
      description: 'Create and manage learning paths, modules, and lessons',
      icon: FiBook,
      onClick: () => console.log('Managing learning paths'),
      color: 'emerald'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      description: 'Set up badges, rewards, and milestones for members',
      icon: FiAward,
      onClick: () => console.log('Managing achievements'),
      color: 'amber'
    }
  ]

  const assignmentAction = {
    id: 'assignments',
    label: 'Assignments',
    description: 'Create and manage assignments, quizzes, and projects. Monitor progress and grade submissions.',
    icon: FiLayout,
    onClick: () => console.log('Managing assignments'),
    color: 'purple'
  }

  const moderationActions = [
    {
      id: 'roles',
      label: 'Role Management',
      description: 'Create and manage squad roles and permissions',
      icon: FiShield,
      onClick: () => console.log('Managing roles'),
      color: 'emerald'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Squad Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Squad Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                <action.icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{action.label}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Learning Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {learningActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
              >
                <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                  <action.icon size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{action.label}</h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Assignment Card */}
          <button
            onClick={assignmentAction.onClick}
            className={`flex flex-col gap-3 p-5 rounded-xl bg-${assignmentAction.color}-500/5 border border-${assignmentAction.color}-500/10 hover:bg-${assignmentAction.color}-500/10 transition-colors text-left`}
          >
            <div className={`p-3 rounded-lg bg-${assignmentAction.color}-500/10 text-${assignmentAction.color}-400 self-start`}>
              <assignmentAction.icon size={22} />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{assignmentAction.label}</h3>
              <p className="text-gray-400 text-sm">{assignmentAction.description}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Moderation */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Moderation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moderationActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl bg-${action.color}-500/5 border border-${action.color}-500/10 hover:bg-${action.color}-500/10 transition-colors text-left`}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/10 text-${action.color}-400`}>
                <action.icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{action.label}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/10 rounded-xl p-6">
        <h3 className="text-red-500 font-medium mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Delete Squad</h4>
              <p className="text-gray-400 text-sm">
                Permanently delete this squad and all its data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeleteSquad}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Delete Squad
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSection 