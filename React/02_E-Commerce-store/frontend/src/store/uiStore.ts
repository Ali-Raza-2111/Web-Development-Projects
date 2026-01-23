import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  isChatOpen: boolean;
  isSearchOpen: boolean;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
  toggleChat: () => void;
  toggleSearch: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isChatOpen: false,
  isSearchOpen: false,

  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
      isCartOpen: false,
      isChatOpen: false,
      isSearchOpen: false,
    })),

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
      isMobileMenuOpen: false,
      isChatOpen: false,
      isSearchOpen: false,
    })),

  toggleChat: () =>
    set((state) => ({
      isChatOpen: !state.isChatOpen,
      isMobileMenuOpen: false,
      isCartOpen: false,
      isSearchOpen: false,
    })),

  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      isMobileMenuOpen: false,
      isCartOpen: false,
      isChatOpen: false,
    })),

  closeAll: () =>
    set({
      isMobileMenuOpen: false,
      isCartOpen: false,
      isChatOpen: false,
      isSearchOpen: false,
    }),
}));
