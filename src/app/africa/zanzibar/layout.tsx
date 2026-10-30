import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zanzibar | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Zanzibar.',
  alternates: { canonical: 'https://www.proconixpmc.com/africa/zanzibar' },
  openGraph: {
    title: 'Zanzibar | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Zanzibar.',
    url: 'https://www.proconixpmc.com/africa/zanzibar',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
