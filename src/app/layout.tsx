import type { Metadata } from 'next';
import './globals.css';
import InstallPrompt from './InstallPrompt';
import FloatingWhatsApp from './FloatingWhatsApp';

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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        {children}
        <InstallPrompt />
        <FloatingWhatsApp />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`
          }}
        />
      </body>
    </html>
  );
}
