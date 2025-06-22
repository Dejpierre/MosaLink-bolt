'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function TestConnectionPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Supabase Connection Test</h1>
          <SupabaseConnectionTest />
          
          <div className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Connection Instructions</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Make sure you have created a Supabase project at <a href="https://supabase.com" className="text-indigo-600 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
              <li>Copy your Supabase URL and anon key from the project settings</li>
              <li>Add these values to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
                <pre className="bg-gray-100 p-3 rounded-lg mt-2 overflow-x-auto text-sm">
                  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url<br/>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
                </pre>
              </li>
              <li>Restart your development server</li>
              <li>Click the refresh button on the test panel to check the connection again</li>
            </ol>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}