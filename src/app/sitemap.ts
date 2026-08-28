import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.proconixpmc.com', lastModified: new Date() },
    { url: 'https://www.proconixpmc.com/governance-diagnostic-tools', lastModified: new Date() }
  ];
}
