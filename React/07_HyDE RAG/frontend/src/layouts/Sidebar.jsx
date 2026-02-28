import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Sidebar({ isOpen, onClose }) {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users Manage', href: '/users', icon: Users },
    { name: 'Forms & Inputs', href: '/forms', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col h-full shadow-xl lg:shadow-none lg:translate-x-0 border-r border-slate-800",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center h-16 px-6 bg-slate-950 border-b border-slate-800">
             <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                <span className="font-bold text-white text-lg">E</span>
             </div>
             <span className="text-xl font-bold tracking-tight">Enterprise</span>
             <button onClick={onClose} className="ml-auto lg:hidden text-slate-400 hover:text-white">
                <ChevronLeft className="w-6 h-6" />
             </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
             <div className="mb-8">
                 <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Main Menu</p>
                {navigation.map((item) => (
                    <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={({ isActive }) => cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 mb-1",
                        isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                    >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
                    {item.name}
                    </NavLink>
                ))}
            </div>
            
            <div>
                 <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
                 <a href="#" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    Server Status
                 </a>
            </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
           <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
             <LogOut className="mr-3 h-5 w-5" />
             Sign Out
           </button>
        </div>
      </div>
    </>
  );
}
