import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'OpportunityScout AI — Connecting Ideas, Businesses, and Talent with Investors',
  description:
    'AI-powered investment opportunity discovery and matching platform. Find, connect, and grow.',
  keywords: ['investment', 'opportunities', 'startup', 'funding', 'investor', 'business', 'AI'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main id="main-content">{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
