import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RiLightbulbLine } from 'react-icons/ri';
import DOMPurify from 'dompurify';

const ContentRenderer = ({ 
  contents = [], 
  currentStage, 
  onNextStage, 
  currentContentIndex, 
  onContentChange,
  savedContentIndex,
  onProgressUpdate 
}) => {
  if (!Array.isArray(contents) || !contents.length || !contents[0]) return null;

  // Update progress when content changes
  useEffect(() => {
    if (onProgressUpdate) {
      const progress = ((currentContentIndex + 1) / contents.length) * 100;
      onProgressUpdate(progress);
    }
  }, [currentContentIndex, contents.length]);

  const currentContent = contents[currentContentIndex];
  const isFirstContent = currentContentIndex === 0;
  const isLastContent = currentContentIndex === contents.length - 1;

  const handlePrevContent = () => {
    if (!isFirstContent) {
      onContentChange(currentContentIndex - 1);
    }
  };

  const handleNextContent = () => {
    if (!isLastContent) {
      onContentChange(currentContentIndex + 1);
    } else if (onNextStage) {
      onNextStage();
    }
  };

  const createMarkup = (content) => {
    return {
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      })
    };
  };

  const renderContent = (content) => {
    if (!content) return null;

    return (
      <motion.div
        key={content.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative min-h-[calc(100vh-400px)] pb-32"
      >
        <div className="space-y-8">
          {/* Main Text Content */}
          {content.text && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert max-w-none text-lg text-white/80 leading-relaxed whitespace-pre-wrap"
            >
              {content.text}
            </motion.div>
          )}

          {/* Media Content */}
          {content.media && content.media.map((media, index) => {
            if (media.type === 'text') {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="prose prose-invert max-w-none text-lg text-white/80 leading-relaxed whitespace-pre-wrap"
                >
                  {media.content}
                </motion.div>
              );
            }

            if (media.type === 'image') {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="my-12"
                >
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    <div className="relative">
                      <img
                        src={media.url}
                        alt={media.caption || ''}
                        className="w-full rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl"
                        loading="lazy"
                      />
                      {media.caption && (
                        <p className="mt-4 text-center text-base text-white/60">
                          {media.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (media.type === 'video') {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="my-12"
                >
                  <div className="relative aspect-video">
                    <iframe
                      src={media.url}
                      className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-xl bg-black/50 backdrop-blur-sm z-50">
          <button
            onClick={handlePrevContent}
            disabled={isFirstContent}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isFirstContent
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/10 active:bg-white/20'
            }`}
          >
            Previous
          </button>
          <div className="text-sm text-white/60">
            {currentContentIndex + 1} / {contents.length}
          </div>
          <button
            onClick={handleNextContent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all duration-200"
          >
            {isLastContent ? 'Next Stage' : 'Next'}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Content Area */}
      <div>
        {renderContent(currentContent)}
      </div>
    </div>
  );
};

export default ContentRenderer; 