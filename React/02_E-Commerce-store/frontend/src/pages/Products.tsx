import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductGrid, ProductFiltersComponent } from '../components/products';
import type { Product, ProductFilters } from '../types';

// Mock products - replace with API call
const mockProducts: Product[] = [
  {
    id: '1',
    sellerId: 's1',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our flagship wireless headphones.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50,
    tags: ['audio', 'wireless', 'premium'],
    rating: 4.8,
    reviewCount: 256,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    sellerId: 's2',
    title: 'Designer Leather Jacket',
    description: 'Handcrafted Italian leather jacket with modern styling.',
    price: 599.99,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    stock: 25,
    tags: ['leather', 'designer', 'luxury'],
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    sellerId: 's3',
    title: 'Smart Watch Pro',
    description: 'Advanced health tracking and seamless connectivity.',
    price: 449.99,
    originalPrice: 549.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 100,
    tags: ['smartwatch', 'fitness', 'tech'],
    rating: 4.7,
    reviewCount: 512,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    sellerId: 's4',
    title: 'Minimalist Backpack',
    description: 'Premium materials meet modern design in this versatile backpack.',
    price: 189.99,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    stock: 75,
    tags: ['backpack', 'minimal', 'travel'],
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    sellerId: 's5',
    title: 'Wireless Earbuds Pro',
    description: 'True wireless freedom with premium sound quality.',
    price: 199.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'],
    stock: 200,
    tags: ['earbuds', 'wireless', 'audio'],
    rating: 4.5,
    reviewCount: 345,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    sellerId: 's6',
    title: 'Luxury Sunglasses',
    description: 'Designer sunglasses with UV protection.',
    price: 349.99,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock: 60,
    tags: ['sunglasses', 'luxury', 'accessories'],
    rating: 4.7,
    reviewCount: 67,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    sellerId: 's7',
    title: 'Premium UI Kit Bundle',
    description: 'Complete design system for modern web applications.',
    price: 79.99,
    category: 'digital',
    images: ['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500'],
    stock: 999,
    tags: ['design', 'ui', 'digital'],
    rating: 4.9,
    reviewCount: 234,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    sellerId: 's8',
    title: 'Classic Watch',
    description: 'Timeless elegance with Swiss precision.',
    price: 899.99,
    originalPrice: 1199.99,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'],
    stock: 15,
    tags: ['watch', 'luxury', 'classic'],
    rating: 4.8,
    reviewCount: 45,
    createdAt: new Date().toISOString(),
  },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || 'newest',
  });

  // Filter products based on current filters
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...mockProducts];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((p) => p.rating >= filters.rating!);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setTimeout(() => {
      setProducts(filtered);
      setIsLoading(false);
    }, 300);
  }, [filters]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.sortBy) params.set('sort', newFilters.sortBy);
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({ sortBy: 'newest' });
    setSearchParams({});
  };

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {filters.category
              ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`
              : 'All Products'}
          </h1>
          <p className="text-dark-400">
            {products.length} products found
            {filters.search && ` for "${filters.search}"`}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters */}
          <ProductFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* Products */}
          <div className="flex-1">
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
