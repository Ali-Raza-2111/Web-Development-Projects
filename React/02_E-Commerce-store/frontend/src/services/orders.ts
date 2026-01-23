import api from './api';
import type { Order, Address } from '../types';

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  shippingAddress: Address;
  paymentMethod: string;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Seller endpoints
  async getSellerOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/seller/me');
    return response.data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default orderService;
