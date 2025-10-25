/**
 * Database Type Definitions
 *
 * Type-safe definitions for Supabase database schema.
 * These types are based on the database schema defined in the setup instructions.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      plants: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          plant_name: string | null;
          diagnosis: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          plant_name?: string | null;
          diagnosis?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          plant_name?: string | null;
          diagnosis?: Json | null;
          created_at?: string;
        };
      };
      treatments: {
        Row: {
          id: string;
          plant_id: string;
          step: number;
          description: string;
          date: string;
          completed: boolean;
        };
        Insert: {
          id?: string;
          plant_id: string;
          step: number;
          description: string;
          date: string;
          completed?: boolean;
        };
        Update: {
          id?: string;
          plant_id?: string;
          step?: number;
          description?: string;
          date?: string;
          completed?: boolean;
        };
      };
    };
  };
}

/**
 * Type definitions for diagnosis response from AI
 */
export interface DiagnosisResult {
  plantName: string;
  confidence: number;
  issues: {
    name: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    causes?: string[];
  }[];
  recommendations: {
    action: string;
    timeline: string;
    priority: number;
  }[];
  careTips?: {
    icon: string;
    title: string;
    description: string;
  }[];
  careSummary?: string;
}

// Helper types for easier access
export type Plant = Database['public']['Tables']['plants']['Row'];
export type PlantInsert = Database['public']['Tables']['plants']['Insert'];
export type PlantUpdate = Database['public']['Tables']['plants']['Update'];

export type Treatment = Database['public']['Tables']['treatments']['Row'];
export type TreatmentInsert = Database['public']['Tables']['treatments']['Insert'];
export type TreatmentUpdate = Database['public']['Tables']['treatments']['Update'];
