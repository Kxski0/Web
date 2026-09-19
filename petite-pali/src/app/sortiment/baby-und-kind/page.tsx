import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { MATERIALS, ORIGIN, SIZES } from '@/content/facts';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Baby- & Kindermode',
  description:
    'Babymode und Kindermode bis Größe 122 in Köln: Naturfasern, europäische Herkunft, einzeln ausgesucht — bei Petite Pali am Chlodwigplatz.',
  path: '/sortiment/baby-und-kind/',
  image: '/images/outfit-kind.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Baby & Kind', path: '/sortiment/baby-und-kind/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Bis zu welcher Größe geht das Sortiment?',
    answer: `Bis Größe ${SIZES.to} — das entspricht etwa dem Grundschulalter.`,
  },
  {
    question: 'Kann man etwas zurücklegen lassen?',
    answer:
      'Bei einem einzelnen Teil lässt sich das meist einrichten. Fragen Sie im Laden oder am Telefon.',
  },
  {
    question: 'Gibt es einen Onlineshop?',
    answer:
      'Nein. Petite Pali ist ein Ladengeschäft. Diese Seite zeigt, was es gibt — gekauft wird vor Ort, wo sich Stoff und Schnitt beurteilen lassen.',
  },
];

/*
 * Modus: Persuade. Zeigen, was es gibt — entschieden wird im Laden.
 */
export default function BabyUndKind() {
  return (
    <>
      <PageHero
        label={`Baby & Kind · bis Größe ${SIZES.to}`}
        lines={['Vom ersten Body', 'bis zur Grundschule.']}
        lede="Bodys, Strampler, Hosen, Kleider, Strickjacken, Jacken. Zusammengestellt als Outfits statt als Stapel — damit sich im Laden sehen lässt, was zusammenpasst."
        trail={TRAIL}
        image={IMAGES.outfitKind}
      />

      <Prose title="Was das Sortiment ausmacht">
        <ul>
          <li>
            <strong>Naturfasern.</strong> {MATERIALS.join(', ')} — Material, das atmet, weil es
            den ganzen Tag an der Haut liegt.
          </li>
          <li>
            <strong>Europäische Herkunft.</strong> {ORIGIN.share} der Ware kommt aus {ORIGIN.where}.
          </li>
          <li>
            <strong>Kurze Wege im Laden.</strong> Sortiert wird nach Größe, nicht nach Marke — so
            wird tatsächlich gesucht.
          </li>
        </ul>
      </Prose>

      <MediaBand
        slot={IMAGES.wareTisch}
        caption="Nach Größen sortiert: der Tisch in der Mitte des Ladens."
      />

      <Prose title="Beratung, wenn sie gewünscht ist" tinted>
        <p>
          Wer zum ersten Mal eine Erstausstattung zusammenstellt, hat meist mehr Fragen als Zeit.
          Genau dafür ist der Laden da: Größen einschätzen, Mengen einschätzen, aussortieren, was
          man wirklich nicht braucht.
        </p>
        <p>Wer nur schauen möchte, wird nicht angesprochen. Beides ist in Ordnung.</p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Sehen Sie es sich an."
        body="Stoff, Schnitt und Farbe entscheiden sich in der Hand, nicht auf dem Bildschirm."
      />
    </>
  );
}
