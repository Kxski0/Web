import { Kategorien } from '@/components/sections/Kategorien';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { MATERIALS, ORIGIN, SIZES } from '@/content/facts';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sortiment',
  description:
    'Frühchenmode ab Größe 44, Baby- und Kindermode bis Größe 122, Umstandsmode, Tragehilfen, Kinderwagen und Geschenke — das Sortiment von Petite Pali in der Kölner Südstadt.',
  path: '/sortiment/',
  image: '/images/ware-tisch.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
];

export default function Sortiment() {
  return (
    <>
      <PageHero
        label="Sortiment"
        lines= {['Handverlesen,', 'nicht eingekauft.']}
        lede={`Von Größe ${SIZES.from} bis ${SIZES.to}, dazu Umstandsmode, Tragehilfen und Kinderwagen. Jedes Teil wird einzeln entschieden — was sich im Laden nicht begründen lässt, wird nicht bestellt.`}
        trail={TRAIL}
        image={IMAGES.wareTisch}
      />

      <Prose title="Woran wir es messen">
        <ul>
          <li>
            <strong>Material.</strong> {MATERIALS.join(', ')} — Naturfasern, weil sie an der Haut
            liegen und nicht nur auf dem Etikett stehen.
          </li>
          <li>
            <strong>Herkunft.</strong> {ORIGIN.share} der Ware kommt aus {ORIGIN.where}.
          </li>
          <li>
            <strong>Alltag.</strong> Was den fünften Waschgang nicht übersteht, kommt nicht ins
            Regal. Kinderkleidung ist Arbeitskleidung.
          </li>
          <li>
            <strong>Selbermachen.</strong> Schnitte, die ein Kind allein anbekommt — das spart
            jeden Morgen eine Diskussion.
          </li>
        </ul>
      </Prose>

      <Kategorien />

      <PageCta
        title="Am besten kurz vorbeischauen."
        body="Was gerade in welcher Größe da ist, wechselt wöchentlich. Ein Anruf klärt es in einer Minute — ein Besuch in noch weniger."
      />
    </>
  );
}
