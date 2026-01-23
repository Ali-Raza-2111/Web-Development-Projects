import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Cpu, Mic, Eye, Zap, Shield } from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Cpu,
    title: 'AI Recommendations',
    description: 'Our AI learns your preferences and suggests products you will love.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mic,
    title: 'Voice Shopping',
    description: 'Shop hands-free with our intelligent voice assistant.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Eye,
    title: 'Virtual Try-On',
    description: 'See how products look on you before purchasing.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    title: 'Instant Checkout',
    description: 'One-click checkout for a seamless purchasing experience.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Bank-level encryption for all your transactions.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Sparkles,
    title: 'Personalization',
    description: 'A unique shopping experience tailored just for you.',
    gradient: 'from-pink-500 to-rose-500',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="glass rounded-2xl p-6 h-full hover:shadow-glow transition-all duration-500 border border-transparent hover:border-primary-500/20">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:gradient-text transition-colors">
          {feature.title}
        </h3>
        <p className="text-dark-400 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Hover Gradient */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
}

export function FeatureShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background Effect */}
      <motion.div
        style={{ y }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary-400 text-sm font-medium uppercase tracking-wider"
          >
            Powered by Innovation
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            The <span className="gradient-text">Future</span> is Here
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-dark-300 text-lg max-w-2xl mx-auto"
          >
            Experience shopping reimagined with cutting-edge AI technology and innovative features
          </motion.p>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
