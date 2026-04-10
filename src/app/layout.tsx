import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Proconix PMC — Construction Project Governance in Africa | Talibbhai Khanji',
  description: 'Proconix PMC Directs, Manage, and Executes end-to-end construction project governance in Africa across the full EPCM lifecycle. $5M–$100M+ CAPEX. Real Estate, Hospitality & Industrial.',
  themeColor: '#0B1D35',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
