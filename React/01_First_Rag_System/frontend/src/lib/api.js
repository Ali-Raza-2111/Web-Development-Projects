/**
 * API Service for NeuralRAG Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Chat endpoints
  async sendMessage(messages) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }

  async streamMessage(messages, onChunk) {
    const url = `${this.baseUrl}/api/chat/stream`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            onChunk(data);
          }
        }
      }
    } catch (error) {
      console.error('Stream Error:', error);
      throw error;
    }
  }

  // Document endpoints
  async uploadDocument(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseUrl}/api/documents/upload`);
      xhr.send(formData);
    });
  }

  async getDocuments() {
    return this.request('/api/documents');
  }

  async deleteDocument(docId) {
    return this.request(`/api/documents/${docId}`, {
      method: 'DELETE',
    });
  }

  // Document viewer endpoint
  async viewDocument(filename, highlightText = null) {
    const params = new URLSearchParams();
    if (highlightText) {
      params.append('highlight', highlightText);
    }
    const queryString = params.toString();
    const endpoint = `/api/documents/view/${encodeURIComponent(filename)}${queryString ? '?' + queryString : ''}`;
    return this.request(endpoint);
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/api/settings');
  }

  async updateSettings(settings) {
    return this.request('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
