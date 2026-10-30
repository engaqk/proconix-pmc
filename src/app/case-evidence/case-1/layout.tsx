import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resort Construction Governance — Zanzibar | Proconix PMC',
  description: 'Governance architecture installed before contractor mobilisation on a high-specification Zanzibar resort with an international operator commitment.',
  alternates: { canonical: 'https://www.proconixpmc.com/case-evidence/case-1' },
  openGraph: {
    title: 'Resort Construction Governance — Zanzibar | Proconix PMC',
    description: 'Governance architecture installed before contractor mobilisation on a high-specification Zanzibar resort with an international operator commitment.',
    url: 'https://www.proconixpmc.com/case-evidence/case-1',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
