import React, { useState } from 'react'
import { FiX, FiUpload } from 'react-icons/fi'
import { useAuth } from '../../../../../contexts/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const CreateSquadModal = ({ isOpen, onClose, onSquadCreated }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    banner: null,
    image: null,
    isPublic: true
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'image') {
        setImagePreview(reader.result)
        setFormData(prev => ({ ...prev, image: reader.result }))
      } else {
        setBannerPreview(reader.result)
        setFormData(prev => ({ ...prev, banner: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting squad data:', {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        hasImage: !!formData.image,
        hasBanner: !!formData.banner
      })

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/squads`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      console.log('Squad created:', response.data)
      
      if (onSquadCreated) {
        onSquadCreated(response.data)
      }
      
      toast.success('Squad created successfully!')
      onClose()
    } catch (error) {
      console.error('Error creating squad:', error)
      toast.error(error.response?.data?.message || 'Failed to create squad')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create New Squad</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX className="text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Squad Banner
            </label>
            <div 
              className="aspect-[3/1] rounded-lg bg-black/30 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => document.getElementById('banner-upload').click()}
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <FiUpload className="mx-auto text-2xl text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload banner</p>
                </div>
              )}
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'banner')}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Squad Image
            </label>
            <div 
              className="w-24 h-24 rounded-lg bg-black/30 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => document.getElementById('image-upload').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <FiUpload className="mx-auto text-xl text-gray-600 mb-1" />
                  <p className="text-xs text-gray-500">Upload image</p>
                </div>
              )}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'image')}
              />
            </div>
          </div>

          {/* Squad Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Squad Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-black/30 border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter squad name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/30 border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Describe your squad"
              rows={4}
              required
            />
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Privacy Setting
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                  className="form-radio text-blue-500"
                />
                <span className="text-sm text-gray-300">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                  className="form-radio text-blue-500"
                />
                <span className="text-sm text-gray-300">Private</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
                loading
                  ? 'bg-blue-500/50 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Creating...' : 'Create Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSquadModal 