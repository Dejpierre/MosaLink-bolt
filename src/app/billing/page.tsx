'use client';

import React from 'react';
import { BillingDashboard } from '../../components/subscription/BillingDashboard';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" passHref>
            <motion.span
              whileHover={{ x: -5 }}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Editor
            </motion.span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and payment methods</p>
        </motion.div>
        
        <BillingDashboard />
      </div>
    </div>
  );
}