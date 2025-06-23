'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a simplified auth context type
interface AuthContextType {
  user: any | null;
  session: any | null;
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
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified mock functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Login attempt with:', email);
      // Mock successful login
      const mockUser = { id: '1', email, user_metadata: { full_name: 'Demo User' } };
      setUser(mockUser);
      setSession({ user: mockUser });
      setError(null);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Register attempt with:', email, name);
      // Mock successful registration
      const mockUser = { id: '1', email, user_metadata: { full_name: name } };
      setUser(mockUser);
      setSession({ user: mockUser });
      setError(null);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    setIsLoading(true);
    try {
      console.log('Resend confirmation to:', email);
      setError('CONFIRMATION_SENT');
    } catch (err: any) {
      console.error('Resend confirmation error:', err);
      setError(err.message || 'Failed to resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('Logout attempt');
      setUser(null);
      setSession(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isSupabaseConfigured: false,
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