import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import { Hero } from '@/components/hero/Hero';
import { Willkommen } from '@/components/sections/Willkommen';
import { Sortiment } from '@/components/sections/Sortiment';
import { Stages } from '@/components/stages/Stages';
import { Secondhand } from '@/components/sections/Secondhand';
import { ImLaden } from '@/components/sections/ImLaden';
import { Marken } from '@/components/sections/Marken';
import { Besuch } from '@/components/sections/Besuch';

/*
 * Auch die Startseite braucht ihr eigenes Canonical — das Layout setzt nur die
 * metadataBase, kein Canonical, und ohne diesen Export bliebe die wichtigste
 * Seite die einzige ohne.
 */
export const metadata = pageMetadata({
  title: `${SITE.name} — ${SITE.descriptor} in Köln`,
  description: SITE.description,
  path: '/',
  image: '/images/hero-poster.webp',
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <Hero /> {/* 01 */}
      <Willkommen /> {/* 02 */}
      <Sortiment /> {/* 03 */}
      <Stages /> {/* 04 — Signature */}
      <Secondhand /> {/* 05 */}
      <ImLaden /> {/* 06 */}
      <Marken /> {/* 07 — rendert null ohne belegte Marken */}
      <Besuch /> {/* 08 */}
    </>
  );
}
