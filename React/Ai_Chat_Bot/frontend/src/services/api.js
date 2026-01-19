const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API client for the chatbot backend
const api = {
  // Send a message to the chatbot
  async sendMessage(message, conversationId = null) {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    return response.json();
  },

  // Get all conversations
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/api/conversations`);

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    const data = await response.json();
    return data.conversations;
  },

  // Get a specific conversation with messages
  async getConversation(conversationId) {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    return response.json();
  },

  // Create a new conversation
  async createConversation() {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return response.json();
  },

  // Delete a conversation
  async deleteConversation(conversationId) {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete conversation');
    }

    return response.json();
  },

  // Update conversation title
  async updateConversationTitle(conversationId, title) {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('Failed to update conversation');
    }

    return response.json();
  },
};

export default api;
