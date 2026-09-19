import { Gallery } from '@/components/gallery/Gallery';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Galerie',
  description:
    'Aufnahmen aus der Boutique: Regale, Auslagen, Outfits und Details aus dem Laden von Petite Pali am Chlodwigplatz in Köln.',
  path: '/galerie/',
  image: '/images/boutique-regalwand.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Galerie', path: '/galerie/' },
];

/*
 * Modus: Experience. Die Besucherin ist im Gezeigten selbst — der Kopf ordnet
 * nur ein, die Bilder führen. Deshalb die knappe Fassung des Seitenkopfs.
 */
export default function Galerie() {
  return (
    <>
      <PageHero
        size="compact"
        label="Galerie"
        lines={['Ein Blick', 'in den Laden.']}
        lede="Alle Aufnahmen stammen aus der Boutique selbst — keine Kataloge, keine Stockfotos. Zum Vergrößern anklicken; mit den Pfeiltasten lässt sich blättern."
        trail={TRAIL}
      />

      <section style={{ paddingBottom: 'clamp(2rem, 6vw, 4rem)' }}>
        <div className="page-bounds">
          <Gallery />
        </div>
      </section>

      <PageCta
        title="In echt ist es schöner."
        body="Fotos zeigen die Regale. Wie sich der Stoff anfühlt, zeigt sich erst im Laden."
      />
    </>
  );
}
