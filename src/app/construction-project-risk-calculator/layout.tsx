import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Project Governance Tools | Proconix PMC',
  description: 'Construction project governance tools for real estate, hospitality and industrial project sponsors with construction projects in Africa — visibility of cost, schedule and quality.',
  alternates: { canonical: 'https://www.proconixpmc.com/construction-project-risk-calculator' },
  openGraph: {
    title: 'Construction Project Governance Tools | Proconix PMC',
    description: 'Construction project governance tools for real estate, hospitality and industrial project sponsors with construction projects in Africa — visibility of cost, schedule and quality.',
    url: 'https://www.proconixpmc.com/construction-project-risk-calculator',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
