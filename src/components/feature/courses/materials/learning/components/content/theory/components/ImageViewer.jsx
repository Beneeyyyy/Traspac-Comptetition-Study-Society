import { FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { useState } from 'react';

const ImageViewer = ({ url, caption, onClose }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Content Conxtainer - Prevent click propagation */}
      <div 
        className="relative max-w-7xl mx-auto p-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05]">
          <img
            src={url}
            alt={caption}
            className="w-full h-full object-contain transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})` }}
            draggable="false"
          />
        </div>

        {/* Caption */}
        {caption && (
          <p className="mt-4 text-center text-white/60">
            {caption}
          </p>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 text-white/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-white/60">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="p-2 text-white/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 