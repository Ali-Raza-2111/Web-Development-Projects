// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  aiDescription?: string;
  featured?: boolean;
  createdAt: string;
  seller?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  aiSummary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  helpful: number;
  createdAt: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  products?: Product[];
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  search?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
