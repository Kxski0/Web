import type { MetadataRoute } from 'next';

const basis = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energie-zentrum-saar.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${basis}/sitemap.xml`,
  };
}
