import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInAnonymously: () => Promise<{ error?: string }>;
  logout: () => void;
  initialize: () => Promise<void>;
  setDarkMode: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  quickExit: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authUser: null,
      isAuthenticated: false,
      darkMode: false,
      fontSize: 'medium',
      loading: false,

      signUp: async (email: string, password: string, fullName: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                is_anonymous: false
              }
            }
          });

          if (error) {
            set({ loading: false });
            return { error: error.message };
          }

          if (data.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              role: profile?.role || 'victim',
              isAnonymous: false,
              createdAt: new Date(data.user.created_at),
              lastLogin: new Date()
            };

            set({ 
              user, 
              authUser: data.user, 
              isAuthenticated: true, 
              loading: false 
            });
          }

          return {};
        } catch (error) {
          set({ loading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            set({ loading: false });
            return { error: error.message };
          }

          if (data.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              role: profile?.role || 'victim',
              isAnonymous: profile?.is_anonymous || false,
              createdAt: new Date(profile?.created_at || data.user.created_at),
              lastLogin: new Date()
            };

            set({ 
              user, 
              authUser: data.user, 
              isAuthenticated: true, 
              loading: false 
            });
          }

          return {};
        } catch (error) {
          set({ loading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      signInAnonymously: async () => {
        set({ loading: true });
        try {
          // Create anonymous user with a temporary email
          const anonymousEmail = `anonymous_${Date.now()}@safehaven.temp`;
          const anonymousPassword = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

          const { data, error } = await supabase.auth.signUp({
            email: anonymousEmail,
            password: anonymousPassword,
            options: {
              data: {
                full_name: 'Anonymous User',
                is_anonymous: true
              }
            }
          });

          if (error) {
            set({ loading: false });
            return { error: error.message };
          }

          if (data.user) {
            const user: User = {
              id: data.user.id,
              role: 'victim',
              isAnonymous: true,
              createdAt: new Date(data.user.created_at),
              lastLogin: new Date()
            };

            set({ 
              user, 
              authUser: data.user, 
              isAuthenticated: true, 
              loading: false 
            });
          }

          return {};
        } catch (error) {
          set({ loading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, authUser: null, isAuthenticated: false });
        // Navigate to login page after logout
        window.location.href = '/login';
      },

      initialize: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: profile?.role || 'victim',
              isAnonymous: profile?.is_anonymous || false,
              createdAt: new Date(profile?.created_at || session.user.created_at),
              lastLogin: new Date()
            };

            set({ 
              user, 
              authUser: session.user, 
              isAuthenticated: true, 
              loading: false 
            });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ loading: false });
        }
      },

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

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const { initialize } = useAuthStore.getState();
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    initialize();
  }
});