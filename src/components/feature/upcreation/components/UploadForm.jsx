import { useState } from 'react'
import { FiUpload, FiX, FiGithub, FiImage, FiVideo, FiFile } from 'react-icons/fi'

const UploadForm = ({ setIsUploadMode, categories }) => {
  const [files, setFiles] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    
    // Validate file size
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      return true
    })

    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length === 0) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    
    const validFiles = droppedFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      return true
    })

    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const removeFile = (index) => {
    const newFiles = [...files]
    URL.revokeObjectURL(newFiles[index].preview)
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleTagAdd = (e) => {
    e.preventDefault()
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return FiImage
    if (type.startsWith('video/')) return FiVideo
    return FiFile
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!description.trim()) {
      setError('Description is required')
      return
    }
    if (!category) {
      setError('Category is required')
      return
    }
    if (files.length === 0) {
      setError('At least one file is required')
      return
    }

    setIsSubmitting(true)

    try {
      // Convert files to base64 for localStorage
      const filePromises = files.map(fileObj => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              name: fileObj.file.name,
              type: fileObj.file.type,
              size: fileObj.file.size,
              data: reader.result
            })
          }
          reader.onerror = reject
          reader.readAsDataURL(fileObj.file)
        })
      })

      const processedFiles = await Promise.all(filePromises)

      // Create new work object
      const newWork = {
        id: Date.now(),
        title,
        description,
        category,
        projectUrl,
        tags,
        files: processedFiles,
        author: "Current User", // Normally would come from auth
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        badge: "Creator",
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString()
      }

      // Get existing works from localStorage
      const existingWorks = JSON.parse(localStorage.getItem('studentWorks') || '[]')
      
      // Add new work
      const updatedWorks = [newWork, ...existingWorks]
      
      // Save to localStorage
      localStorage.setItem('studentWorks', JSON.stringify(updatedWorks))

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clear form
      setTitle('')
      setDescription('')
      setCategory('')
      setProjectUrl('')
      setTags([])
      setFiles([])
      
      // Close upload mode
      setIsUploadMode(false)
    } catch (err) {
      setError('Failed to save project. Please try again.')
      console.error('Error saving project:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1F2937] border border-[#374151] rounded-xl p-8 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">Share Your Work</h2>
        <button
          type="button"
          onClick={() => setIsUploadMode(false)}
          className="p-2 hover:bg-[#374151] rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-8">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="hidden"
          id="file-upload"
          accept="image/*,video/*,application/pdf,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="block cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className="border-2 border-dashed border-[#374151] rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#374151] flex items-center justify-center mx-auto mb-4">
              <FiUpload className="text-2xl text-[#94A3B8]" />
            </div>
            <p className="text-[#94A3B8] mb-2">Drag and drop your files here</p>
            <p className="text-sm text-[#64748B] mb-4">Support for images, videos, documents (Max 5MB per file)</p>
            <button 
              type="button" 
              onClick={() => document.getElementById('file-upload').click()}
              className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/20"
            >
              Select Files
            </button>
          </div>
        </label>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file.file.type)
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-[#374151] group">
                  <div className="w-12 h-12 rounded-lg bg-[#374151] flex items-center justify-center">
                    {file.file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileIcon className="w-6 h-6 text-[#94A3B8]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-[#64748B]">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-2 rounded-lg hover:bg-[#374151] text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Details Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your work a title"
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg px-4 py-3 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your work"
            rows={4}
            className="w-full bg-[#374151] border border-[#4B5563] rounded-lg px-4 py-3 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Category <span className="text-red-500">*</span></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#374151] border border-[#4B5563] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              required
            >
              <option value="" className="bg-[#0A0A0B]">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0A0A0B]">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Project URL (Optional)</label>
            <div className="flex items-center gap-2 bg-[#374151] border border-[#4B5563] rounded-lg px-4 py-3 focus-within:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]">
              <FiGithub className="text-[#94A3B8]" />
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="flex-1 bg-transparent text-white placeholder:text-[#64748B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add tags to help others find your work"
              className="flex-1 bg-[#374151] border border-[#4B5563] rounded-lg px-4 py-2 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleTagAdd(e)
                }
              }}
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/20 font-medium"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#374151] border border-[#4B5563] rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 bg-[#2563EB] text-white rounded-lg transition-all duration-300 font-medium ${
            isSubmitting 
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/20'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Share Work'}
        </button>
      </div>
    </form>
  )
}

export default UploadForm 