import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, ChevronLeft, ChevronRight, Search, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * SourceViewer Component
 * 
 * Displays document content with highlighted text passages that were used
 * to generate the AI response. Allows users to verify the authenticity of answers.
 */
const SourceViewer = ({ isOpen, onClose, source, documentData, isLoading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const highlightRef = useRef(null);

  // Auto-scroll to highlighted section when data loads
  useEffect(() => {
    if (documentData && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [documentData, currentPage]);

  // Find the page with highlight for PDFs
  useEffect(() => {
    if (documentData?.type === 'pdf' && documentData?.pages) {
      const highlightPage = documentData.pages.find(p => p.has_highlight);
      if (highlightPage) {
        setCurrentPage(highlightPage.page);
      }
    }
  }, [documentData]);

  if (!isOpen) return null;

  const renderHighlightedText = (text, highlightText, start, end) => {
    if (!highlightText || start === -1) {
      return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
    }

    const before = text.substring(0, start);
    const highlighted = text.substring(start, Math.min(end, text.length));
    const after = text.substring(Math.min(end, text.length));

    return (
      <p className="whitespace-pre-wrap leading-relaxed">
        {before}
        <mark 
          ref={highlightRef}
          className="bg-yellow-200 dark:bg-yellow-500/40 px-0.5 rounded text-gray-900 dark:text-white font-medium"
        >
          {highlighted}
        </mark>
        {after}
      </p>
    );
  };

  const renderPDFContent = () => {
    if (!documentData?.pages) return null;
    
    const page = documentData.pages[currentPage - 1];
    if (!page) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Page Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Page {currentPage} of {documentData.total_pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(documentData.total_pages, p + 1))}
            disabled={currentPage === documentData.total_pages}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 dark:text-gray-200">
          {page.has_highlight ? (
            renderHighlightedText(page.text, documentData.highlight_text, page.highlight_start, page.highlight_end)
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{page.text}</p>
          )}
        </div>

        {/* Highlight indicator */}
        {page.has_highlight && (
          <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
            <CheckCircle size={14} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
              Source text highlighted on this page
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderTextContent = () => {
    if (!documentData?.content) return null;

    return (
      <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 dark:text-gray-200">
        {renderHighlightedText(
          documentData.content,
          documentData.highlight_text,
          documentData.highlight_start,
          documentData.highlight_end
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                  Source Verification
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">
                  {source?.filename || 'Document'}
                  {source?.page && ` • Page ${source.page}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {source?.relevance_score && (
                <div className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  {Math.round(source.relevance_score * 100)}% Relevant
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Source Excerpt Card */}
          {source?.excerpt && (
            <div className="mx-6 mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2 mb-2">
                <Search size={14} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                  Retrieved Passage
                </span>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-100 leading-relaxed line-clamp-3">
                "{source.excerpt}"
              </p>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 mt-4">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-blue-500 animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading document...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-red-500 dark:text-red-400 font-medium mb-2">Failed to load document</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
                </div>
              </div>
            ) : documentData?.type === 'pdf' ? (
              renderPDFContent()
            ) : (
              renderTextContent()
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Highlighted sections show where the AI found this information
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SourceViewer;
