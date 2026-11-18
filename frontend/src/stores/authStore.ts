import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, UserRole } from '../types';

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, 'token' | 'type'> | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      setAuth: (data) =>
        set({
          token: data.token,
          user: {
            userId: data.userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
          isAuthenticated: true,
          role: data.role,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          role: null,
        }),
    }),
    {
      name: 'spree-auth',
    }
  )
);
