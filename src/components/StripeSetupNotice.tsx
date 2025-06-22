'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, AlertCircle, ExternalLink } from 'lucide-react';

export const StripeSetupNotice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <CreditCard className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Stripe Setup Required
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            To enable payment functionality, please configure your Stripe environment variables.
          </p>
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <div className="text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Create a Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">stripe.com</a></li>
                <li>Go to the Developers section in your Stripe Dashboard</li>
                <li>Copy your API keys (publishable key and secret key)</li>
                <li>Set up a webhook endpoint for your application</li>
                <li>Update your <code className="bg-gray-200 px-1 rounded">.env.local</code> file with:</li>
              </ol>
              <div className="mt-3 bg-gray-800 text-gray-100 p-3 rounded text-xs font-mono">
                <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                <div>STRIPE_SECRET_KEY=sk_test_...</div>
                <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Then restart your development server.
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-yellow-700">
                  For testing, use Stripe's test cards like <code className="bg-yellow-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiration date and any CVC.
                </p>
              </div>
            </div>
          </div>
          
          <a
            href="https://stripe.com/docs/testing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            View Stripe testing documentation
            <ExternalLink size={14} />
          </a>
          
          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};