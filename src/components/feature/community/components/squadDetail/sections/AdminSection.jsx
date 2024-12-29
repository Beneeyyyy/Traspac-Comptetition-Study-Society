import React, { useState } from 'react'
import { FiUsers, FiSettings, FiTrash2, FiEdit2, FiShield, FiBook, FiLayout, FiAward, FiInfo, FiMessageSquare, FiX, FiPlus } from 'react-icons/fi'
import { useSquad } from '../../../context/SquadContext'

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0A0A0A] rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FiX className="text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

const AdminSection = ({ squad }) => {
  const { squadData, updateSquadData, addAssignmentToPath } = useSquad()
  const [activeModal, setActiveModal] = useState(null)
  const [formData, setFormData] = useState({
    about: squadData.about || '',
    rules: squadData.rules || [],
    newRule: '',
    learningPath: {
      title: '',
      description: '',
      modules: []
    },
    assignment: {
      title: '',
      description: '',
      dueDate: '',
      points: 0,
      learningPathId: ''
    }
  })

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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddRule = () => {
    if (formData.newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, prev.newRule.trim()],
        newRule: ''
      }))
    }
  }

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (type) => {
    switch (type) {
      case 'about':
        updateSquadData('about', formData.about)
        break
      case 'rules':
        updateSquadData('rules', formData.rules)
        break
      case 'learning-path':
        const newPath = {
          id: Date.now().toString(),
          title: formData.learningPath.title,
          description: formData.learningPath.description,
          progress: 0,
          assignments: []
        }
        updateSquadData('learningPaths', [...(squadData.learningPaths || []), newPath])
        // Reset form
        setFormData(prev => ({
          ...prev,
          learningPath: {
            title: '',
            description: '',
            modules: []
          }
        }))
        break
      case 'assignment':
        if (!formData.assignment.learningPathId) {
          alert('Please select a learning path')
          return
        }
        const newAssignment = {
          id: Date.now().toString(),
          title: formData.assignment.title,
          description: formData.assignment.description,
          dueDate: formData.assignment.dueDate,
          points: Number(formData.assignment.points)
        }
        addAssignmentToPath(formData.assignment.learningPathId, newAssignment)
        // Reset form
        setFormData(prev => ({
          ...prev,
          assignment: {
            title: '',
            description: '',
            dueDate: '',
            points: 0,
            learningPathId: ''
          }
        }))
        break
      default:
        console.log(`Submitting ${type}:`, formData)
    }
    setActiveModal(null)
  }

  const overviewActions = [
    {
      id: 'edit-about',
      label: 'Edit About',
      description: 'Update squad description and basic information',
      icon: FiInfo,
      onClick: () => setActiveModal('about'),
      color: 'blue'
    },
    {
      id: 'manage-rules',
      label: 'Squad Rules',
      description: 'Set and modify squad rules and guidelines',
      icon: FiShield,
      onClick: () => setActiveModal('rules'),
      color: 'purple'
    },
    {
      id: 'manage-members',
      label: 'Manage Members',
      description: 'View, add, remove, or modify member roles',
      icon: FiUsers,
      onClick: () => setActiveModal('members'),
      color: 'emerald'
    }
  ]

  const learningActions = [
    {
      id: 'learning-path',
      label: 'Learning Paths',
      description: 'Create and manage learning paths, modules, and lessons',
      icon: FiBook,
      onClick: () => setActiveModal('learning-path'),
      color: 'blue'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      description: 'Create and manage assignments, quizzes, and projects',
      icon: FiLayout,
      onClick: () => setActiveModal('assignment'),
      color: 'purple'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      description: 'Set up badges, rewards, and milestones for members',
      icon: FiAward,
      onClick: () => setActiveModal('achievements'),
      color: 'amber'
    }
  ]

  const discussionActions = [
    {
      id: 'discussion-settings',
      label: 'Discussion Settings',
      description: 'Configure discussion rules and permissions',
      icon: FiMessageSquare,
      onClick: () => setActiveModal('discussion-settings'),
      color: 'blue'
    },
    {
      id: 'squad-settings',
      label: 'Squad Settings',
      description: 'Update squad information and preferences',
      icon: FiSettings,
      onClick: () => setActiveModal('squad-settings'),
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Overview Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Overview Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overviewActions.map((action) => (
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
          <div className="space-y-4">
            <button
              onClick={() => setActiveModal('learning-path')}
              className="w-full flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors text-left"
            >
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <FiBook size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Learning Paths</h3>
                <p className="text-gray-400 text-sm">Create and manage learning paths</p>
              </div>
            </button>

            {squadData.learningPaths?.map((path) => (
              <div key={path.id} className="bg-gray-900/50 rounded-xl p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium">{path.title}</h4>
                    <p className="text-sm text-gray-400">{path.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        assignment: {
                          ...prev.assignment,
                          learningPathId: path.id
                        }
                      }))
                      setActiveModal('assignment')
                    }}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors"
                  >
                    Add Assignment
                  </button>
                </div>

                {path.assignments && path.assignments.length > 0 && (
                  <div className="pl-4 border-l border-gray-800 space-y-2">
                    {path.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                        <div>
                          <h5 className="text-white text-sm font-medium">{assignment.title}</h5>
                          <p className="text-xs text-gray-400">{assignment.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                          <div className="text-xs text-purple-400">{assignment.points} Points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveModal('achievements')}
            className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors text-left"
          >
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <FiAward size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Achievements</h3>
              <p className="text-gray-400 text-sm">Set up badges and rewards</p>
            </div>
          </button>
        </div>
      </div>

      {/* Discussion Management */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Discussion Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discussionActions.map((action) => (
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

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)}
        title="Edit Squad Information"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('about'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Squad Description</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              rows={4}
              placeholder="Enter squad description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'rules'} 
        onClose={() => setActiveModal(null)}
        title="Manage Squad Rules"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('rules'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Current Rules</label>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <span className="flex-1 p-2 rounded-lg bg-gray-900 text-white">{rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(index)}
                    className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Add New Rule</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="newRule"
                value={formData.newRule}
                onChange={handleInputChange}
                className="flex-1 bg-black rounded-lg border border-gray-800 p-3 text-white"
                placeholder="Enter new rule..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddRule()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Rules
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'learning-path'} 
        onClose={() => setActiveModal(null)}
        title="Create Learning Path"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('learning-path'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Path Title</label>
            <input
              type="text"
              name="title"
              value={formData.learningPath.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                learningPath: { ...prev.learningPath, title: e.target.value }
              }))}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              placeholder="Enter path title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.learningPath.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                learningPath: { ...prev.learningPath, description: e.target.value }
              }))}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              rows={3}
              placeholder="Enter path description..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Path
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'assignment'} 
        onClose={() => setActiveModal(null)}
        title="Create Assignment"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('assignment'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Learning Path</label>
            <select
              value={formData.assignment.learningPathId}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                assignment: { ...prev.assignment, learningPathId: e.target.value }
              }))}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
            >
              <option value="">Select a learning path</option>
              {squadData.learningPaths?.map((path) => (
                <option key={path.id} value={path.id}>{path.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Assignment Title</label>
            <input
              type="text"
              value={formData.assignment.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                assignment: { ...prev.assignment, title: e.target.value }
              }))}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              placeholder="Enter assignment title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.assignment.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                assignment: { ...prev.assignment, description: e.target.value }
              }))}
              className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              rows={3}
              placeholder="Enter assignment description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
              <input
                type="datetime-local"
                value={formData.assignment.dueDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  assignment: { ...prev.assignment, dueDate: e.target.value }
                }))}
                className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Points</label>
              <input
                type="number"
                value={formData.assignment.points}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  assignment: { ...prev.assignment, points: e.target.value }
                }))}
                className="w-full bg-black rounded-lg border border-gray-800 p-3 text-white"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </Modal>

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