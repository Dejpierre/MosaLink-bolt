'use client';

import React from 'react';
import { useAuth } from './auth/AuthProvider';

export const SupabaseSetupNotice: React.FC = () => {
  const { isSupabaseConfigured, error } = useAuth();

  if (isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Supabase Setup Required
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            To use authentication features, please configure your Supabase environment variables.
          </p>
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <div className="text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">supabase.com</a></li>
                <li>Go to Settings → API in your Supabase dashboard</li>
                <li>Copy your Project URL and anon public key</li>
                <li>Update your <code className="bg-gray-200 px-1 rounded">.env</code> file with:</li>
              </ol>
              <div className="mt-3 bg-gray-800 text-gray-100 p-3 rounded text-xs font-mono">
                <div>NEXT_PUBLIC_SUPABASE_URL=your-project-url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Then restart your development server.
              </p>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};