import { createClient } from '@supabase/supabase-js';

// Check if the environment variables are defined and not placeholder values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your-supabase-url' &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('http')
  );
};

// Create a Supabase client only if the environment variables are properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Function to create a client with custom auth
export const createSupabaseClient = (accessToken?: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Please set up your environment variables.');
    return null;
  }
  
  if (accessToken) {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });
  }
  
  return createClient(supabaseUrl!, supabaseAnonKey!);
};