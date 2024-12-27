import { FiImage, FiPlay } from 'react-icons/fi';

const ContentRenderer = ({ section, onMediaClick }) => {
  const renderContent = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="space-y-6">
            {/* Text Content */}
            <div
              className="text-lg text-white leading-relaxed"
            >
              {section.content}
            </div>

            {/* Media Preview */}
            {section.media && (
              <button
                onClick={onMediaClick}
                className="w-full relative group"
              >
                <div className="aspect-video rounded-xl overflow-hidden">
                  {/* Preview Image */}
                  <img 
                    src={section.media.url} 
                    alt={section.media.caption}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm">
                      <FiImage className="w-4 h-4" />
                      <span>Klik untuk memperbesar</span>
                    </div>
                  </div>
                </div>
                {section.media.caption && (
                  <p className="mt-2 text-sm text-white/40 text-center">
                    {section.media.caption}
                  </p>
                )}
              </button>
            )}
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-6">
            {/* Text Content */}
            <div
              className="text-lg text-white/80 leading-relaxed"
            >
              {section.content}
            </div>

            {/* Points List */}
            {section.points && (
              <ul
                className="space-y-3"
              >
                {section.points.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-white/70"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-lg leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Interactive Demo */}
            {section.demo && (
              <div
                className="relative aspect-video rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <FiPlay className="w-12 h-12 text-white/40" />
                    <span className="text-sm text-white/40">Demo Interaktif</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-8">
      {renderContent()}
    </div>
  );
};

export default ContentRenderer; 