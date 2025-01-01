import React from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const TheoryContent = ({ content }) => {
  // Function to convert content string to HTML with proper image rendering
  const renderContent = (contentStr) => {
    // First, convert newlines to proper HTML paragraphs
    let processedContent = contentStr
      .split('\n')
      .map(line => {
        // Skip if line is already an HTML element
        if (line.trim().startsWith('<')) {
          // Fix img tags that might be inline with text
          return line.replace(/<img([^>]*)>/g, '\n<img$1>\n');
        }
        
        // Handle numbered lists
        if (line.trim().match(/^\d+\./)) {
          return `<li class="ml-4">${line}</li>`;
        }
        
        // Handle bullet points
        if (line.trim().startsWith('- ')) {
          return `<li class="ml-4">${line.substring(2)}</li>`;
        }
        
        // Regular paragraph
        return line.trim() ? `<p class="mb-4">${line}</p>` : '';
      })
      .join('\n');

    // Wrap lists in ul/ol tags
    processedContent = processedContent
      .replace(/<li[^>]*>(\d+\.)/g, '<ol class="list-decimal"><li>')
      .replace(/<li[^>]*>([^0-9])/g, '<ul class="list-disc"><li>$1');

    // Close list tags
    processedContent = processedContent
      .replace(/(<\/li>)(?![^<]*<li)/g, '$1</ul>')
      .replace(/(<\/li>)(?=[^<]*<ol)/g, '$1</ol>');

    // Sanitize HTML
    const cleanHtml = DOMPurify.sanitize(processedContent, {
      ADD_TAGS: ['img', 'ul', 'ol', 'li'],
      ADD_ATTR: ['src', 'alt', 'class', 'loading']
    });

    // Parse HTML and transform elements
    const parsedContent = parse(cleanHtml, {
      replace: domNode => {
        if (domNode.type === 'tag' && domNode.name === 'img') {
          // Transform img tags
          return (
            <div className="my-6">
              <img
                src={domNode.attribs.src}
                alt={domNode.attribs.alt}
                className="rounded-lg w-full max-w-3xl mx-auto shadow-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error('Failed to load image:', domNode.attribs.src);
                }}
              />
              {domNode.attribs.alt && (
                <p className="text-center text-sm text-white/60 mt-2">
                  {domNode.attribs.alt}
                </p>
              )}
            </div>
          );
        }
        // Return other elements unchanged
        return undefined;
      }
    });

    return parsedContent;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent(content)}
    </div>
  );
};

export default TheoryContent; 