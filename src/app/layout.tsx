import { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SupabaseSetupNotice } from '@/components/SupabaseSetupNotice';
import { StripeSetupNotice } from '@/components/StripeSetupNotice';

export const metadata: Metadata = {
  title: 'Accounting App',
  description: 'Manage your finances with our powerful accounting tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-inter">
        <AuthProvider>
          <SupabaseSetupNotice />
          <StripeSetupNotice />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}