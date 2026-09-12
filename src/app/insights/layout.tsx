import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Project Governance Insights | Proconix PMC',
  description: 'Field notes on cost overruns, variation claims and procurement risk on African construction projects — written for project sponsors.',
  alternates: { canonical: 'https://www.proconixpmc.com/insights' },
  openGraph: {
    title: 'Construction Project Governance Insights | Proconix PMC',
    description: 'Field notes on cost overruns, variation claims and procurement risk on African construction projects — written for project sponsors.',
    url: 'https://www.proconixpmc.com/insights',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg' }],
  },
  twitter: { card: 'summary_large_image' }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
