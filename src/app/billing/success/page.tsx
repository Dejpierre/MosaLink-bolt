'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!session_id) return;

    // In a real application, you would verify the session here
    console.log('Subscription successful with session ID:', session_id);

    // Auto-redirect after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session_id, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your subscription. Your account has been upgraded successfully.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">
            You will be redirected to the dashboard in <span className="font-bold text-indigo-600">{countdown}</span> seconds.
          </p>
        </div>

        <Link href="/" passHref>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}