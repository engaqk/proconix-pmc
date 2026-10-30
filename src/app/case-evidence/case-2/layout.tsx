import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Residential Construction Governance Rescue — Tanzania',
  description: 'Governance installed mid-construction on a Tanzanian residential development: cost reporting, schedule baseline and procurement control restored.',
  alternates: { canonical: 'https://www.proconixpmc.com/case-evidence/case-2' },
  openGraph: {
    title: 'Residential Construction Governance Rescue — Tanzania',
    description: 'Governance installed mid-construction on a Tanzanian residential development: cost reporting, schedule baseline and procurement control restored.',
    url: 'https://www.proconixpmc.com/case-evidence/case-2',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
