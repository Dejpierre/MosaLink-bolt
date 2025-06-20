import { StrictMode } from 'react';
import '../styles/index.css';
import '../styles/custom.css';

export const metadata = {
  title: 'Bento Grid Editor',
  description: 'A premium Bento Grid editor with complete Stripe subscription management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&family=Lora:wght@400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StrictMode>
          {children}
        </StrictMode>
      </body>
    </html>
  );
}