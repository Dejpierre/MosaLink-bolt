import { Metadata } from 'next';
import { AuthProvider } from '../components/auth/AuthProvider';
import '../index.css';

export const metadata: Metadata = {
  title: 'Bento Grid Editor',
  description: 'Create beautiful bento grids with intuitive drag-and-drop',
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}