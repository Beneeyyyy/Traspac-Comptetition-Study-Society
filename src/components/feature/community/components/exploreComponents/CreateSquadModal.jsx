import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUpload } from 'react-icons/fi'

const CreateSquadModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    banner: null,
    image: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Debug log
  console.log('Modal props:', { isOpen })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Create New Study Squad</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Banner Image
              </label>
              <div 
                className="relative h-32 bg-black/50 rounded-lg overflow-hidden border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors"
              >
                {formData.banner ? (
                  <img 
                    src={formData.banner} 
                    alt="Banner preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <FiUpload size={24} />
                    <span className="text-sm mt-2">Upload banner image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'banner')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Squad Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Squad Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-black/50 rounded-full overflow-hidden border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <FiUpload size={20} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">
                    Upload a squad avatar. Recommended size: 200x200px
                  </p>
                </div>
              </div>
            </div>

            {/* Squad Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Squad Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-black rounded-lg border border-gray-800 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter squad name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-black rounded-lg border border-gray-800 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Describe your study squad"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create Squad
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSquadModal 