import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent Mission Control | Big Bang Interactive',
  description: 'Secure dashboard for managing AI agents',
  keywords: ['agents', 'AI', 'dashboard', 'mission control'],
  authors: [{ name: 'Big Bang Interactive' }],
  themeColor: '#1f2937',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Agent Mission Control',
    description: 'Secure dashboard for managing AI agents',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
