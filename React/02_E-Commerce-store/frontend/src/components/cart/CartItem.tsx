import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50"
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${product.id}`}
          className="text-white font-medium hover:text-primary-400 transition-colors line-clamp-2"
        >
          {product.title}
        </Link>
        <p className="text-dark-400 text-sm mt-1">{product.category}</p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center text-white font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-white font-semibold">
              ${(product.price * quantity).toFixed(2)}
            </p>
            {quantity > 1 && (
              <p className="text-dark-400 text-sm">${product.price} each</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(product.id)}
        className="p-2 text-dark-400 hover:text-red-400 transition-colors self-start"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
