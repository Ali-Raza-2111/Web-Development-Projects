import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import Button from '../components/common/Button';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 shadow-sm">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-md">
            <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex-1 flex items-center">
            <div className="relative max-w-md w-full hidden md:block">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
               </div>
               <input 
                 type="text" 
                 className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out" 
                 placeholder="Search global..." 
               />
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-full text-slate-500 hover:text-slate-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-500">admin@company.com</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm cursor-pointer hover:bg-slate-200 transition-colors">
                    <User className="w-5 h-5" />
                </div>
            </div>
        </div>
    </header>
  );
}
