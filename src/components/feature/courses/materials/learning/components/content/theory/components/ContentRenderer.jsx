import React from 'react';
import { motion } from 'framer-motion';

export function ContentRenderer({ section }) {
  if (!section) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Text Content */}
      <div className="text-xl text-white/80 leading-relaxed whitespace-pre-line max-w-4xl mx-auto">
        {section.content}
      </div>
      
      {/* Points List if exists */}
      {section.points && (
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-6">
            {section.points.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-4 text-white/70 hover:text-white/90 transition-colors group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-sm text-blue-400 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                  {index + 1}
                </span>
                <span className="text-lg leading-relaxed pt-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Media Csontent */}
      {section.media && (
        <div className="mt-12 max-w-5xl mx-auto">
          {section.media.type === 'image' && (
            <img 
              src={section.media.url} 
              alt={section.media.caption} 
              className="rounded-2xl w-full shadow-lg hover:shadow-xl transition-shadow"
            />
          )}
          {section.media.type === 'video' && (
            <video 
              src={section.media.url}
              controls
              className="rounded-2xl w-full shadow-lg"
            />
          )}
          {section.media.caption && (
            <p className="mt-4 text-base text-white/60 text-center">
              {section.media.caption}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Re-export for backward compatibility
export default ContentRenderer; 