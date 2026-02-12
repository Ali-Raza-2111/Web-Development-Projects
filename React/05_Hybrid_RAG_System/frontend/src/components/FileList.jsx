import React from 'react';
import { FileText, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const FileList = ({ files, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        No files uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex-shrink-0">
               <FileText size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pl-2">
            {file.status === 'uploading' && (
               <Loader2 size={18} className="text-blue-500 animate-spin" />
            )}
            {file.status === 'success' && (
               <CheckCircle size={18} className="text-green-500" />
            )}
             {file.status === 'error' && (
               <AlertCircle size={18} className="text-red-500" />
            )}
            
            <button
              onClick={() => onDelete(file.name)}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Delete file"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
