'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Define the auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is configured first
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not configured. Please set up your environment variables.');
          setError('Supabase is not configured. Please check your environment variables.');
          setIsLoading(false);
          return;
        }

        // Check if Supabase client is properly initialized
        if (!supabase) {
          throw new Error('Supabase client is not initialized. Please check your environment variables.');
        }

        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to check authentication status. Please check your Supabase configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener only if supabase is available and configured
    if (isSupabaseConfigured() && supabase?.auth) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user || null);
          setIsLoading(false);
          setError(null); // Clear errors on successful auth state change
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set up your environment variables.');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set up your environment variables.');
        return;
      }
      
      if (!supabase?.auth) {
        setError('Supabase client is not initialized. Please check your environment variables.');
        return;
      }
      
      // Explicitly check supabase is not null before making the call
      if (!supabase) {
        setError('Authentication service is not available. Please check your configuration.');
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Handle specific error cases and set appropriate error messages
        if (error.message === 'Email not confirmed' || 
            error.message.includes('email_not_confirmed') || 
            error.code === 'email_not_confirmed') {
          setError('UNCONFIRMED_EMAIL');
          // Don't log this as an error since it's an expected user state
          return;
        } else if (error.message === 'Invalid login credentials') {
          setError('The email or password you entered is incorrect. Please check your credentials and try again.');
        } else {
          // Only log unexpected errors to console
          console.error('Login error:', error);
          setError(error.message || 'Failed to login');
        }
        return;
      }
      
      setSession(data.session);
      setUser(data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please set up your environment variables.');
      }
      
      if (!supabase?.auth) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }
      
      // Explicitly check supabase is not null before making the call
      if (!supabase) {
        throw new Error('Authentication service is not available. Please check your configuration.');
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      
      if (error) throw error;
      
      // If email confirmation is required, don't set session immediately
      if (data.user && !data.session) {
        setError('REGISTRATION_SUCCESS');
        return;
      }
      
      setSession(data.session);
      setUser(data.user);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend confirmation email function
  const resendConfirmation = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please set up your environment variables.');
      }
      
      if (!supabase?.auth) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }
      
      // Explicitly check supabase is not null before making the call
      if (!supabase) {
        throw new Error('Authentication service is not available. Please check your configuration.');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      setError('CONFIRMATION_SENT');
    } catch (err: any) {
      console.error('Resend confirmation error:', err);
      setError(err.message || 'Failed to resend confirmation email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please set up your environment variables.');
      }
      
      if (!supabase?.auth) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }
      
      // Explicitly check supabase is not null before making the call
      if (!supabase) {
        throw new Error('Authentication service is not available. Please check your configuration.');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isSupabaseConfigured: isSupabaseConfigured(),
    login,
    register,
    resendConfirmation,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};