import api from '../lib/axios';
import type { Product, ProductSearchResponse, PaginatedResponse } from '../types';

export const productService = {
  getAll: () => api.get<ProductSearchResponse>('/api/public/products'),

  getById: (id: string) =>
    api.get<{ success: boolean; message: string; data: { product: Product; avgRating: number } }>(
      `/api/public/products/${id}`
    ),

  getByCategory: (categoryId: string, page = 1, limit = 12) =>
    api.get<PaginatedResponse<Product>>(`/api/public/products/category/${categoryId}`, {
      params: { page, limit },
    }),
};
