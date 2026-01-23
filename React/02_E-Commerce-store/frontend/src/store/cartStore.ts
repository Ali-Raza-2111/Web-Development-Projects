import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product.id === product.id);

        let newItems: CartItem[];

        if (existingItem) {
          newItems = items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          toast.success(`Updated ${product.title} quantity`);
        } else {
          newItems = [
            ...items,
            {
              id: `cart-${product.id}-${Date.now()}`,
              product,
              quantity,
            },
          ];
          toast.success(`Added ${product.title} to cart`);
        }

        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.product.id !== productId);

        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });

        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newItems = items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );

        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
        toast.success('Cart cleared');
      },

      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find((i) => i.product.id === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
