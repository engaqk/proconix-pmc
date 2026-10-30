import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Executive Governance Briefing Call | Proconix PMC',
  description: 'A structured conversation about your construction project\'s governance position in Africa, with Talibbhai Khanji, Strategic Project Leader.',
  alternates: { canonical: 'https://www.proconixpmc.com/executive-governance-briefing-call' },
  openGraph: {
    title: 'Executive Governance Briefing Call | Proconix PMC',
    description: 'A structured conversation about your construction project\'s governance position in Africa, with Talibbhai Khanji, Strategic Project Leader.',
    url: 'https://www.proconixpmc.com/executive-governance-briefing-call',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
