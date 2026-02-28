import React, { useState } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import ChatWindow from './components/ChatWindow';
import ExecutionObservability from './components/ExecutionObservability';
import { uploadFiles, chatWithBot, deleteFile } from './services/api';
import { Menu, X, Bot, FileText, Settings as MdSettings, Moon, Sun, Activity } from 'lucide-react';
import { cn } from './utils/cn';

const RagInterface = () => {
  const { addToast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Observability State
  const [observabilityOpen, setObservabilityOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState('pending'); // 'active', 'complete', 'error'
  const [stepMetadata, setStepMetadata] = useState({});
  const [lastTrace, setLastTrace] = useState(null); // Store last real trace for replay

  // Optional Bonus
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle File Upload
  const handleUpload = async (files) => {
    setIsUploading(true);
    // Optimistic update
    const newFiles = files.map(f => ({
      name: f.name,
      size: f.size,
      status: 'uploading'
    }));
    
    // Check for duplicates
    const uniqueNewFiles = newFiles.filter(nf => 
      !uploadedFiles.some(of => of.name === nf.name)
    );

    if (uniqueNewFiles.length === 0) {
      addToast({
         type: 'warning',
         title: 'Duplicate Files',
         message: 'All selected files have already been uploaded.',
      });
      setIsUploading(false);
      return;
    }

    setUploadedFiles(prev => [...prev, ...uniqueNewFiles]);

    try {
      // In a real scenario, we might upload files one by one or batch
      // Here we assume the API handles the list
      await uploadFiles(files);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          uniqueNewFiles.some(nf => nf.name === f.name) 
            ? { ...f, status: 'success' } 
            : f
        )
      );
      
      addToast({
        type: 'success',
        title: 'Upload Complete',
        message: `${uniqueNewFiles.length} file(s) uploaded successfully.`,
      });
      
    } catch (error) {
      console.error(error);
      setUploadedFiles(prev => 
        prev.map(f => 
          uniqueNewFiles.some(nf => nf.name === f.name) 
            ? { ...f, status: 'error' } 
            : f
        )
      );
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload files. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete File
  const handleDeleteFile = async (fileName) => {
    // Optimistic UI update
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    try {
      await deleteFile(fileName);
      addToast({
        type: 'info',
        title: 'File Removed',
        message: `${fileName} has been removed.`,
      });
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: `Failed to delete ${fileName} from the server.`,
      });
    }
  };

  // Animate trace steps sequentially in the observability panel
  const animateTrace = (traceSteps) => {
    setCurrentStep(1);
    setStepStatus('active');
    setStepMetadata({});

    // Step 1 is immediate (query received)
    const step1 = traceSteps.find(t => t.step === 1);
    if (step1) {
      setStepMetadata(prev => ({ ...prev, 1: { ...step1.metadata, timestamp: new Date().toLocaleTimeString() } }));
    }

    // Animate remaining steps with increasing delays
    const remaining = traceSteps.filter(t => t.step > 1).sort((a, b) => a.step - b.step);
    remaining.forEach((traceStep, index) => {
      setTimeout(() => {
        setCurrentStep(traceStep.step);
        setStepMetadata(prev => ({ ...prev, [traceStep.step]: traceStep.metadata || {} }));
        if (traceStep.step === 8 || index === remaining.length - 1) {
          setStepStatus('complete');
        }
      }, (index + 1) * 400); // 400ms between each step animation
    });
  };

  // Fallback simulation when no real trace is available (e.g., disconnected)
  const simulateFallback = (text) => {
    setCurrentStep(1);
    setStepStatus('active');
    setStepMetadata({});
    setStepMetadata(prev => ({ ...prev, 1: { query: text, timestamp: new Date().toLocaleTimeString() } }));

    const steps = [2, 3, 4, 5, 6, 7, 8];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(step);
        setStepMetadata(prev => ({ ...prev, [step]: { status: "simulated" } }));
        if (step === 8) setStepStatus('complete');
      }, (i + 1) * 800);
    });
  };

  // Handle Chat
  const handleSendMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    
    setIsChatLoading(true);
    setObservabilityOpen(true);

    // Start with step 1 immediately while backend processes
    setCurrentStep(1);
    setStepStatus('active');
    setStepMetadata({ 1: { query: text, timestamp: new Date().toLocaleTimeString() } });

    try {
      const response = await chatWithBot(text);
      const botMessage = { role: 'assistant', content: response.answer, sources: response.sources || [] };
      setMessages(prev => [...prev, botMessage]);

      // Use real trace data from backend
      if (response.trace && response.trace.length > 0) {
        setLastTrace(response.trace);
        animateTrace(response.trace);
      } else {
        // No trace from backend – mark complete
        setCurrentStep(8);
        setStepStatus('complete');
      }
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to get a response from the AI.',
      });
      
      setStepStatus('error');
    } finally {
      setIsChatLoading(false);
    }
  };
  
  const handleClearChat = () => {
      setMessages([]);
      addToast({ type: 'info', title: 'Chat Cleared', message: 'Chat history has been cleared.' });
      setCurrentStep(0);
      setStepMetadata({});
      setLastTrace(null);
  }

  const handleReplay = () => {
      if (lastTrace && lastTrace.length > 0) {
          animateTrace(lastTrace);
      } else if (messages.length > 0) {
          const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
          if (lastUserMsg) simulateFallback(lastUserMsg.content);
      }
  };

  return (
    <div className={cn("flex h-screen bg-gray-100 dark:bg-black font-sans overflow-hidden transition-colors duration-200")}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
            <Bot className="text-blue-600 dark:text-blue-400" />
            <div>
                 <span className="font-bold text-gray-800 dark:text-white block leading-none">HyDE RAG</span>
                 <span className="text-[10px] text-gray-500 font-medium">Hypothetical Document Embedding</span>
            </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Left Sidebar (Files) */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
          <Bot className="text-blue-600 dark:text-blue-400 mr-2" />
          <div>
               <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-none">HyDE RAG</h1>
               <span className="text-[10px] text-gray-500 font-medium tracking-wide">Hypothetical Document Embedding</span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Knowledge Base
            </h2>
            <FileUpload onUpload={handleUpload} isUploading={isUploading} />
          </div>

          <div>
             <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uploaded Files
                </h2>
                <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {uploadedFiles.length}
                </span>
             </div>
            <FileList files={uploadedFiles} onDelete={handleDeleteFile} />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <button title="Settings" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <MdSettings size={20} />
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)} 
                  title="Toggle Dark Mode" 
                  className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-blue-400"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area (Chat + Observability) */}
      <div className="flex-1 flex h-full pt-16 lg:pt-0 overflow-hidden relative">
          
          {/* Middle Panel (Chat) */}
          <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-black transition-all duration-300">
             {/* Toolbar */}
             <div className="hidden lg:flex items-center justify-between h-16 px-6 bg-white dark:bg-black border-b border-gray-200 dark:border-slate-800">
                 <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                     <FileText size={18} />
                     <span className="text-sm">Context aware chat enabled</span>
                 </div>
                 <div className="flex items-center space-x-2">
                     {!observabilityOpen && (
                         <button 
                             onClick={() => setObservabilityOpen(true)}
                             className="flex items-center space-x-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 px-3 py-1 rounded-md transition-colors"
                         >
                             <Activity size={16} />
                             <span>Show Trace</span>
                         </button>
                     )}
                     <button 
                        onClick={handleClearChat}
                        className="text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-md transition-colors"
                     >
                         Clear History
                     </button>
                 </div>
             </div>

             <div className="flex-1 overflow-hidden relative w-full">
                <ChatWindow 
                    messages={messages} 
                    isLoading={isChatLoading} 
                    onSendMessage={handleSendMessage} 
                />
             </div>
          </div>

          {/* Right Panel (Observability) */}
          <ExecutionObservability 
              isOpen={observabilityOpen}
              onClose={() => setObservabilityOpen(false)}
              currentStep={currentStep}
              stepStatus={stepStatus}
              stepMetadata={stepMetadata}
              onReplay={handleReplay}
          />

      </div>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <RagInterface />
    </ToastProvider>
  );
};

export default App;
