import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

interface User {
  email: string;
  uid: string;
  role: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => {
        if (!userData?.email || !userData?.role || !userData?.uid) {
          console.error('AuthStore - Datos de usuario inválidos:', userData);
          return;
        }
        set({ user: userData, isAuthenticated: true });
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          throw error;
        }
      }
    }),
    {
      name: 'auth-store',
      version: 1,
    }
  )
);