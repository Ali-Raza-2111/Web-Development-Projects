import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shirt, Laptop, Download, Gem, Watch, Headphones } from 'lucide-react';

const categories = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Luxury apparel & accessories',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Cutting-edge technology',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'digital',
    name: 'Digital Goods',
    description: 'Software & digital content',
    icon: Download,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Fine jewelry & watches',
    icon: Gem,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'watches',
    name: 'Watches',
    description: 'Luxury timepieces',
    icon: Watch,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Premium sound equipment',
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    color: 'from-red-500 to-orange-500',
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-400 text-sm font-medium uppercase tracking-wider"
          >
            Explore Categories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mt-2"
          >
            Shop by Category
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group relative block aspect-square rounded-2xl overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-dark-400 text-sm">{category.description}</p>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/50 rounded-2xl transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
