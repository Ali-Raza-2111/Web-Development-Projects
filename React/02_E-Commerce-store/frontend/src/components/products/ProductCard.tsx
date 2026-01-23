import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary-500/30 hover:shadow-glow"
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="badge badge-primary">Featured</span>
          )}
          {discount > 0 && (
            <span className="badge bg-red-500/20 text-red-300 border border-red-500/30">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm border border-dark-700/50 flex items-center justify-center text-dark-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
          >
            <Heart size={18} />
          </motion.button>
        </div>

        {/* Add to Cart */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-4 left-4 right-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </motion.button>
      </Link>

      {/* Details */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-primary-400 uppercase tracking-wider">
          {product.category}
        </span>

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white font-medium mt-1 line-clamp-2 hover:text-primary-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm text-dark-300">{product.rating}</span>
          </div>
          <span className="text-dark-500 text-sm">({product.reviewCount} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold text-white">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-dark-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
