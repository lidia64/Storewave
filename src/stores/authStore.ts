import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const getAuthData = (payload: any) => {
  const token = payload?.data?.token ?? payload?.token;
  const user = payload?.data?.user ?? payload?.user;

  if (!token || !user) {
    throw new Error('Authentication response did not include a token and user.');
  }

  return { token, user };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(email, password);
          const { token, user } = getAuthData(data);
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || 'Login failed', isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(name, email, password);
          const { data } = await authService.login(email, password);
          const { token, user } = getAuthData(data);
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-store');
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
