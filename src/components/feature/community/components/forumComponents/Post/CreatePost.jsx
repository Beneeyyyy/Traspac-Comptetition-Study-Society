import { useState, useRef } from 'react'
import { FiImage, FiX, FiMessageSquare, FiLink, FiHash, FiLoader } from 'react-icons/fi'
import { useCommunity } from '../../../context/CommunityContext'

const CreatePost = () => {
  const { addQuestion } = useCommunity()
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 4))
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !tagInput) {
      e.preventDefault()
      setTags(prev => prev.slice(0, -1))
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase()
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags(prev => [...prev, newTag])
      setTagInput('')
    }
  }

  const handleTagInputChange = (e) => {
    const value = e.target.value
    if (value.endsWith(' ')) {
      setTagInput(value.trim())
      addTag()
    } else {
      setTagInput(value)
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      await addQuestion({
        title: title.trim(),
        content: content.trim(),
        images: images.map(img => img.preview),
        tags: tags.length > 0 ? tags : ['general']
      })

      // Reset form
      setTitle('')
      setContent('')
      setImages([])
      setTags([])
      setTagInput('')
      setIsExpanded(false)
    } catch (err) {
      setError(err.message || 'Gagal membuat pertanyaan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden w-full max-w-[1200px] mx-auto">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <img
            src="/avatars/default.png"
            alt="Your avatar"
            className="w-10 h-10 rounded-full ring-1 ring-white/20"
          />
          <div className="flex-1 space-y-4">
            {/* Title Input - Only shown when expanded */}
            {isExpanded && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul pertanyaan..."
                className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
              />
            )}

            {/* Question Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ada pertanyaan? Yuk diskusikan bersama..."
              rows={isExpanded ? 3 : 1}
              onClick={() => setIsExpanded(true)}
              className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
            />

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Tags Input */}
            {isExpanded && (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/70 flex items-center gap-2 group"
                  >
                    <FiHash className="text-white/40" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="p-0.5 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <div className="flex items-center gap-1 flex-1 min-w-[200px] px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg">
                    <FiHash className="text-white/40" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => {
                        if (tagInput.trim()) {
                          addTag()
                        }
                      }}
                      placeholder={tags.length === 0 
                        ? "Ketik tag dan tekan Enter atau spasi" 
                        : "Tambah tag lain..."}
                      className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg border border-white/10"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {isExpanded && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                    title="Tambah gambar"
                  >
                    <FiImage className="text-xl" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                    title="Tambah link"
                  >
                    <FiLink className="text-xl" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsExpanded(false)
                      setTitle('')
                      setContent('')
                      setImages([])
                      setTags([])
                      setTagInput('')
                      setError(null)
                    }}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || isSubmitting}
                    className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2
                      ${title.trim() && content.trim() && !isSubmitting
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-blue-500/50 cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? (
                      <FiLoader className="text-base animate-spin" />
                    ) : (
                      <FiMessageSquare className="text-base" />
                    )}
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pertanyaan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost 