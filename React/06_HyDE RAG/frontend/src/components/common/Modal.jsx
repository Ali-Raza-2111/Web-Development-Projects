import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
    
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
    }
    return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full m-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4 md:inset-0 h-modal md:h-full animated fadeIn">
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={onClose} 
      ></div>
      
      <div className={cn("relative w-full h-full max-h-screen md:h-auto z-10 my-auto", sizeClasses[size])}>
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-2xl ring-1 ring-slate-900/5 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 rounded-t">
            <h3 className="text-lg font-semibold text-slate-900 leading-6">
              {title}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {children}
          </div>
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end p-4 space-x-2 border-t border-slate-100 rounded-b bg-slate-50/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
