import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Sparkles } from 'lucide-react';
import { MagneticButton } from '../effects/MagneticButton';
import { GlowingOrb } from '../effects/GlowingOrb';
import { TextReveal } from '../effects/TextReveal';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <GlowingOrb color="primary" size="xl" className="-top-32 -right-32" />
      <GlowingOrb color="secondary" size="lg" className="-bottom-24 -left-24" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 md:p-12 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <TextReveal delay={0.3}>Stay Ahead of the Curve</TextReveal>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-dark-300 text-lg mb-8 max-w-xl mx-auto"
          >
            Subscribe to our newsletter for exclusive deals, early access to new products, 
            and personalized AI-powered recommendations.
          </motion.p>

          {/* Form */}
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.6 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-6 left-0 text-sm text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <MagneticButton
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  strength={0.15}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </MagneticButton>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-green-400" />
                </motion.div>
                <p className="text-white text-lg font-medium">Welcome to the LUXE family!</p>
                <p className="text-dark-400">Check your inbox for a special welcome gift.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-dark-500"
          >
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
