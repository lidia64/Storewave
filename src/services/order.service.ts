import api from '../lib/axios';
import type { Order, PaginatedResponse } from '../types';

export const orderService = {
  placeFromCart: () => api.post<{ success: boolean; data: Order }>('/api/auth/orders'),

  buyNow: (productId: string, quantity: number, variantId?: string) =>
    api.post<{ success: boolean; data: Order }>('/api/auth/orders/buy', {
      productId,
      quantity,
      ...(variantId && { variantId }),
    }),

  getMyOrders: (status?: string) =>
    api.get<PaginatedResponse<Order>>('/api/auth/orders', {
      params: status ? { status } : {},
    }),

  getOrderById: (id: string) =>
    api.get<{ success: boolean; data: Order }>(`/api/auth/orders/${id}`),
};
