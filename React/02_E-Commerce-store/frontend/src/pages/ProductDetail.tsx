import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

// Mock product - replace with API call
const mockProduct: Product = {
  id: '1',
  sellerId: 's1',
  title: 'Premium Wireless Headphones',
  description: `Experience crystal-clear audio with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium memory foam ear cushions for all-day comfort.

Key Features:
• Active Noise Cancellation (ANC)
• 40-hour battery life
• Quick charge: 10 min = 3 hours playback
• Premium leather and aluminum build
• Touch controls
• Voice assistant support
• Foldable design with carrying case`,
  price: 299.99,
  originalPrice: 399.99,
  category: 'electronics',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800',
  ],
  stock: 50,
  tags: ['audio', 'wireless', 'premium', 'noise-cancelling'],
  rating: 4.8,
  reviewCount: 256,
  featured: true,
  createdAt: new Date().toISOString(),
  seller: {
    id: 's1',
    name: 'AudioTech Pro',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setProduct(mockProduct);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) return <PageLoader />;
  if (!product) return <div>Product not found</div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-dark-400">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to={`/products?category=${product.category}`}
                className="hover:text-white transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge bg-red-500/20 text-red-300 border border-red-500/30">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Title */}
            <div>
              <span className="text-primary-400 text-sm uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-dark-600'
                    }
                  />
                ))}
              </div>
              <span className="text-dark-300">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-dark-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-dark-300 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-dark-800 rounded-full text-sm text-dark-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-dark-800 rounded-xl p-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-white hover:bg-dark-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-white hover:bg-dark-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <AnimatedButton
                onClick={() => addItem(product, quantity)}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </AnimatedButton>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
              >
                <Heart size={24} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:text-primary-400 hover:border-primary-500/50 transition-colors"
              >
                <Share2 size={24} />
              </motion.button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-dark-300">
                {product.stock > 10
                  ? 'In Stock'
                  : `Only ${product.stock} left in stock`}
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-700">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 mb-2">
                  <Truck size={24} />
                </div>
                <p className="text-sm text-dark-300">Free Shipping</p>
                <p className="text-xs text-dark-500">Orders over $100</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 mb-2">
                  <Shield size={24} />
                </div>
                <p className="text-sm text-dark-300">2 Year Warranty</p>
                <p className="text-xs text-dark-500">Full coverage</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 mb-2">
                  <RefreshCw size={24} />
                </div>
                <p className="text-sm text-dark-300">30-Day Returns</p>
                <p className="text-xs text-dark-500">Easy returns</p>
              </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-dark-400">Sold by</p>
                  <p className="font-medium text-white">{product.seller.name}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
