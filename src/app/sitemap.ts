import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.proconixpmc.com';
  const routes = [
    '',
    '/construction-project-governance',
    '/construction-project-risk-calculator',
    '/about-talibbhai-khanji',
    '/faq',
    '/insights',
    '/executive-governance-briefing-call',
    '/case-evidence/case-1',
    '/case-evidence/case-2',
    '/case-evidence/case-3',
    '/africa/tanzania',
    '/africa/kenya',
    '/africa/uganda',
    '/africa/zambia',
    '/africa/zanzibar',
    '/services/virtual-governance-control-room',
    '/services/full-on-site-governance-command',
    '/services/hybrid-governance-model',
    '/resources/pre-construction-governance-checklist',
    '/sectors/hospitality-resort-development',
    '/sectors/industrial',
    '/sectors/real-estate',
    '/contact'
  ];

  return routes.map((route) => ({
    url: baseUrl + route,
    lastModified: new Date(),
  }));
}
