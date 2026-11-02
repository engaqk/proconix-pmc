import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hybrid Governance Model™ | Proconix PMC",
  description: "Remote construction project governance with planned on-site presence, for sponsors with construction projects in Africa.",
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.proconixpmc.com/services/hybrid-governance-model' },
  openGraph: {
    title: 'Hybrid Governance Model | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hybrid Governance Model.',
    url: 'https://www.proconixpmc.com/services/hybrid-governance-model',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
