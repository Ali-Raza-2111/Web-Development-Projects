import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { AnimatedButton } from '../ui/AnimatedButton';

export function CartSummary() {
  const { total, itemCount } = useCartStore();

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + shipping + tax;

  return (
    <div className="glass-dark rounded-2xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-dark-300">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-white">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-dark-300">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-dark-300">
          <span>Estimated Tax</span>
          <span className="text-white">${tax.toFixed(2)}</span>
        </div>
        <hr className="border-dark-700" />
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-lg font-bold text-white">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {total < 100 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-dark-400 mb-2">
            <span>Add ${(100 - total).toFixed(2)} for free shipping</span>
            <span>{Math.round((total / 100) * 100)}%</span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <Link to="/checkout">
        <AnimatedButton className="w-full" size="lg">
          Proceed to Checkout
          <ArrowRight size={20} />
        </AnimatedButton>
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-dark-400 text-sm">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-3 text-dark-400 text-sm">
          <Truck size={18} className="text-primary-400" />
          <span>Free shipping on orders over $100</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            className="flex-1 px-4 py-2 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder:text-dark-400 outline-none focus:border-primary-500 transition-colors"
          />
          <button className="px-4 py-2 bg-dark-700 text-dark-300 rounded-xl hover:text-white transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
