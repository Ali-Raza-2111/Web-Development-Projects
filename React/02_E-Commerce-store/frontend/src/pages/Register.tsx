import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual auth service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user registration
      login(
        {
          id: '1',
          email: formData.email,
          name: formData.name,
          role: formData.role,
          createdAt: new Date().toISOString(),
        },
        'mock-jwt-token'
      );

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-dark-400">Join LUXE and start shopping</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={20} />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={20} />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<Lock size={20} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-dark-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              icon={<Lock size={20} />}
              required
            />

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'buyer'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
                  }`}
                >
                  <span className="block text-white font-medium">Shop</span>
                  <span className="block text-dark-400 text-sm">Buy products</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'seller'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
                  }`}
                >
                  <span className="block text-white font-medium">Sell</span>
                  <span className="block text-dark-400 text-sm">List products</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-dark-600 bg-dark-800"
              />
              <span className="text-dark-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <AnimatedButton
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
              <ArrowRight size={20} />
            </AnimatedButton>
          </form>

          {/* Footer */}
          <p className="text-center text-dark-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
