import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hybrid Governance Model | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hybrid Governance Model.',
  alternates: { canonical: 'https://www.proconixpmc.com/services/hybrid-governance-model' },
  openGraph: {
    title: 'Hybrid Governance Model | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hybrid Governance Model.',
    url: 'https://www.proconixpmc.com/services/hybrid-governance-model',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
