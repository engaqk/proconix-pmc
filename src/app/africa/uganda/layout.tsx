import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uganda | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Uganda.',
  alternates: { canonical: 'https://www.proconixpmc.com/africa/uganda' },
  openGraph: {
    title: 'Uganda | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Uganda.',
    url: 'https://www.proconixpmc.com/africa/uganda',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
