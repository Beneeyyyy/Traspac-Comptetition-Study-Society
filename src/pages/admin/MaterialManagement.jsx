import { useState, useEffect, useRef } from 'react'

function MaterialManagement() {
  const [materials, setMaterials] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pointValue: 0,
    subcategoryId: '',
    image: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Fetch materials dan subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, subcategoriesRes] = await Promise.all([
          fetch('http://localhost:3000/api/materials'),
          fetch('http://localhost:3000/api/subcategories')
        ])

        const materialsData = await materialsRes.json()
        const subcategoriesData = await subcategoriesRes.json()

        setMaterials(materialsData)
        setSubcategories(subcategoriesData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle image compression dan upload
  const compressImage = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Max dimension
          const maxDimension = 1200
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width
              width = maxDimension
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          // Compress
          let quality = 0.7
          const maxSize = 1024 * 1024 * 2 // 2MB
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality)

          while (compressedBase64.length > maxSize && quality > 0.1) {
            quality -= 0.1
            compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          }

          resolve(compressedBase64)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(imageFile)
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      try {
        setIsUploading(true)
        const compressedImage = await compressImage(file)
        setFormData(prev => ({ ...prev, image: compressedImage }))
        setImagePreview(compressedImage)
        setIsUploading(false)
      } catch (error) {
        console.error('Error processing image:', error)
        setError('Failed to process image')
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (!formData.title || !formData.content || !formData.subcategoryId) {
        throw new Error('Please fill all required fields')
      }

      const response = await fetch('http://localhost:3000/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create material')
      }

      const newMaterial = await response.json()
      setMaterials(prev => [...prev, newMaterial])
      setShowForm(false)
      setFormData({
        title: '',
        content: '',
        pointValue: 0,
        subcategoryId: '',
        image: ''
      })
      setImagePreview('')
    } catch (err) {
      console.error('Error creating material:', err)
      setError(err.message)
    }
  }

  return (
    <div className="p-6 space-y-8 mt-16">
      {/* Error Display */}
      {error && (
        <div className="relative">
          <div className="p-4 rounded-lg border border-red-500/10 bg-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Material Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Material
        </button>
      </div>

      {/* Add Material Form */}
      {showForm && (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
                      <span className="text-xs text-white/60">Uploading...</span>
                    </div>
                  ) : imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-xs text-white rounded-full ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  {imagePreview ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Point Value</label>
                <input
                  type="number"
                  value={formData.pointValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, pointValue: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1">Subcategory</label>
                <select
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.Category?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white h-32"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                Create Material
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Subcategory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {material.image && (
                      <img
                        src={material.image}
                        alt={material.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="text-sm text-white">{material.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {material.Subcategory?.name}
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {material.pointValue}
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {new Date(material.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MaterialManagement 