import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../utils/cn';

const FileUpload = ({ onUpload, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onUpload(Array.from(e.dataTransfer.files));
      }
    },
    [onUpload, isUploading]
  );

  const handleFileChange = (e) => {
    if (!isUploading && e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer',
        isDragOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800',
        isUploading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        type="file"
        multiple
        accept=".pdf,.txt"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={cn("cursor-pointer flex flex-col items-center", isUploading && "cursor-not-allowed")}
      >
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mb-3 text-blue-600 dark:text-blue-400">
          <UploadCloud size={32} />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          PDF, TXT, DOCX files allowed (Max 10MB)
        </p>
      </label>
    </div>
  );
};

export default FileUpload;
