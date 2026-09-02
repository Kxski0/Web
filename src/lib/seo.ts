import type { Metadata } from 'next';
import { SITE } from '@/content/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

/** Every page gets its own title, description and canonical (§36). */
export function pageMetadata({ title, description, path, image }: PageMetaInput): Metadata {
  const url = new URL(path, SITE.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url,
      images: image ? [{ url: new URL(image, SITE.url).toString() }] : undefined,
    },
  };
}
