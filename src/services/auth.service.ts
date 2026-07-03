import api from '../lib/axios';
import type { AuthResponse, User } from '../types';

export const authService = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/users/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/users/login', { email, password }),

  me: () => api.get<{ success: boolean; user: User }>('/api/auth/users/me'),
};
