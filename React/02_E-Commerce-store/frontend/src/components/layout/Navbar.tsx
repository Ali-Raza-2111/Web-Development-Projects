import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  MessageCircle,
  Package,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Fashion', href: '/products?category=fashion' },
  { name: 'Electronics', href: '/products?category=electronics' },
  { name: 'Digital', href: '/products?category=digital' },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, toggleCart, toggleChat } = useUIStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/seller/dashboard';
      default:
        return '/buyer/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">LUXE</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-dark-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-dark-300 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>

              {/* AI Chat */}
              <button
                onClick={toggleChat}
                className="p-2 text-dark-300 hover:text-white transition-colors hidden sm:block"
              >
                <MessageCircle size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-2 text-dark-300 hover:text-white transition-colors relative"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center text-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-dark-300 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="glass-dark rounded-xl p-2 shadow-luxury">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link
                        to="/buyer/orders"
                        className="flex items-center gap-3 px-4 py-2 text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Package size={18} />
                        Orders
                      </Link>
                      <Link
                        to="/buyer/wishlist"
                        className="flex items-center gap-3 px-4 py-2 text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Heart size={18} />
                        Wishlist
                      </Link>
                      <hr className="my-2 border-dark-700" />
                      <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors w-full"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white text-sm font-medium transition-colors"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-dark-300 hover:text-white transition-colors md:hidden"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-dark-700/50 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands, and more..."
                    className="input pl-12"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-dark mt-1 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={toggleMobileMenu}
                  className="block px-4 py-3 text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
