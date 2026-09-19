import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/**
 * Ausdrückliche Liste statt automatischer Ableitung: Impressum und
 * Datenschutz tragen noindex und gehören deshalb nicht hinein. Eine
 * automatisch erzeugte Sitemap würde sie mitnehmen und der Suchmaschine zwei
 * widersprüchliche Signale geben.
 */
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/sortiment/', priority: 0.8 },
  { path: '/secondhand/', priority: 0.8 },
  { path: '/ueber-uns/', priority: 0.6 },
  { path: '/kontakt/', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE.url).toString(),
    lastModified,
    priority: route.priority,
  }));
}
