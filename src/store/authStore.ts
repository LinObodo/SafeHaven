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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInAnonymously: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
  logout: () => void;
  initialize: () => Promise<void>;
  setDarkMode: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  quickExit: () => void;
  quickExitAndDeletePlan: () => Promise<void>;
  quickExitConfirmOpen: boolean;
  openQuickExitConfirm: () => void;
  closeQuickExitConfirm: () => void;
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

          // When email confirmation is enabled, Supabase returns a user but
          // no active session. Do NOT mark the user as authenticated.
          if (data.user && !data.session) {
            set({ loading: false });
            return { needsVerification: true };
          }

          if (data.user && data.session) {
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
          } else {
            set({ loading: false });
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
          // Use Supabase native anonymous auth (reliable, no fake credentials)
          const { data, error } = await supabase.auth.signInAnonymously();

          if (error) {
            set({ loading: false });
            return { error: error.message };
          }

          // The user may arrive via data.user or via the created session.
          const authUser = data.user ?? data.session?.user ?? null;

          if (authUser) {
            const user: User = {
              id: authUser.id,
              email: authUser.email || undefined,
              role: 'victim',
              isAnonymous: authUser.is_anonymous ?? true,
              createdAt: new Date(authUser.created_at),
              lastLogin: new Date()
            };

            set({
              user,
              authUser,
              isAuthenticated: true,
              loading: false
            });
            return {};
          }

          set({ loading: false });
          return { error: 'Could not start an anonymous session. Please try again.' };
        } catch (error) {
          set({ loading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      resetPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          });

          if (error) {
            return { error: error.message };
          }

          return {};
        } catch (error) {
          console.error('Error requesting password reset:', error);
          return { error: 'An unexpected error occurred' };
        }
      },

      updatePassword: async (newPassword: string) => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });

          if (error) {
            set({ loading: false });
            return { error: error.message };
          }

          set({ loading: false });
          return {};
        } catch (error) {
          console.error('Error updating password:', error);
          set({ loading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      resendVerification: async (email: string) => {
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/login`
            }
          });

          if (error) {
            return { error: error.message };
          }

          return {};
        } catch (error) {
          console.error('Error resending verification email:', error);
          return { error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error during sign out:', error);
        }
        set({ user: null, authUser: null, isAuthenticated: false });
        // Navigate to login page after logout
        window.location.href = '/login';
      },

      initialize: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Supabase is the source of truth for anonymous status.
            const isAnonymous = session.user.is_anonymous ?? false;

            // Fetch user profile (may not exist yet / be irrelevant for anon users).
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            const user: User = {
              id: session.user.id,
              email: session.user.email || undefined,
              role: profile?.role || 'victim',
              isAnonymous,
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
      quickExitAndDeletePlan: async () => {
        // Permanently delete the user's saved safety plan BEFORE clearing
        // local state and redirecting. Best-effort: a failed delete must not
        // trap the user — we still clear local data and exit.
        const { user } = get();
        if (user) {
          try {
            await supabase.from('safety_plans').delete().eq('user_id', user.id);
          } catch (error) {
            console.error('Error deleting safety plan during quick exit:', error);
          }
        }
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('https://www.google.com');
      },
      quickExitConfirmOpen: false,
      openQuickExitConfirm: () => set({ quickExitConfirmOpen: true }),
      closeQuickExitConfirm: () => set({ quickExitConfirmOpen: false }),
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

// Listen for auth changes to keep the store in sync with the Supabase session.
// This handles session persistence across refreshes and token refreshes
// without re-running a full initialize() on every event.
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      authUser: null,
      isAuthenticated: false,
      loading: false
    });
    return;
  }

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
    const authUser = session.user;
    const isAnonymous = authUser.is_anonymous ?? false;

    useAuthStore.setState((state) => ({
      authUser,
      isAuthenticated: true,
      loading: false,
      // Preserve an already-hydrated profile; otherwise derive a baseline user
      user: state.user ?? {
        id: authUser.id,
        email: authUser.email || undefined,
        role: 'victim',
        isAnonymous,
        createdAt: new Date(authUser.created_at),
        lastLogin: new Date()
      }
    }));
  }
});