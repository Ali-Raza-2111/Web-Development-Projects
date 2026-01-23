import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'Fashion Designer',
    content: 'The AI recommendations are incredible. It suggested pieces that perfectly matched my style before I even knew I wanted them.',
    rating: 5,
    product: 'AI Fashion Stylist',
  },
  {
    id: '2',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'Tech Entrepreneur',
    content: 'Finally, an e-commerce platform that feels like the future. The 3D product views helped me make confident purchases.',
    rating: 5,
    product: 'Smart Watch Pro',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'Creative Director',
    content: 'The luxury experience is unmatched. Every interaction feels premium, from browsing to unboxing.',
    rating: 5,
    product: 'Designer Collection',
  },
  {
    id: '4',
    name: 'Michael Park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'Product Manager',
    content: 'The voice shopping feature has transformed how I shop. It is like having a personal assistant who knows my preferences.',
    rating: 5,
    product: 'Voice Shopping AI',
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group"
    >
      <div className="glass rounded-2xl p-6 h-full hover:shadow-glow transition-all duration-500 border border-transparent hover:border-primary-500/20">
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-primary-500/20 absolute top-6 right-6" />
        
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-dark-600'
              }`}
            />
          ))}
        </div>
        
        {/* Content */}
        <p className="text-dark-200 mb-6 leading-relaxed">{testimonial.content}</p>
        
        {/* Product Tag */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20 mb-4">
          {testimonial.product}
        </span>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30"
          />
          <div>
            <h4 className="text-white font-medium">{testimonial.name}</h4>
            <p className="text-dark-400 text-sm">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"
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
            Customer Stories
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            Loved by <span className="gradient-text">Thousands</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-dark-300 text-lg max-w-2xl mx-auto"
          >
            Join our community of satisfied customers who have transformed their shopping experience
          </motion.p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {[
            { label: 'Trustpilot', score: '4.9/5' },
            { label: 'Google', score: '4.8/5' },
            { label: 'App Store', score: '4.9/5' },
            { label: 'Play Store', score: '4.7/5' },
          ].map((badge) => (
            <div key={badge.label} className="text-center group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white font-medium">{badge.score}</p>
              <p className="text-dark-400 text-sm group-hover:text-primary-400 transition-colors">
                {badge.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
