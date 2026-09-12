import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial | Proconix PMC',
  description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Industrial.',
  alternates: { canonical: 'https://www.proconixpmc.com/sectors/industrial' },
  openGraph: {
    title: 'Industrial | Proconix PMC',
    description: 'Sponsor-aligned construction project governance for $5M-$100M+ CAPEX projects in Africa. Learn more about Industrial.',
    url: 'https://www.proconixpmc.com/sectors/industrial',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
