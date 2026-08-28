import type { MetadataRoute } from 'next';
import { leistungen } from '@/content/leistungen';

const basis = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energie-zentrum-saar.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const statisch = ['', '/leistungen', '/unternehmen', '/jobs', '/kontakt', '/impressum', '/datenschutz'];
  const stand = new Date();

  return [
    ...statisch.map((pfad) => ({
      url: `${basis}${pfad}`,
      lastModified: stand,
      // Startseite und Leistungsuebersicht sind die Einstiegspunkte.
      priority: pfad === '' ? 1 : pfad === '/leistungen' ? 0.9 : 0.5,
    })),
    ...leistungen.map((l) => ({
      url: `${basis}/${l.slug}`,
      lastModified: stand,
      priority: 0.8,
    })),
  ];
}
