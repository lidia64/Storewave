import api from '../lib/axios';
import type { AuthResponse, User } from '../types';

export const authService = {
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/users/register', { name, email, password, role: 'USER' }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/users/login', { email, password, role: 'USER' }),

  me: () => api.get<{ success: boolean; user: User }>('/api/auth/users/me'),
};
