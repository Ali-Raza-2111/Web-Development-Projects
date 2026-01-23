import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from './CartItem';
import { AnimatedButton } from '../ui/AnimatedButton';

export function CartDrawer() {
  const { isCartOpen, toggleCart } = useUIStore();
  const { items, total, itemCount } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-900 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <ShoppingBag size={24} />
                Shopping Cart
                {itemCount > 0 && (
                  <span className="text-sm text-dark-400">({itemCount} items)</span>
                )}
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 text-dark-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-dark-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-dark-400 mb-6">
                    Discover our collection and add some items to your cart.
                  </p>
                  <Link to="/products" onClick={toggleCart}>
                    <AnimatedButton>
                      Start Shopping
                      <ArrowRight size={18} />
                    </AnimatedButton>
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-dark-700/50 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-dark-300">Subtotal</span>
                  <span className="font-bold text-white">${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-dark-400">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link to="/checkout" onClick={toggleCart}>
                  <AnimatedButton className="w-full" size="lg">
                    Checkout
                    <ArrowRight size={20} />
                  </AnimatedButton>
                </Link>
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="block text-center text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
