import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          is_anonymous: boolean;
          role: 'victim' | 'ngo' | 'emergency';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          is_anonymous?: boolean;
          role?: 'victim' | 'ngo' | 'emergency';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          is_anonymous?: boolean;
          role?: 'victim' | 'ngo' | 'emergency';
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          message: string;
          is_user: boolean;
          trigger_words: string[];
          is_emergency: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          message: string;
          is_user: boolean;
          trigger_words?: string[];
          is_emergency?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          message?: string;
          is_user?: boolean;
          trigger_words?: string[];
          is_emergency?: boolean;
          created_at?: string;
        };
      };
    };
  };
}