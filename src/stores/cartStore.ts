import { create } from 'zustand';
import type { Cart, CartItem } from '../types';
import { cartService } from '../services/cart.service';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: () => number;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await cartService.getCart();
      set({ cart: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load cart', isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    try {
      await cartService.addItem(productId, variantId, quantity);
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to add item' });
      throw err;
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, quantity);
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update item' });
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to remove item' });
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cart: null });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to clear cart' });
    }
  },

  cartCount: () => {
    const items = get().cart?.items ?? [];
    return items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  },

  cartTotal: () => {
    const items = get().cart?.items ?? [];
    return items.reduce((sum: number, item: CartItem) => {
      const price = item.variant?.price ?? item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  },
}));
