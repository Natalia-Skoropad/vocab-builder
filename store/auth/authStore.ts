import { create } from 'zustand';

import type { AppUser } from '@/types/auth';
import { authService } from '@/lib/services/auth.service';

//===============================================================

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthState = {
  user: AppUser | null;
  isLoading: boolean;
  isAuthReady: boolean;

  initAuth: () => Promise<void>;
  register: (data: RegisterData) => Promise<AppUser>;
  login: (data: LoginData) => Promise<AppUser>;
  logout: () => Promise<void>;
};

//===============================================================

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthReady: false,

  initAuth: async () => {
    set({ isLoading: true });

    try {
      const user = await authService.getCurrentUser();

      set({
        user,
        isLoading: false,
        isAuthReady: true,
      });
    } catch (error) {
      console.error('initAuth error:', error);

      set({
        user: null,
        isLoading: false,
        isAuthReady: true,
      });
    }
  },

  register: async (data) => {
    set({ isLoading: true });

    try {
      const user = await authService.register(data);

      set({
        user,
        isLoading: false,
        isAuthReady: true,
      });

      return user;
    } catch (error) {
      set({
        isLoading: false,
        isAuthReady: true,
      });

      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true });

    try {
      const user = await authService.login(data);

      set({
        user,
        isLoading: false,
        isAuthReady: true,
      });

      return user;
    } catch (error) {
      set({
        isLoading: false,
        isAuthReady: true,
      });

      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();

      set({
        user: null,
        isLoading: false,
        isAuthReady: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
