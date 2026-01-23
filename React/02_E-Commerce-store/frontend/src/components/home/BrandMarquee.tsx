import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { SiApple, SiNike, SiSamsung, SiSony } from 'react-icons/si';
import { FaMicrosoft, FaGem, FaShoppingBag, FaCrown } from 'react-icons/fa';

interface Brand {
  name: string;
  Icon: IconType;
}

const brands: Brand[] = [
  { name: 'Apple', Icon: SiApple },
  { name: 'Nike', Icon: SiNike },
  { name: 'Louis Vuitton', Icon: FaShoppingBag },
  { name: 'Samsung', Icon: SiSamsung },
  { name: 'Gucci', Icon: FaGem },
  { name: 'Sony', Icon: SiSony },
  { name: 'Prada', Icon: FaCrown },
  { name: 'Microsoft', Icon: FaMicrosoft },
];

export function BrandMarquee() {
  return (
    <section className="py-16 overflow-hidden border-y border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-dark-400 text-sm uppercase tracking-widest mb-8"
        >
          Trusted by leading brands worldwide
        </motion.p>
      </div>
      
      {/* Scrolling Marquee */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-950 to-transparent z-10" />
        
        {/* Marquee Track */}
        <div className="flex gap-12 animate-marquee">
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-8 py-4 glass rounded-xl shrink-0 hover:shadow-glow transition-all duration-300 cursor-pointer group"
            >
              <brand.Icon className="text-2xl text-primary-400 group-hover:scale-110 group-hover:text-primary-300 transition-all" />
              <span className="text-dark-300 font-medium group-hover:text-white transition-colors whitespace-nowrap">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
