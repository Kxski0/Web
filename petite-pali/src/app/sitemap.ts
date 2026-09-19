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
  { path: '/sortiment/', priority: 0.9 },
  { path: '/sortiment/fruehchen/', priority: 0.8 },
  { path: '/sortiment/baby-und-kind/', priority: 0.8 },
  { path: '/sortiment/fuer-mama/', priority: 0.8 },
  { path: '/sortiment/tragehilfen/', priority: 0.8 },
  { path: '/sortiment/kinderwagen/', priority: 0.8 },
  { path: '/sortiment/dies-das/', priority: 0.7 },
  { path: '/shopping-termin/', priority: 0.8 },
  { path: '/gutschein/', priority: 0.7 },
  { path: '/ueber-uns/', priority: 0.6 },
  { path: '/galerie/', priority: 0.5 },
  { path: '/aktuelles/', priority: 0.5 },
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
