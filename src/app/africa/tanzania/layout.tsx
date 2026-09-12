import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Project Management Consultant Tanzania',
  description: 'Owner\'s-side construction project governance for $5M–$100M+ CAPEX projects in Tanzania. ERB-registered, sponsor-aligned, on the ground since 2010.',
  alternates: { canonical: 'https://www.proconixpmc.com/africa/tanzania' },
  openGraph: {
    title: 'Construction Project Management Consultant Tanzania',
    description: 'Owner\'s-side construction project governance for $5M–$100M+ CAPEX projects in Tanzania. ERB-registered, sponsor-aligned, on the ground since 2010.',
    url: 'https://www.proconixpmc.com/africa/tanzania',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
