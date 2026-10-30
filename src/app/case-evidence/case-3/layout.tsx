import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial Construction Governance — Zambia | Proconix',
  description: 'Multi-EPC industrial build in Zambia brought into a single sponsor-facing control environment across civil, structural, MEP and infrastructure.',
  alternates: { canonical: 'https://www.proconixpmc.com/case-evidence/case-3' },
  openGraph: {
    title: 'Industrial Construction Governance — Zambia | Proconix',
    description: 'Multi-EPC industrial build in Zambia brought into a single sponsor-facing control environment across civil, structural, MEP and infrastructure.',
    url: 'https://www.proconixpmc.com/case-evidence/case-3',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
