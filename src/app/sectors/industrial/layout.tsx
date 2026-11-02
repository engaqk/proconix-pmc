import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Industrial Construction Project Governance Africa | Proconix",
  description: "Owner-side construction project governance for factories, plants and industrial parks in Africa, across the full EPCM lifecycle.",
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.proconixpmc.com/sectors/industrial' },
  openGraph: {
    title: 'Industrial | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Industrial.',
    url: 'https://www.proconixpmc.com/sectors/industrial',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
