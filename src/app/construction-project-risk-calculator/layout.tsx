import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Project Risk Exposure Calculator | Proconix',
  description: 'Assess construction project risk exposure by CAPEX band and sector. Built for real estate, hospitality and industrial sponsors in Africa.',
  alternates: { canonical: 'https://www.proconixpmc.com/construction-project-risk-calculator' },
  openGraph: {
    title: 'Construction Project Risk Exposure Calculator | Proconix',
    description: 'Assess construction project risk exposure by CAPEX band and sector. Built for real estate, hospitality and industrial sponsors in Africa.',
    url: 'https://www.proconixpmc.com/construction-project-risk-calculator',
    images: [{ url: 'https://www.proconixpmc.com/icon.jpg', width: 800, height: 800, alt: 'Proconix PMC', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://www.proconixpmc.com/icon.jpg'] }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
