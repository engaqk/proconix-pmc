import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import InstallPrompt from './InstallPrompt';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';
import AutoUpdater from './AutoUpdater';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.proconixpmc.com'),
  title: 'Construction Project Governance in Africa | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://www.proconixpmc.com/',
  },
  openGraph: {
    title: 'Construction Project Governance in Africa | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
    url: 'https://www.proconixpmc.com/',
    siteName: 'Proconix PMC',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.proconixpmc.com/icon.jpg',
        width: 800,
        height: 800,
        alt: 'Proconix PMC - Sponsor-Aligned Construction Project Governance in Africa',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Project Governance in Africa | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
    images: ['https://www.proconixpmc.com/icon.jpg'],
  },
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
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-5PXL0HYWJK" />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5PXL0HYWJK');
        `}} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta property="og:image" content="https://www.proconixpmc.com/icon.jpg" />
        <meta property="og:image:secure_url" content="https://www.proconixpmc.com/icon.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Proconix PMC Logo" />
      
                <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.proconixpmc.com/#organization",
    "name": "Proconix PMC",
    "legalName": "Proconix Project Management Consultancy",
    "url": "https://www.proconixpmc.com/",
    "logo": "https://www.proconixpmc.com/icon.jpg",
    "slogan": "Sponsor-Aligned Construction Project Governance in Africa",
    "description": "Proconix PMC is an owner-side construction project delivery partner for real estate, hospitality and industrial project sponsors and investors with construction projects in Africa. We direct, manage and execute end-to-end construction project governance across the full EPCM lifecycle, from inception to successful handover, on projects from USD 5 million to over USD 100 million.",
    "founder": { "@id": "https://www.proconixpmc.com/#talibbhai-khanji" },
    "email": "info@proconixpmc.com",
    "telephone": "+255695964527",
    "areaServed": ["Tanzania", "Zanzibar", "Kenya", "Uganda", "Zambia", "Africa"],
    "knowsAbout": [
      "Construction project governance",
      "Owner-side construction project management",
      "EPCM lifecycle governance",
      "Construction cost overrun control",
      "Hospitality and resort construction projects",
      "Real estate construction projects",
      "Industrial construction projects"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/talibkhanjipmp/",
      "https://www.instagram.com/talibkhanji_pmp/"
    ]
  }
) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.proconixpmc.com/#talibbhai-khanji",
    "name": "Talibbhai Khanji",
    "alternateName": "TAK",
    "jobTitle": "Founder & Principal Consultant",
    "description": "Strategic Project Leader. Registered civil engineer (P.Eng Civil, ERB Tanzania & Zambia), MBA in Project Management and PMP®, with 19+ years of multinational experience, of which 15+ years are on the ground in Africa.",
    "worksFor": { "@id": "https://www.proconixpmc.com/#organization" },
    "url": "https://www.proconixpmc.com/about-talibbhai-khanji",
    "image": "https://www.proconixpmc.com/talibbhai.jpg",
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "license",
        "name": "P.Eng Civil — Engineers Registration Board (ERB), Tanzania & Zambia"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "MBA — Project Management"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "PMP® — Project Management Professional",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Project Management Institute (PMI), USA"
        }
      }
    ],
    "knowsAbout": [
      "Construction project governance",
      "EPCM",
      "Hospitality construction",
      "Real estate development",
      "Industrial construction"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/talibkhanjipmp/",
      "https://www.instagram.com/talibkhanji_pmp/"
    ]
  }
) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.proconixpmc.com/#website",
    "name": "Proconix PMC",
    "url": "https://www.proconixpmc.com/",
    "publisher": { "@id": "https://www.proconixpmc.com/#organization" },
    "inLanguage": "en",
    "dateModified": "2026-10-31"
  }
) }}
        />
      </head>
      <body>
        {children}
        <InstallPrompt />
        <FloatingWhatsApp />
        <ScrollToTop />
        <AutoUpdater />
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
        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#455065", padding: "10px 0 20px" }}>Last updated: 31 October 2026</div>
      </body>
    </html>
  );
}




