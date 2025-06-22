import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SupabaseSetupNotice } from '@/components/SupabaseSetupNotice';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bento Grid App',
  description: 'Create beautiful bento grid layouts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SupabaseSetupNotice />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}