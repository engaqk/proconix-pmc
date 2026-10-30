import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pre-Construction Governance Checklist — Africa | Proconix',
  description: 'Before you break ground: a 13-area self-assessment for $5M–$100M+ CAPEX project sponsors in Africa. Know where you stand before mobilisation.',
  alternates: { canonical: 'https://www.proconixpmc.com/resources/pre-construction-governance-checklist' },
  openGraph: {
    title: 'Pre-Construction Governance Checklist — Africa | Proconix',
    description: 'Before you break ground: a 13-area self-assessment for $5M–$100M+ CAPEX project sponsors in Africa. Know where you stand before mobilisation.',
    url: 'https://www.proconixpmc.com/resources/pre-construction-governance-checklist',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
