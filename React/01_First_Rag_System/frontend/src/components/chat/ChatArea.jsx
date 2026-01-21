import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Sparkles, StopCircle, ArrowUp, WifiOff, Bot } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const ChatArea = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading, isConnected } = useAppContext();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    
    // Use the context's sendMessage which handles the API call
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-950 relative">
      
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            Backend not connected. Make sure the server is running at localhost:8000
          </span>
        </div>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-40 md:px-[15%] space-y-8 scroll-smooth custom-scrollbar">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-0 animate-fade-in" style={{animation: 'fadeIn 0.5s forwards'}}>
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mb-6">
               <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">I'm trained on your custom documents. Ask me anything about financial reports, project specs, or employee handbooks.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {["Summarize the Q3 Financial Report", "What are the project deadlines?", "Explain the travel policy", "List all stakeholders"].map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all text-left text-sm text-gray-700 dark:text-gray-200 font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex justify-start w-full max-w-[80%]"
          >
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
               <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-sm">
                  <Bot size={18} className="animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
               </div>
               <div className="flex flex-col gap-0.5">
                   <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">NeuralRAG</span>
                   <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-0.5">
                       Thinking
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
                   </span>
               </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-6 left-4 right-4 md:left-[15%] md:right-[15%] z-20">
        <div className="shadow-2xl shadow-blue-500/10 rounded-[26px] border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-1.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/30">
          <div className="flex items-end gap-2 px-1">
            
            <button 
              className="p-2.5 mb-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors" 
              title="Attach file"
              aria-label="Attach file"
            >
              <Paperclip size={20} className="stroke-[2.5]" />
            </button>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 max-h-[200px] py-3.5 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none font-medium leading-relaxed"
              rows={1}
              aria-label="Chat input"
            />

            {!input.trim() ? (
               <button 
                 className="p-2.5 mb-1 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                 aria-label="Use voice input"
               >
                 <Mic size={20} className="stroke-[2.5]" />
               </button>
            ) : (
               <button 
                onClick={handleSend}
                disabled={isLoading}
                aria-label="Send message"
                className={cn(
                  "p-2.5 mb-1 rounded-full transition-all duration-200 flex items-center justify-center",
                  isLoading ? "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400" : "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                {isLoading ? <StopCircle size={20} /> : <ArrowUp size={22} strokeWidth={3} />}
              </button>
            )}
            
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium opacity-60">
          NeuralRAG can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
