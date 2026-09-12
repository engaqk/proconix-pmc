import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospitality Resort Development | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hospitality Resort Development.',
  alternates: { canonical: 'https://www.proconixpmc.com/sectors/hospitality-resort-development' },
  openGraph: {
    title: 'Hospitality Resort Development | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Hospitality Resort Development.',
    url: 'https://www.proconixpmc.com/sectors/hospitality-resort-development',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
