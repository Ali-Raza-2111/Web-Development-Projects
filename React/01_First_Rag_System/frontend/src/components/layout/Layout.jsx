import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Search, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans text-gray-900 dark:text-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white/50 dark:bg-gray-900/50 relative">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm sticky top-0 z-30">
           <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
             
             <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400 breadcrumbs">
                <span className="font-medium text-gray-800 dark:text-gray-200">Workspace</span>
                <span className="mx-2">/</span>
                <span className="capitalize">{activeTab.replace('-', ' ')}</span>
             </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 dark:text-gray-200 transition-all"
               />
             </div>
             <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
             </button>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative scroll-smooth">
           <motion.div 
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
             className="h-full"
           >
              {children(activeTab)}
           </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
