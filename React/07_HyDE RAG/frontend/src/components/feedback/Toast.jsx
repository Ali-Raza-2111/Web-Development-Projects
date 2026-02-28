import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
};

const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-orange-500'
}

export default function Toast({ type = 'info', title, message, onClose, duration = 5000 }) {
  const Icon = icons[type];
  
  useEffect(() => {
     if (duration) {
         const timer = setTimeout(onClose, duration);
         return () => clearTimeout(timer);
     }
  }, [duration, onClose]);

  return (
    <div className={cn(
      "flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 pointer-events-auto transition-all transform animate-slide-in hover:shadow-xl", 
      "border-l-4",
      type === 'success' && "border-green-500",
      type === 'error' && "border-red-500",
      type === 'warning' && "border-orange-500",
      type === 'info' && "border-blue-500",
    )}>
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn("w-5 h-5", iconColors[type])} />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-slate-400 bg-white rounded-md hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 p-1"
          >
            <span className="sr-only">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
