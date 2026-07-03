import api from '../lib/axios';
import type { Cart } from '../types';

export const cartService = {
  getCart: () => api.get<{ success: boolean; data: Cart }>('/api/auth/cart'),

  addItem: (productId: string, variantId: string, quantity: number) =>
    api.post('/api/auth/cart/items', { productId, variantId, quantity }),

  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/api/auth/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/api/auth/cart/items/${itemId}`),

  clearCart: () => api.delete('/api/auth/cart'),
};
