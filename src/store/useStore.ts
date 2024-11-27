import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface StoreState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  total: 0,
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + product.price,
        };
      }
      return {
        cart: [...state.cart, { product, quantity: 1 }],
        total: state.total + product.price,
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
      total: state.cart.reduce((total, item) => 
        item.product.id !== productId 
          ? total 
          : total - (item.product.price * item.quantity), 
        state.total
      ),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
      total: state.cart.reduce((total, item) => 
        item.product.id === productId
          ? total - (item.product.price * item.quantity) + (item.product.price * quantity)
          : total,
        state.total
      ),
    })),
  clearCart: () => set({ cart: [], total: 0 }),
}));