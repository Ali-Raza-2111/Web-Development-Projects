import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../lib/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Chat State
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Documents State
  const [files, setFiles] = useState([]);

  // Settings State
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'English (United States)',
    model: 'llama3.2:1b',
    temperature: 0.7,
  });

  // Backend connection status
  const [isConnected, setIsConnected] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiService.healthCheck();
        setIsConnected(true);
      } catch (err) {
        console.error('Backend not connected:', err);
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  // Load documents from backend on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await apiService.getDocuments();
        setFiles(docs.map(doc => ({
          id: doc.id,
          file: { name: doc.filename, size: doc.size },
          status: doc.status,
          type: doc.type,
        })));
      } catch (err) {
        console.error('Failed to load documents:', err);
      }
    };
    if (isConnected) {
      loadDocuments();
    }
  }, [isConnected]);

  // Chat Actions
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = useCallback(async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await apiService.sendMessage(apiMessages);
      
      const assistantMessage = {
        id: response.id || Date.now() + 1,
        role: 'assistant',
        content: response.content,
        sources: response.sources || [],
        timestamp: new Date().toISOString()
      };

      addMessage(assistantMessage);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      
      // Add error message
      addMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please make sure the backend server is running.`,
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Document Actions
  const addFile = (file) => {
    setFiles(prev => [...prev, file]);
  };
  
  const updateFileStatus = (id, status) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const uploadFile = useCallback(async (file) => {
    const fileObj = {
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      type: file.name.split('.').pop().toUpperCase()
    };

    addFile(fileObj);

    try {
      const response = await apiService.uploadDocument(file, (progress) => {
        // Update progress if needed
      });

      updateFileStatus(fileObj.id, 'success');
      
      // Update with server ID
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, id: response.id, status: 'success' } : f
      ));
      
      return response;
    } catch (err) {
      console.error('Upload error:', err);
      updateFileStatus(fileObj.id, 'error');
      throw err;
    }
  }, []);

  const removeFile = useCallback(async (id) => {
    try {
      await apiService.deleteDocument(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      // Remove from UI anyway
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  }, []);

  // Settings Actions
  const updateSettings = useCallback(async (newSettings) => {
    try {
      await apiService.updateSettings({
        model: newSettings.model,
        temperature: newSettings.temperature
      });
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error('Settings update error:', err);
      // Update locally anyway
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  }, []);

  const clearChat = () => {
    setMessages([]);
  };

  const value = {
    // Chat
    messages,
    addMessage,
    sendMessage,
    clearChat,
    isLoading,
    error,
    
    // Documents
    files,
    addFile,
    uploadFile,
    updateFileStatus,
    removeFile,
    
    // Settings
    settings,
    updateSettings,
    
    // Connection
    isConnected
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
