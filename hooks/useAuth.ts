import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store/auth/authStore';

//===============================================================

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
      isAuthReady: state.isAuthReady,
      isAuthenticated: state.isAuthenticated,
      initAuth: state.initAuth,
      register: state.register,
      login: state.login,
      logout: state.logout,
    }))
  );
}
