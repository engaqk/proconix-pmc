import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.proconixpmc.com';
  const routes = [
    '',
    '/construction-project-governance',
    '/construction-project-risk-calculator',
    '/about-talibbhai-khanji',
    '/faq',
    '/executive-governance-briefing-call',
    '/case-evidence/case-1',
    '/case-evidence/case-2',
    '/case-evidence/case-3',
    '/services/virtual-governance-control-room',
    '/resources/pre-construction-governance-checklist',
    '/contact'
  ];

  return routes.map((route) => ({
    url: baseUrl + route,
    lastModified: new Date('2026-10-31T00:00:00.000Z'),
  }));
}
