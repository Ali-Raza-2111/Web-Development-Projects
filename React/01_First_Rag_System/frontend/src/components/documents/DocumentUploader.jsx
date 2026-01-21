import React, { useState } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle, FileText, Image, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const DocumentUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const { files, uploadFile, removeFile, isConnected } = useAppContext();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (newFiles) => {
    const fileArray = Array.from(newFiles);
    
    // Upload files using the context's uploadFile function
    for (const file of fileArray) {
      try {
        await uploadFile(file);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  const getFileIcon = (type) => {
      if (['JPG', 'PNG', 'JPEG'].includes(type)) return <Image size={24} className="text-purple-500" />;
      if (['PDF'].includes(type)) return <FileText size={24} className="text-red-500" />;
      return <File size={24} className="text-blue-500" />;
  };

  return (
    <div className="w-full h-full p-8 md:p-12 overflow-y-auto bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Knowledge Base</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">Upload documents to train your RAG agent. Supports PDF, DOCX, TXT, and Markdown.</p>
          {!isConnected && (
            <p className="text-amber-600 dark:text-amber-400 mt-2 text-sm">⚠️ Backend not connected. Files will not be uploaded.</p>
          )}
        </div>

        {/* Drag & Drop Area */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
            dragActive 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/10' 
              : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input 
            id="file-upload"
            type="file" 
            multiple 
            onChange={handleChange} 
            className="hidden" 
          />
          
          <div className="flex flex-col items-center pointer-events-none p-4 text-center z-10">
            <div className={cn(
                "p-4 rounded-full mb-4 transition-colors",
                dragActive ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-300"
            )}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {dragActive ? "Drop files here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Max file size 50MB</p>
          </div>

          <div className="absolute inset-0 bg-grid-slate-100/[0.2] dark:bg-grid-slate-800/[0.1] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
        </motion.div>

        {/* File List */}
        <div className="mt-12">
           <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Recent Uploads</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">{files.length} Files</span>
           </h3>
           
           <AnimatePresence>
             <div className="space-y-3">
               {files.length === 0 && (
                   <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8 italic">No files pending upload.</p>
               )}
               {files.map((fileObj) => (
                 <motion.div 
                   key={fileObj.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, height: 0 }}
                   className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                 >
                   <div className="flex items-center space-x-4">
                     <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                       {getFileIcon(fileObj.type)}
                     </div>
                     <div>
                       <p className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px] md:max-w-md">{fileObj.file.name}</p>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{fileObj.type}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{(fileObj.file.size / 1024).toFixed(1)} KB</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center space-x-4">
                     {fileObj.status === 'pending' && <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">Waiting...</span>}
                     {fileObj.status === 'uploading' && (
                         <div className="flex items-center gap-2">
                             <Loader2 size={16} className="animate-spin text-blue-500" />
                             <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Uploading...</span>
                         </div>
                     )}
                     {fileObj.status === 'success' && (
                       <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                         <CheckCircle size={14} className="mr-1.5" />
                         <span className="text-xs font-bold">Indexed</span>
                       </div>
                     )}
                     
                     <button 
                       onClick={() => removeFile(fileObj.id)}
                       className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                 </motion.div>
               ))}
             </div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
