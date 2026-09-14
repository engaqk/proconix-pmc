import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import InstallPrompt from './InstallPrompt';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

export const metadata: Metadata = {
  title: 'Construction Project Governance in Africa | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.proconixpmc.com/',
  },
  openGraph: {
    title: 'Construction Project Governance in Africa | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. We direct, manage and execute across the full EPCM lifecycle.',
    url: 'https://www.proconixpmc.com/',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
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




