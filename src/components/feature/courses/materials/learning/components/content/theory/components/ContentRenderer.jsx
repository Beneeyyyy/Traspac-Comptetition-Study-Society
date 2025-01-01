import React from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RiLightbulbLine, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import DOMPurify from 'dompurify';

const ContentRenderer = ({ contents = [], currentStage, onNextStage, currentContentIndex, onContentChange }) => {
  if (!Array.isArray(contents) || !contents.length || !contents[0]) return null;

  const sortedContents = contents
    .filter(content => content)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0));

  const currentContent = sortedContents[currentContentIndex];
  const isFirstContent = currentContentIndex === 0;
  const isLastContent = currentContentIndex === sortedContents.length - 1;

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
      __html: DOMPurify.sanitize(content)
    };
  };

  const renderContent = (content) => {
    if (!content) return null;

    return (
      <motion.div
        key={content.order}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative min-h-[calc(100vh-400px)] pb-32"
      >
        <div className="space-y-8">
          {(() => {
            if (!content.type || !content.content) return null;

            switch (content.type) {
              case 'text':
                return (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-invert max-w-none text-lg text-white/80 leading-relaxed"
                    dangerouslySetInnerHTML={createMarkup(content.content)}
                  />
                );

              case 'image':
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="my-12"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      <div className="relative">
                        <img
                          src={content.content}
                          alt={content.caption || ''}
                          className="w-full rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl"
                          loading="lazy"
                        />
                        {content.caption && (
                          <p className="mt-4 text-center text-base text-white/60">
                            {content.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );

              case 'code':
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="my-12"
                  >
                    <div className="rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg ring-1 ring-white/10 hover:ring-white/20 transition-colors">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                          <div className="w-3 h-3 rounded-full bg-green-500/20" />
                          <span className="ml-2 text-sm text-white/40">{content.language || 'javascript'}</span>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        language={content.language || 'javascript'}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: 'transparent',
                          fontSize: '0.95rem',
                          maxHeight: '500px',
                          overflowY: 'auto'
                        }}
                        className="!bg-transparent custom-scrollbar"
                      >
                        {content.content}
                      </SyntaxHighlighter>
                    </div>
                  </motion.div>
                );

              case 'exercise':
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="my-12"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      <div className="relative p-8 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <RiLightbulbLine className="w-5 h-5 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Latihan
                          </h3>
                        </div>
                        <div className="text-white/80 leading-relaxed">
                          {content.content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );

              default:
                return null;
            }
          })()}
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