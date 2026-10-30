import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talibbhai Khanji — Strategic Project Leader | Proconix',
  description: 'P.Eng Civil (ERB Tanzania & Zambia), MBA, PMP®. 19+ years multinational experience, of which 15+ years Africa on-ground execution.',
  alternates: { canonical: 'https://www.proconixpmc.com/about-talibbhai-khanji' },
  openGraph: {
    title: 'Talibbhai Khanji — Strategic Project Leader | Proconix',
    description: 'P.Eng Civil (ERB Tanzania & Zambia), MBA, PMP®. 19+ years multinational experience, of which 15+ years Africa on-ground execution.',
    url: 'https://www.proconixpmc.com/about-talibbhai-khanji',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
