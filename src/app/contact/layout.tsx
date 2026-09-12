import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Contact.',
  alternates: { canonical: 'https://www.proconixpmc.com/contact' },
  openGraph: {
    title: 'Contact | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Contact.',
    url: 'https://www.proconixpmc.com/contact',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
