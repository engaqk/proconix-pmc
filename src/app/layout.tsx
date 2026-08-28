import type { Metadata } from 'next';
import './globals.css';
import InstallPrompt from './InstallPrompt';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

export const metadata: Metadata = {
  title: 'Construction Project Governance in Africa | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M–$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0B1D35',
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
        <link rel="icon" href="/icon.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.jpg" />
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Proconix PMC",
    "url": "https://www.proconixpmc.com",
    "logo": "https://www.proconixpmc.com/icon.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/talibkhanjipmp/",
      "https://www.instagram.com/talibkhanji_pmp/"
    ],
    "areaServed": ["Tanzania", "Zanzibar", "Kenya", "Zambia", "Uganda"]
  }
) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Talibbhai Khanji",
    "jobTitle": "Founder & Principal Consultant",
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "P.Eng Civil (ERB Tanzania & Zambia)"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "MBA"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "PMP®"
      }
    ],
    "sameAs": "https://www.linkedin.com/in/talibkhanjipmp/"
  }
) }}
        />

      </head>
      <body>
        {children}
        <InstallPrompt />
        <FloatingWhatsApp />
        <ScrollToTop />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
              });
              
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(reg => {
                    console.log('SW registered:', reg);
                  }).catch(err => {
                    console.log('SW reg error:', err);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
