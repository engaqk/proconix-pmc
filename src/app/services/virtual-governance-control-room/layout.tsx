import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Governance Control Room™ | Proconix PMC Africa',
  description: 'Remote construction project governance for GCC, diaspora and cross-border sponsors with construction projects in Africa.',
  alternates: { canonical: 'https://www.proconixpmc.com/services/virtual-governance-control-room' },
  openGraph: {
    title: 'Virtual Governance Control Room™ | Proconix PMC Africa',
    description: 'Remote construction project governance for GCC, diaspora and cross-border sponsors with construction projects in Africa.',
    url: 'https://www.proconixpmc.com/services/virtual-governance-control-room',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
