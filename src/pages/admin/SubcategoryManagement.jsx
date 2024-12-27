import { useState, useEffect } from 'react'

function SubcategoryManagement() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([]) // Untuk dropdown parent category
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '', // Relasi ke parent category
    image: null,
    imagePreview: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch subcategories dengan data category parent
  const fetchSubcategories = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching subcategories...')
      
      const response = await fetch('http://localhost:3000/api/subcategories', {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`)
      }
      
      const data = await response.json()
      console.log('Received subcategories:', data)
      setSubcategories(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories untuk dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Maximum size is 5MB')
        return
      }

      console.log('Processing image:', {
        name: file.name,
        type: file.type,
        size: file.size
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result
        console.log('Image converted to base64')
        console.log('Base64 data length:', base64Data.length)
        console.log('Base64 data starts with:', base64Data.substring(0, 50) + '...')
        
        setFormData(prev => ({
          ...prev,
          image: base64Data,
          imagePreview: base64Data
        }))
      }
      reader.onerror = (error) => {
        console.error('Error reading file:', error)
        alert('Error reading image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editMode 
        ? `http://localhost:3000/api/subcategories/${formData.id}`
        : 'http://localhost:3000/api/subcategories'

      const method = editMode ? 'PUT' : 'POST'

      // Prepare request body
      const requestBody = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId)
      }

      // Handle image
      if (formData.image) {
        requestBody.image = formData.image
        console.log('Image data length:', formData.image.length)
        console.log('Image data starts with:', formData.image.substring(0, 50) + '...')
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Failed to save subcategory')
      }

      const data = await response.json()
      console.log('Full response from server:', data)

      if (!data.image) {
        console.warn('Warning: No image URL in server response')
      }

      await fetchSubcategories()
      setShowForm(false)
      setEditMode(false)
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        image: null,
        imagePreview: null
      })
    } catch (err) {
      console.error('Full error details:', err)
      setError(err.message)
      alert(err.message)
    }
  }

  const handleEdit = (subcategory) => {
    console.log('Editing subcategory:', subcategory)
    setFormData({
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description || '',
      categoryId: subcategory.categoryId.toString(),
      image: subcategory.image || null,
      imagePreview: subcategory.image || null
    })
    setEditMode(true)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return

    try {
      const response = await fetch(`http://localhost:3000/api/subcategories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete subcategory')
      }

      fetchSubcategories()
    } catch (err) {
      setError(err.message)
      alert(err.message)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-white/5 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Subcategory Management</h1>
            <p className="text-gray-400 mt-2">Manage your learning subcategories</p>
          </div>
          <button 
            onClick={() => {
              setShowForm(!showForm)
              if (!showForm) {
                setEditMode(false)
                setFormData({ 
                  name: '', 
                  description: '', 
                  categoryId: '',
                  image: null,
                  imagePreview: null
                })
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Subcategory'}
          </button>
        </div>

        {/* Subcategory Form */}
        {showForm && (
          <div className="mb-8 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 p-6">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Parent Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter subcategory name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white h-32"
                  placeholder="Enter subcategory description (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
                {(formData.imagePreview || formData.image) && (
                  <div className="mt-2">
                    <img 
                      src={formData.imagePreview || formData.image}
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}
                {editMode && !formData.imagePreview && formData.image && (
                  <p className="mt-1 text-sm text-gray-400">
                    Current image will be kept if no new image is selected
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editMode ? 'Update Subcategory' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <div key={subcategory.id} className="bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="aspect-video w-full relative">
                {subcategory.image ? (
                  <img 
                    src={subcategory.image} 
                    alt={subcategory.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{subcategory.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {subcategory.description || 'No description'}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Category: {subcategory.Category?.name || 'Unknown'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Created: {new Date(subcategory.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(subcategory)}
                      className="px-3 py-1 text-sm bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subcategory.id)}
                      className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subcategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No subcategories found</div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setFormData({ 
                  name: '', 
                  description: '', 
                  categoryId: '',
                  image: null,
                  imagePreview: null
                })
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Your First Subcategory
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubcategoryManagement 