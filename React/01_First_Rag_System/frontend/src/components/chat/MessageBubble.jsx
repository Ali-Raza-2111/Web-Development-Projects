import React, { useState } from 'react';
import { User, Copy, ThumbsUp, ThumbsDown, Sparkles, FileText, Bot, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import SourceViewer from '../sources/SourceViewer';
import apiService from '../../lib/api';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [selectedSource, setSelectedSource] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [docError, setDocError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleSourceClick = async (source) => {
    setSelectedSource(source);
    setIsLoadingDoc(true);
    setDocError(null);
    setDocumentData(null);
    
    try {
      const data = await apiService.viewDocument(source.filename, source.highlight_text || source.excerpt);
      setDocumentData(data);
    } catch (err) {
      console.error('Failed to load document:', err);
      setDocError(err.message || 'Failed to load document');
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleCloseViewer = () => {
    setSelectedSource(null);
    setDocumentData(null);
    setDocError(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Check if sources is the new detailed format or old string array
  const hasDetailedSources = message.sources && message.sources.length > 0 && typeof message.sources[0] === 'object';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex max-w-[90%] md:max-w-[75%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1",
          isUser 
            ? "bg-gradient-to-tr from-blue-600 to-blue-500 text-white" 
            : "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Container */}
        <div className="flex flex-col min-w-0">
           
           {/* Bubble */}
           <div className={cn(
             "relative px-5 py-3.5 shadow-sm text-sm md:text-[15px] leading-relaxed",
             isUser 
               ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[20px] rounded-tr-md" 
               : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/50 rounded-[20px] rounded-tl-md"
           )}>
             <div className={cn("whitespace-pre-wrap markdown-body", isUser ? "text-white/95" : "dark:text-gray-100")}>
               {message.content}
             </div>
           </div>

           {/* Metadata & Actions Area */}
           <div className={cn(
             "flex items-center gap-2 mt-1.5 px-1",
             isUser ? "justify-end" : "justify-start"
           )}>
             <span className="text-[10px] text-gray-400 font-medium opacity-70">
               {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </span>
             
             {!isUser && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handleCopy}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded transition-colors" 
                      title="Copy"
                    >
                      {copiedId === message.id ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    <button className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-0.5 rounded transition-colors" title="Helpful">
                      <ThumbsUp size={12} />
                    </button>
                  </div>
                </>
             )}
           </div>

           {/* Detailed Source Citations (new format with full metadata) */}
           {!isUser && hasDetailedSources && (
             <motion.div 
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="mt-3 space-y-2"
             >
               <div className="flex items-center gap-1.5 px-1">
                 <CheckCircle size={12} className="text-emerald-500" />
                 <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                   Verified Sources ({message.sources.length})
                 </span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {message.sources.map((source, idx) => (
                   <button
                     key={source.id || idx}
                     onClick={() => handleSourceClick(source)}
                     className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-100 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200"
                   >
                     <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                       <FileText size={12} className="text-white" />
                     </div>
                     <div className="flex flex-col items-start min-w-0">
                       <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                         {source.filename}
                       </span>
                       <span className="text-[10px] text-gray-500 dark:text-gray-400">
                         {source.page ? `Page ${source.page}` : 'View source'}
                         {source.relevance_score && ` • ${Math.round(source.relevance_score * 100)}% match`}
                       </span>
                     </div>
                     <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors ml-1" />
                   </button>
                 ))}
               </div>
             </motion.div>
           )}

           {/* Legacy Source Citations (old string array format) */}
           {!isUser && message.sources && message.sources.length > 0 && !hasDetailedSources && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="mt-2 flex flex-wrap gap-2"
             >
               {message.sources.map((source, idx) => (
                 <div key={idx} className="flex items-center px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-sm transition-all cursor-pointer group">
                   <FileText size={12} className="text-blue-500 mr-1.5" />
                   <span className="text-xs font-medium text-gray-600 dark:text-gray-300 max-w-[150px] truncate">{source}</span>
                 </div>
               ))}
             </motion.div>
           )}
        </div>
      </div>

      {/* Source Viewer Modal */}
      <SourceViewer
        isOpen={selectedSource !== null}
        onClose={handleCloseViewer}
        source={selectedSource}
        documentData={documentData}
        isLoading={isLoadingDoc}
        error={docError}
      />
    </motion.div>
  );
};

export default MessageBubble;
