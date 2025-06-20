'use client';

import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store/useStore';

export default function Home() {
  const { importData } = useStore();

  useEffect(() => {
    // Check for import data in URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#import=')) {
      try {
        const encoded = hash.slice(8);
        const decoded = atob(encoded);
        importData(decoded);
        // Clear the hash after import
        window.history.replaceState(null, '', window.location.pathname);
      } catch (error) {
        console.error('Failed to import from URL:', error);
      }
    }
  }, [importData]);

  return <Layout />;
}