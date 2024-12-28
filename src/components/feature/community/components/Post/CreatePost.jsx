import { useState, useRef } from 'react'
import { FiImage, FiX, FiMessageSquare, FiLink } from 'react-icons/fi'

const CreatePost = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [images, setImages] = useState([])
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

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden w-full max-w-[1200px] mx-auto">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <img
            src="https://ui-avatars.com/api/?name=You"
            alt="Your avatar"
            className="w-10 h-10 rounded-full ring-1 ring-white/20"
          />
          <div className="flex-1 space-y-4">
            {/* Title Input - Only shown when expanded */}
            {isExpanded && (
              <input
                type="text"
                placeholder="Judul pertanyaan..."
                className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
              />
            )}

            {/* Question Input */}
            <textarea
              placeholder="Ada pertanyaan? Yuk diskusikan bersama..."
              rows={isExpanded ? 3 : 1}
              onClick={() => setIsExpanded(true)}
              className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
            />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/10"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-white transition-colors"
                    >
                      <FiX className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-3">
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
            >
              Batal
            </button>
          )}
          <button className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <FiMessageSquare className="text-base" />
            {isExpanded ? 'Kirim Pertanyaan' : 'Tanyakan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePost 