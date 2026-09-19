import type { Metadata } from 'next';
import { SITE } from '@/content/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  /**
   * Umgeht die Titelvorlage „%s | Petite Pali“ aus dem Layout. Nur für die
   * Startseite gedacht, deren Titel den Markennamen bereits enthält — sonst
   * stünde er zweimal darin.
   */
  absoluteTitle?: boolean;
};

/** Jede Seite bekommt eigenen Titel, eigene Beschreibung und eigenes Canonical. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = new URL(path, SITE.url).toString();
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url,
      images: [{ url: new URL(image ?? '/images/laden-tisch.webp', SITE.url).toString() }],
    },
  };
}
