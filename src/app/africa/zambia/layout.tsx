import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zambia | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Zambia.',
  alternates: { canonical: 'https://www.proconixpmc.com/africa/zambia' },
  openGraph: {
    title: 'Zambia | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Zambia.',
    url: 'https://www.proconixpmc.com/africa/zambia',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
