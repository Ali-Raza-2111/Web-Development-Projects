import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { useRef, useState, lazy, Suspense } from 'react';
import { MagneticButton } from '../effects/MagneticButton';
import { TextReveal } from '../effects/TextReveal';
import { CountUp } from '../effects/CountUp';
import { GlowingOrb } from '../effects/GlowingOrb';

// Lazy load 3D scene for performance
const HeroScene3D = lazy(() => import('../3d/HeroScene3D').then(m => ({ default: m.HeroScene3D })));

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  const stats = [
    { value: 50000, label: 'Products', suffix: '+' },
    { value: 100000, label: 'Customers', suffix: '+' },
    { value: 99, label: 'Satisfaction', suffix: '%' },
    { value: 24, label: 'AI Support', suffix: '/7' },
  ];
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <HeroScene3D />
      </Suspense>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-transparent to-dark-950" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />
      
      {/* Animated Glowing Orbs */}
      <GlowingOrb color="primary" size="xl" className="-top-32 -left-32" />
      <GlowingOrb color="secondary" size="lg" className="top-1/3 -right-24" />
      <GlowingOrb color="accent" size="md" className="bottom-1/4 left-1/4" />
      
      {/* Floating Grid Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity, scale }}
      >
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-8 group cursor-pointer hover:shadow-glow transition-all duration-500"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-primary-400" />
          </motion.div>
          <span className="text-sm font-medium bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            AI-Powered Shopping Experience
          </span>
          <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Main Heading with Text Reveal */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="block text-white"
          >
            The Future of
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="block gradient-text"
          >
            <TextReveal delay={0.8}>E-Commerce</TextReveal>
          </motion.span>
        </h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl sm:text-2xl text-dark-300 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Discover luxury fashion, cutting-edge electronics, and exclusive digital goods. 
          <span className="text-primary-400"> Powered by AI</span> for a personalized shopping experience.
        </motion.p>

        {/* CTA Buttons with Magnetic Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/products">
            <MagneticButton
              className="relative px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden group"
              strength={0.2}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500" />
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Content */}
              <span className="relative flex items-center gap-3">
                Start Shopping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
          </Link>
          
          <MagneticButton
            className="relative px-8 py-4 text-lg font-semibold text-white rounded-2xl glass border border-dark-600 hover:border-primary-500/50 transition-colors group"
            strength={0.2}
            onClick={() => setIsVideoPlaying(true)}
          >
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                <Play className="w-4 h-4 text-primary-400 ml-0.5" />
              </div>
              Watch Demo
            </span>
          </MagneticButton>
        </motion.div>

        {/* Stats with CountUp Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="text-center group"
            >
              <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">
                <CountUp 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>
              <div className="text-dark-400 group-hover:text-dark-300 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-dark-500 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-dark-600 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/90 backdrop-blur-lg"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video glass rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex items-center justify-center text-dark-400">
              <p>Video Player Placeholder</p>
            </div>
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-800/80 flex items-center justify-center hover:bg-dark-700 transition-colors"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
