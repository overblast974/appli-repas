import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djztoaxkhrufygdjbrbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqenRvYXhraHJ1ZnlnZGpicmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDgzNzAsImV4cCI6MjA3ODQyNDM3MH0._CEM0WZLnowPjEKjngMFPZwjH4_cVVangsUvKqzqbQs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_data: any; // JSON du plan complet
          duration: number;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_data: any;
          duration: number;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_data?: any;
          duration?: number;
          expires_at?: string | null;
        };
      };
    };
  };
}
