import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import InstallPrompt from './InstallPrompt';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

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

              <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Isn't Proconix just another project management consultant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We are the Strategic Project Leader with governance authority inside the project's decision structure. We prevent errors rather than just reporting them."
        }
      },
      {
        "@type": "Question",
        "name": "I already have a project manager and site engineers. Why do I need Proconix?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your site engineers execute. Your project manager coordinates. Neither carries governance authority to protect your capital. Proconix governs across cost, schedule, procurement, quality, risk, and stakeholder alignment."
        }
      },
      {
        "@type": "Question",
        "name": "What does a Proconix mandate actually cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mandate structure is discussed in the Executive Governance Briefing Call, after understanding the specific project."
        }
      },
      {
        "@type": "Question",
        "name": "My project is already under construction. Is it too late?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Governance installed mid-construction rescues projects at crisis point. The earlier governance is installed, the greater the protection for your capital."
        }
      },
      {
        "@type": "Question",
        "name": "I am based in the GCC / overseas. Can Proconix still govern my Africa project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. GCC-based, diaspora, and cross-border investors use our Virtual Governance Control Room and Hybrid Governance Model for real-time financial reporting, risk heatmaps, and procurement governance."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can Proconix mobilise?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Proconix accepts a maximum of four active Tier-1 mandates concurrently to ensure every mandate receives undivided senior governance attention. Mobilisation begins within the agreed window."
        }
      }
    ]
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




