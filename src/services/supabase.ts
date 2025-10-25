/**
 * Supabase Client Configuration
 *
 * This file initializes and exports the Supabase client for use throughout the app.
 * It handles authentication, database queries, and storage operations.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

/**
 * Supabase client instance with type-safe database schema
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Storage bucket name for plant images
 */
export const PLANT_IMAGES_BUCKET = 'plant-images';
