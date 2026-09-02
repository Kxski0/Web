import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { INDEXABLE } from '@/lib/env';

/**
 * Closed by default. Until SITE_INDEXABLE is explicitly set on a deployment,
 * every path is disallowed — a preview build, or a production build whose legal
 * pages are still incomplete, has no business in a search index.
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
