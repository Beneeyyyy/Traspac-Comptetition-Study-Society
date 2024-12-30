import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX } from 'react-icons/fi'

const CreateServiceModal = ({ isOpen, onClose, onSubmit, newService, setNewService, categories }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white"
            >
              <FiX className="text-xl" />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Create New Service</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Service Title</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  placeholder="Enter service title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Describe your service"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Price</label>
                  <input
                    type="text"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    placeholder="e.g. $50/hour"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    {categories.filter(cat => cat !== 'All').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Showcase Images</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setNewService(prev => ({
                              ...prev,
                              showcaseImages: [...prev.showcaseImages, reader.result]
                            }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiPlus className="text-2xl text-white/40" />
                    </div>
                  </div>
                  {newService.showcaseImages.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Showcase ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewService(prev => ({
                            ...prev,
                            showcaseImages: prev.showcaseImages.filter((_, i) => i !== index)
                          }))
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <span className="sr-only">Remove image</span>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/40">Upload up to 3 images to showcase your work</p>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Service
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CreateServiceModal 