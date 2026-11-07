import { MetadataRoute } from 'next';

// new Date() would mark this route dynamic, which static export rejects.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://opticode.se',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
