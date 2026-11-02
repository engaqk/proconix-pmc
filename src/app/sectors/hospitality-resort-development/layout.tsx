import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hotel Construction Project Governance in Africa | Proconix",
  description: "Owner-side construction project governance for hotel, resort and serviced-apartment sponsors in Africa — from inception to operator handover.",
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.proconixpmc.com/sectors/hospitality-resort-development' },
  openGraph: {
    title: 'Hospitality Resort Development | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hospitality Resort Development.',
    url: 'https://www.proconixpmc.com/sectors/hospitality-resort-development',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
