import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { ProductFilters } from '../../types';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'digital', label: 'Digital Goods' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'watches', label: 'Watches' },
  { value: 'audio', label: 'Audio' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const priceRanges = [
  { min: undefined, max: undefined, label: 'All Prices' },
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 250, label: '$100 - $250' },
  { min: 250, max: 500, label: '$250 - $500' },
  { min: 500, max: undefined, label: '$500+' },
];

export function ProductFiltersComponent({ filters, onFilterChange, onReset }: ProductFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ ...filters, category: cat.value || undefined })}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filters.category === cat.value || (!filters.category && !cat.value)
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() =>
                onFilterChange({ ...filters, minPrice: range.min, maxPrice: range.max })
              }
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                onFilterChange({ ...filters, rating: filters.rating === rating ? undefined : rating })
              }
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.rating === rating
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-300 bg-dark-800/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {rating}+ ★
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 glass-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <SlidersHorizontal size={20} />
            Filters
          </h3>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden mb-6 flex items-center gap-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-dark-300 hover:text-white transition-colors"
        >
          <SlidersHorizontal size={18} />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as ProductFilters['sortBy'] })}
            className="w-full appearance-none px-4 py-2 pr-10 bg-dark-800 border border-dark-700 rounded-xl text-white outline-none focus:border-primary-500 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-dark-900 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal size={20} />
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-dark-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <FilterContent />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
