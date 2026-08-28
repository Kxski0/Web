import type { MetadataRoute } from 'next';
import { basisUrl, istProduktion } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Deployments werden vollstaendig gesperrt — siehe app/layout.tsx.
  if (!istProduktion) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${basisUrl}/sitemap.xml`,
  };
}
