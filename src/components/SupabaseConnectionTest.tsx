'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const SupabaseConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<'configured' | 'not_configured' | 'checking'>('checking');
  const [authStatus, setAuthStatus] = useState<'authenticated' | 'not_authenticated' | 'checking'>('checking');
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'checking'>('checking');

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setConfigStatus('not_configured');
        setIsConnected(false);
        setError('Supabase environment variables are not configured');
        return;
      }
      
      setConfigStatus('configured');
      
      // Check authentication
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        throw new Error(`Auth error: ${authError.message}`);
      }
      
      setAuthStatus(authData.session ? 'authenticated' : 'not_authenticated');
      
      // Test database connection by querying a table
      const { data, error: dbError } = await supabase.from('accounts').select('count').limit(1);
      
      if (dbError) {
        if (dbError.code === 'PGRST116') {
          // This error means the table exists but user doesn't have access - still means connection works
          setDbStatus('connected');
          setIsConnected(true);
        } else {
          setDbStatus('error');
          throw new Error(`Database error: ${dbError.message}`);
        }
      } else {
        setDbStatus('connected');
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-8 border border-gray-200">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Supabase Connection Test</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testConnection}
            disabled={isLoading}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Configuration</p>
              <p className="text-sm text-gray-500">Environment variables</p>
            </div>
            <StatusIndicator status={configStatus} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Authentication</p>
              <p className="text-sm text-gray-500">Auth service connection</p>
            </div>
            <StatusIndicator status={authStatus} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Database</p>
              <p className="text-sm text-gray-500">Database connection</p>
            </div>
            <StatusIndicator status={dbStatus} />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Overall Status</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
                />
              ) : isConnected ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Connected</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Not Connected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  status: 'configured' | 'not_configured' | 'checking' | 'authenticated' | 'not_authenticated' | 'connected' | 'error';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  if (status === 'checking') {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
      />
    );
  }

  if (status === 'configured' || status === 'authenticated' || status === 'connected') {
    return <CheckCircle size={20} className="text-green-500" />;
  }

  return <XCircle size={20} className="text-red-500" />;
};

export default SupabaseConnectionTest;