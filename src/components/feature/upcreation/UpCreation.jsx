import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiImage, FiVideo, FiFileText, FiCode, FiUpload } from 'react-icons/fi'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'

const UpCreation = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const contentTypes = [
    { id: 'article', icon: FiFileText, label: 'Article', description: 'Share your knowledge through written content' },
    { id: 'video', icon: FiVideo, label: 'Video Tutorial', description: 'Create engaging video tutorials' },
    { id: 'code', icon: FiCode, label: 'Code Snippet', description: 'Share useful code examples' },
    { id: 'resource', icon: FiImage, label: 'Learning Resource', description: 'Upload helpful learning materials' }
  ]

  const getTypeButtonClass = (typeId) => {
    const baseClass = "relative p-6 rounded-xl border transition-colors text-left group"
    const activeClass = "bg-blue-500/10 border-blue-500/50"
    const inactiveClass = "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
    return `${baseClass} ${selectedType === typeId ? activeClass : inactiveClass}`
  }

  const getIconContainerClass = (typeId) => {
    const baseClass = "w-12 h-12 rounded-lg flex items-center justify-center"
    const activeClass = "bg-blue-500/20"
    const inactiveClass = "bg-white/5"
    return `${baseClass} ${selectedType === typeId ? activeClass : inactiveClass}`
  }

  const getIconClass = (typeId) => {
    const baseClass = "text-2xl"
    const activeClass = "text-blue-400"
    const inactiveClass = "text-white/60"
    return `${baseClass} ${selectedType === typeId ? activeClass : inactiveClass}`
  }

  const getTitleClass = (typeId) => {
    const baseClass = "font-medium"
    const activeClass = "text-blue-400"
    const inactiveClass = "text-white"
    return `${baseClass} ${selectedType === typeId ? activeClass : inactiveClass}`
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
      <Navbar />
      
      <main className="relative flex-1">
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        </div>

        <div className="relative w-full">
          <section className="py-12 pt-20">
            <div className="container max-w-screen-xl mx-auto px-6">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Up Creation</h1>
                <p className="text-lg text-white/60 max-w-2xl">Share your knowledge and help others learn by creating educational content.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {contentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={getTypeButtonClass(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={getIconContainerClass(type.id)}>
                        <type.icon className={getIconClass(type.id)} />
                      </div>
                      <div>
                        <h3 className={getTitleClass(type.id)}>{type.label}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-white/40">{type.description}</p>
                  </motion.button>
                ))}
              </div>

              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-xl p-8"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6">Create New Content</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide a detailed description"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Content</label>
                      <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                          <FiUpload className="text-2xl text-white/40" />
                        </div>
                        <p className="text-white/60 mb-2">Drag and drop your content here</p>
                        <p className="text-sm text-white/40 mb-4">or</p>
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Browse Files
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/5">
                      <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Create Content
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UpCreation 