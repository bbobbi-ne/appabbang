import type { Admin } from '@/service/auth-api';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  auth: Admin | null;
  setAuth: (data: Admin) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
      auth: null,
      setAuth: (data) => set({ auth: data }),
      clearAuth: () => set({ auth: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ auth: state.auth }), // auth만 저장
    },
  ),
);
