import React from 'react';
import { MessageSquare, FileText, Settings, Database, BrainCircuit, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  
  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, description: 'Interact with your knowledge base' },
    { id: 'documents', label: 'Knowledge Base', icon: FileText, description: 'Manage uploaded files' },
    { id: 'settings', label: 'Configuration', icon: Settings, description: 'System parameters' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 text-gray-100 flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out font-sans shadow-2xl md:shadow-none",
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:static'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800/60 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">NeuralRAG</h1>
              <p className="text-xs text-gray-400 font-medium">Enterprise AI Search</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 mt-2">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-blue-600/10 text-white shadow-sm ring-1 ring-blue-500/20" 
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-100"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                
                <Icon size={20} className={cn("transition-colors", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />
                
                <div className="flex-1 text-left">
                  <span className={cn("block text-sm font-medium", isActive ? "text-white" : "text-gray-300")}>
                    {item.label}
                  </span>
                </div>

                {isActive && <ChevronRight size={16} className="text-blue-500" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 bg-gray-900 border-t border-gray-800/60">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
              AB
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">Ali Baryar</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <LogOut size={16} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
