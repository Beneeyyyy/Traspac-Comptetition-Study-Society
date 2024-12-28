import { useState, useRef } from 'react'
import { FiImage, FiX } from 'react-icons/fi'

const CreatePost = () => {
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 4)) // Max 4 images
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <img
          src="https://ui-avatars.com/api/?name=You"
          alt="Your avatar"
          className="w-10 h-10 rounded-full ring-1 ring-white/20"
        />
        <div className="flex-1 flex items-center gap-2">
          <input 
            type="text"
            placeholder="Ada pertanyaan? Yuk diskusikan bersama..."
            className="flex-1 px-4 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-white/50 hover:text-white/70 transition-colors"
            title="Upload gambar"
          >
            <FiImage className="text-xl" />
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
      </div>

      {/* Preview Images */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-white/10"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white/70 hover:text-white transition-colors"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CreatePost 