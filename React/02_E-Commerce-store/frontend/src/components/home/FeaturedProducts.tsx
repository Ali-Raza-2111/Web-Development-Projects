import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../products/ProductCard';
import type { Product } from '../../types';

// Mock featured products - replace with API call
const mockFeaturedProducts: Product[] = [
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
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary-400 text-sm font-medium uppercase tracking-wider"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mt-2"
            >
              Featured Products
            </motion.h2>
          </div>
          <Link
            to="/products?featured=true"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mt-4 md:mt-0"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {mockFeaturedProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
