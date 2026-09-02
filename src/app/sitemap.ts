import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/** Routes are added here as they ship — an entry for a 404 is worse than none. */
const ROUTES = ['/'];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: new URL(route, SITE.url).toString(),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));
}
