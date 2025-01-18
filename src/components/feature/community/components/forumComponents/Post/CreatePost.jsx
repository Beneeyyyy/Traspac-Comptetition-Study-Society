import { useState, useRef } from 'react'
import { FiImage, FiX, FiMessageSquare, FiLink, FiHash, FiLoader, FiMaximize2, FiMinimize2 } from 'react-icons/fi'
import { useForum } from '../../../../../../contexts/forum/ForumContext'
import { useAuth } from '../../../../../../contexts/AuthContext'

const CreatePost = () => {
  const { addQuestion } = useForum()
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState([{ type: 'text', content: '', id: 'initial' }])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 15 * 1024 * 1024; // 15MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Validasi file
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF');
        return;
      }
      if (file.size > maxSize) {
        setError('Ukuran gambar terlalu besar (maksimal 15MB)');
        return;
      }
    }

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64String = reader.result;
              resolve({
                type: 'image',
                content: base64String,
                isFullWidth: true,
                id: Date.now() + Math.random().toString(36).substring(7)
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setBlocks(prev => {
        // Add a new text block after each image
        const newBlocks = [];
        newImages.forEach(image => {
          newBlocks.push(image);
          newBlocks.push({
            type: 'text',
            content: '',
            id: Date.now() + Math.random().toString(36).substring(7)
          });
        });
        return [...prev, ...newBlocks];
      });
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Gagal memproses gambar. Silakan coba lagi.');
    }
  };

  const handleBlockChange = (id, content) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const toggleImageWidth = (id) => {
    setBlocks(prev => prev.map(block =>
      block.id === id && block.type === 'image'
        ? { ...block, isFullWidth: !block.isFullWidth }
        : block
    ));
  };

  const addTextBlock = (afterId) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === afterId);
      const newBlock = {
        type: 'text',
        content: '',
        id: Date.now() + Math.random().toString(36).substring(7)
      };
      return [
        ...prev.slice(0, index + 1),
        newBlock,
        ...prev.slice(index + 1)
      ];
    });
  };

  const removeBlock = (id) => {
    setBlocks(prev => {
      const filtered = prev.filter(block => block.id !== id);
      // Ensure there's always at least one text block
      if (filtered.length === 0) {
        return [{ type: 'text', content: '', id: 'initial' }];
      }
      return filtered;
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || blocks.every(b => b.type === 'text' && !b.content.trim()) || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Send blocks directly to maintain order
      const formattedBlocks = blocks.map(block => ({
        type: block.type,
        content: block.content,
        isFullWidth: block.type === 'image' ? block.isFullWidth : undefined
      }));

      const response = await addQuestion(
        title.trim(),
        formattedBlocks,
        tags.length > 0 ? tags : ['general']
      );

      // Reset form
      setTitle('');
      setBlocks([{ type: 'text', content: '', id: 'initial' }]);
      setTags([]);
      setTagInput('');
      setIsExpanded(false);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Gagal membuat post. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden w-full max-w-[1200px] mx-auto">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Anonymous')}&background=0D8ABC&color=fff`}
              alt={user?.name || 'Anonymous'}
              className="w-10 h-10 rounded-lg ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300 object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            {/* Title Input */}
            {isExpanded && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul pertanyaan..."
                className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
              />
            )}

            {/* Content Blocks */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  {block.type === 'text' ? (
                    <textarea
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                      placeholder={index === 0 ? "Ada pertanyaan? Yuk diskusikan bersama..." : "Lanjutkan menulis..."}
                      rows={Math.max(2, block.content.split('\n').length)}
                      onClick={() => setIsExpanded(true)}
                      className="w-full px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                    />
                  ) : block.type === 'image' && (
                    <div className={`relative ${block.isFullWidth ? 'w-full' : 'w-1/2 float-left mr-4 mb-4'}`}>
                      <img
                        src={block.content}
                        alt="Content"
                        className="w-full rounded-xl border border-white/10"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleImageWidth(block.id)}
                          className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
                          title={block.isFullWidth ? "Set to half width" : "Set to full width"}
                        >
                          {block.isFullWidth ? <FiMinimize2 /> : <FiMaximize2 />}
                        </button>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
                      setBlocks([{ type: 'text', content: '', id: 'initial' }])
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
                    disabled={!title.trim() || blocks.every(b => b.type === 'text' && !b.content.trim()) || isSubmitting}
                    className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2
                      ${title.trim() && blocks.every(b => b.type === 'text' && b.content.trim()) && !isSubmitting
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