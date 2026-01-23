import api from './api';
import type { ChatMessage, Product } from '../types';

// AI Service stubs - implement your own AI logic here
export const aiService = {
  // Chatbot
  async sendMessage(message: string, context?: { productId?: string }): Promise<ChatMessage> {
    const response = await api.post<ChatMessage>('/ai/chat', { message, context });
    return response.data;
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>('/ai/chat/history');
    return response.data;
  },

  // Recommendations
  async getRecommendations(userId?: string): Promise<Product[]> {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await api.get<Product[]>(`/ai/recommendations${params}`);
    return response.data;
  },

  async getSimilarProducts(productId: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/ai/similar/${productId}`);
    return response.data;
  },

  // Review Summarization
  async getReviewSummary(productId: string): Promise<{
    summary: string;
    pros: string[];
    cons: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  }> {
    const response = await api.get(`/ai/reviews/summary/${productId}`);
    return response.data;
  },

  // Seller Assistant
  async improveProductListing(data: {
    title: string;
    description: string;
    category: string;
  }): Promise<{
    improvedTitle: string;
    improvedDescription: string;
    suggestedTags: string[];
    seoScore: number;
    suggestions: string[];
  }> {
    const response = await api.post('/ai/seller/improve-listing', data);
    return response.data;
  },

  async suggestPrice(data: {
    title: string;
    category: string;
    description: string;
  }): Promise<{
    suggestedPrice: number;
    priceRange: { min: number; max: number };
    reasoning: string;
  }> {
    const response = await api.post('/ai/seller/suggest-price', data);
    return response.data;
  },

  // Smart Search
  async smartSearch(query: string): Promise<{
    products: Product[];
    suggestions: string[];
    filters: { category?: string; priceRange?: { min: number; max: number } };
  }> {
    const response = await api.post('/ai/search', { query });
    return response.data;
  },
};

export default aiService;
