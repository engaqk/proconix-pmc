import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Is Construction Project Governance? | Proconix PMC',
  description: 'How sponsor-aligned construction project governance protects CAPEX on $5M–$100M+ projects in Africa, across the full EPCM lifecycle.',
  alternates: { canonical: 'https://www.proconixpmc.com/construction-project-governance' },
  openGraph: {
    title: 'What Is Construction Project Governance? | Proconix PMC',
    description: 'How sponsor-aligned construction project governance protects CAPEX on $5M–$100M+ projects in Africa, across the full EPCM lifecycle.',
    url: 'https://www.proconixpmc.com/construction-project-governance',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
