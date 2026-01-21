import React, { useState } from 'react';
import { User, Lock, Database, Globe, Sliders, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const [activeConfigTab, setActiveConfigTab] = useState('general');
  const { settings, updateSettings } = useAppContext();
  const { theme, setTheme } = useTheme();

  const configTabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'models', label: 'Models & API', icon: Database },
  ];

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="flex bg-slate-50 dark:bg-gray-950 h-full p-6 md:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Settings</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {configTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeConfigTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConfigTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            
            {activeConfigTab === 'general' && (
               <div className="space-y-6">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Appearance</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Customize how NeuralRAG looks on your device.</p>
                   <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setTheme('light')}
                        className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                     >
                       <Sun size={24} className={theme === 'light' ? "text-blue-600" : "text-gray-400"} />
                       <span className={`font-medium ${theme === 'light' ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>Light Mode</span>
                     </button>
                     <button 
                        onClick={() => setTheme('dark')}
                        className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                     >
                       <Moon size={24} className={theme === 'dark' ? "text-blue-600" : "text-gray-400"} />
                       <span className={`font-medium ${theme === 'dark' ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>Dark Mode</span>
                     </button>
                   </div>
                 </div>
                 
                 <hr className="border-gray-100" />

                 <div>
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Language</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your preferred interface language.</p>
                   <div className="relative">
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <select 
                        value={settings.language}
                        onChange={(e) => updateSettings({ language: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                     >
                       <option>English (United States)</option>
                       <option>Spanish</option>
                       <option>French</option>
                       <option>German</option>
                     </select>
                   </div>
                 </div>
               </div>
            )}

            {activeConfigTab === 'models' && (
              <div className="space-y-6">
                <div>
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">LLM Provider</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose the underlying model for your RAG system (Ollama models).</p>
                   
                   <div className="grid gap-3">
                     {['llama3.2:1b', 'llama3.2:3b', 'llama3.1:8b', 'mistral:7b'].map((modelName) => (
                       <label key={modelName} onClick={() => updateSettings({ model: modelName })} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${settings.model === modelName ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.model === modelName ? 'border-blue-600' : 'border-gray-300 dark:border-gray-500'}`}>
                             {settings.model === modelName && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                           </div>
                           <span className="text-gray-700 dark:text-gray-200 font-medium">{modelName}</span>
                         </div>
                         {settings.model === modelName && (
                            <div className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                                Selected
                            </div>
                         )}
                       </label>
                     ))}
                   </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">API Configuration</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Backend Endpoint</label>
                    <input 
                      type="text" 
                      value="http://localhost:8000" 
                      className="w-full p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-mono" 
                      readOnly
                    />
                    
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Temperature: {settings.temperature}</label>
                    <input 
                      type="range" 
                      min="0" max="1" step="0.1"
                      value={settings.temperature}
                      onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Precise (0)</span>
                      <span>Creative (1)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeConfigTab === 'account' || activeConfigTab === 'security') && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-gray-400 dark:text-gray-500" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Restricted Access</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">These settings are managed by your organization administrator.</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <span className="text-xs text-gray-400 italic flex items-center">
                Settings are saved automatically
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
