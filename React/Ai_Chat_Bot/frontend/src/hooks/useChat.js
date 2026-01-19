import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Load a specific conversation
  const loadConversation = useCallback(async (conversationId) => {
    setIsLoading(true);
    setError(null);
    try {
      const conversation = await api.getConversation(conversationId);
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendMessage(content, currentConversationId);

      // Add both user and assistant messages
      setMessages((prev) => [
        ...prev,
        response.user_message,
        response.assistant_message,
      ]);

      // Update current conversation ID if this was a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
      }

      // Refresh conversations list
      await loadConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, loadConversations]);

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await api.deleteConversation(conversationId);
      await loadConversations();

      // If we deleted the current conversation, start fresh
      if (conversationId === currentConversationId) {
        startNewConversation();
      }
    } catch (err) {
      setError(err.message);
    }
  }, [currentConversationId, loadConversations, startNewConversation]);

  return {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    error,
    sendMessage,
    loadConversation,
    loadConversations,
    startNewConversation,
    deleteConversation,
  };
}
