'use client';

import React from 'react';
import { PricingTable } from '../../components/subscription/PricingTable';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
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
        </motion.div>
        
        <PricingTable />
      </div>
    </div>
  );
}