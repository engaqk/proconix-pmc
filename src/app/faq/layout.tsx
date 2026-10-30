import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Project Governance FAQ — Africa | Proconix',
  description: 'Answers to the questions project sponsors ask before appointing a construction project governance partner for a project in Africa.',
  alternates: { canonical: 'https://www.proconixpmc.com/faq' },
  openGraph: {
    title: 'Construction Project Governance FAQ — Africa | Proconix',
    description: 'Answers to the questions project sponsors ask before appointing a construction project governance partner for a project in Africa.',
    url: 'https://www.proconixpmc.com/faq',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
