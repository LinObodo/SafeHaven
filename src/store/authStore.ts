import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  login: (user: User) => void;
  logout: () => void;
  setDarkMode: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  quickExit: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      darkMode: false,
      fontSize: 'medium',
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      quickExit: () => {
        // Clear all local storage and redirect to neutral site
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('https://www.google.com');
      },
    }),
    {
      name: 'safe-haven-auth',
      partialize: (state) => ({
        darkMode: state.darkMode,
        fontSize: state.fontSize,
      }),
    }
  )
);