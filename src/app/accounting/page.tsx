'use client';

import React from 'react';
import { Header } from '@/components/Header';
import AccountingDashboard from '@/components/AccountingDashboard';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AccountingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AccountingDashboard />
      </div>
    </AuthGuard>
  );
}