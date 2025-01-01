import React from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RiLightbulbLine, RiNumber1, RiNumber2, RiNumber3 } from 'react-icons/ri';

const ContentRenderer = ({ contents = [], currentStage }) => {
  // Ensure contents is an array and has items
  if (!Array.isArray(contents) || !contents.length || !contents[0]) return null;

  const renderContent = (content, index) => {
    if (!content) return null;

    // Show stage and order info only for the first content
    const showStageInfo = index === 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {showStageInfo && currentStage && (
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
              <p className="text-sm text-white/60">Order {content.order}</p>
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
      {contents
        .filter(content => content) // Filter out null/undefined contents
        .sort((a, b) => (a?.order || 0) - (b?.order || 0))
        .map((content, index) => (
          <div key={index}>
            {renderContent(content, index)}
          </div>
        ))}
    </div>
  );
};

export default ContentRenderer; 