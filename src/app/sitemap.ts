import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/**
 * Routes are listed explicitly as they ship. An entry pointing at a 404 is worse
 * than a missing entry, so nothing goes in here before the page exists.
 */
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/photovoltaik/', priority: 0.9 },
  { path: '/waermepumpe/', priority: 0.9 },
  { path: '/stromspeicher/', priority: 0.9 },
  { path: '/energiemanagement/', priority: 0.9 },
  { path: '/klima/', priority: 0.7 },
  { path: '/carports-terrassenueberdachungen/', priority: 0.7 },
  { path: '/projekte/', priority: 0.6 },
  { path: '/ueber-uns/', priority: 0.7 },
  { path: '/kontakt/', priority: 0.8 },
  // Legal pages are noindex; they stay out of the sitemap by design.
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE.url).toString(),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
