import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RiLightbulbLine, RiNumber1, RiNumber2, RiNumber3, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

const ContentRenderer = ({ contents = [], currentStage }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Ensure contents is an array and has items
  if (!Array.isArray(contents) || !contents.length || !contents[0]) return null;

  // Sort contents by order
  const sortedContents = contents
    .filter(content => content)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0));

  const currentContent = sortedContents[currentContentIndex];
  const isFirstContent = currentContentIndex === 0;
  const isLastContent = currentContentIndex === sortedContents.length - 1;

  const handlePrevContent = () => {
    if (!isFirstContent) {
      setCurrentContentIndex(prev => prev - 1);
    }
  };

  const handleNextContent = () => {
    if (!isLastContent) {
      setCurrentContentIndex(prev => prev + 1);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;

    return (
      <motion.div
        key={content.order}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[60vh]"
      >
        {currentStage && (
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              {currentStage.order === 1 ? (
                <RiNumber1 className="w-5 h-5 text-blue-400" />
              ) : currentStage.order === 2 ? (
                <RiNumber2 className="w-5 h-5 text-blue-400" />
              ) : (
                <RiNumber3 className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Stage {currentStage.order}</h2>
              <p className="text-sm text-white/60">Content {content.order} of {sortedContents.length}</p>
            </div>
          </div>
        )}

        {/* Content based on type */}
        {(() => {
          if (!content.type || !content.content) return null;

          switch (content.type) {
            case 'text':
              return (
                <div className="text-lg text-white/80 leading-relaxed">
                  {content.content}
                </div>
              );

            case 'image':
              return (
                <div className="my-8">
                  <div className="relative group">
                    <img
                      src={content.content}
                      alt={content.caption || ''}
                      className="w-full rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl"
                    />
                    {content.caption && (
                      <p className="mt-3 text-center text-base text-white/60">
                        {content.caption}
                      </p>
                    )}
                  </div>
                </div>
              );

            case 'code':
              return (
                <div className="my-8">
                  <div className="rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg">
                    <SyntaxHighlighter
                      language={content.language || 'javascript'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.95rem',
                      }}
                      className="!bg-transparent"
                    >
                      {content.content}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );

            case 'exercise':
              return (
                <div className="my-8">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                        <RiLightbulbLine className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white/90">Latihan</h3>
                    </div>
                    <div className="text-white/80 leading-relaxed">
                      {content.content}
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {renderContent(currentContent)}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
        <button
          onClick={handlePrevContent}
          disabled={isFirstContent}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isFirstContent
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-white/5 active:bg-white/10'
          }`}
        >
          <RiArrowLeftLine className="w-5 h-5" />
          <span>Previous</span>
        </button>
        
        <div className="text-sm text-white/60">
          {currentContentIndex + 1} / {sortedContents.length}
        </div>
        
        <button
          onClick={handleNextContent}
          disabled={isLastContent}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLastContent
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-white/5 active:bg-white/10'
          }`}
        >
          <span>Next</span>
          <RiArrowRightLine className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ContentRenderer; 