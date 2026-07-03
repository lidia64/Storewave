import api from '../lib/axios';
import type { Category, PaginatedResponse } from '../types';

export const categoryService = {
  getAll: (page = 1, limit = 100) =>
    api.get<PaginatedResponse<Category>>('/api/categories', { params: { page, limit } }),
};
