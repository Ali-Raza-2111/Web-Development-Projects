import api from './api';
import type { Product, PaginatedResponse, ProductFilters } from '../types';

export const productService = {
  async getProducts(filters?: ProductFilters, page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.sortBy) params.append('sort_by', filters.sortBy);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Seller endpoints
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getSellerProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/seller/me');
    return response.data;
  },
};

export default productService;
