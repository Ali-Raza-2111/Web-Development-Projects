import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, clearCart } = useCartStore();

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-dark-400">
            {items.length === 0
              ? 'Your cart is empty'
              : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
              <ShoppingBag size={48} className="text-dark-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our
              collection and find something you love.
            </p>
            <Link to="/products">
              <AnimatedButton size="lg">
                Start Shopping
                <ArrowRight size={20} />
              </AnimatedButton>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-dark-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                  Clear Cart
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
