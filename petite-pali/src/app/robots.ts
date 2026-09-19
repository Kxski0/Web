import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { INDEXABLE } from '@/lib/env';

/**
 * Geschlossen als Standard, nicht offen. Solange SITE_INDEXABLE nicht
 * ausdrücklich auf "true" steht, ist die gesamte Seite gesperrt — und die
 * Sitemap wird gar nicht erst genannt.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
  };
}
