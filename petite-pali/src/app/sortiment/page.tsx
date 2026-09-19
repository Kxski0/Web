import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { KATEGORIEN } from '@/content/sortiment';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sortiment',
  description:
    'Babymode, Kindermode, Frühchengrößen, Umstandsmode, Spielzeug und Geschenke — was bei Petite Pali am Chlodwigplatz in Köln im Laden steht.',
  path: '/sortiment/',
  image: '/images/laden-tisch.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Führt ihr auch Frühchengrößen?',
    answer:
      'Ja, auch die Größen unterhalb der Neugeborenengröße. Welche davon gerade da sind, wechselt — ein kurzer Anruf spart den Weg.',
  },
  {
    question: 'Kann man etwas zurücklegen lassen?',
    answer:
      'Fragen Sie im Laden oder am Telefon. Bei einem einzelnen Teil lässt sich das meist einrichten.',
  },
  {
    question: 'Gibt es Geschenkgutscheine?',
    answer:
      'Dazu fragen Sie am besten direkt im Laden — was möglich ist, sagen wir Ihnen dort verbindlich.',
  },
  {
    question: 'Kann ich online bestellen?',
    answer:
      'Nein. Petite Pali ist ein Ladengeschäft ohne Onlineshop. Diese Seite zeigt, was es gibt, gekauft wird vor Ort.',
  },
];

export default function Sortiment() {
  return (
    <>
      <PageHero
        eyebrow="Sortiment"
        lines={['Was im Laden', 'steht.']}
        lede="Von der Frühchengröße bis zum Schulkind, dazu Umstandsmode, Spielzeug und Geschenke. Alles einzeln ausgesucht — und alles zum Anfassen."
        trail={TRAIL}
        image={IMAGES.ladenTisch}
      />

      {KATEGORIEN.map((k, i) => (
        <Prose key={k.id} title={k.title} align={i % 2 === 0 ? 'left' : 'right'} tinted={i % 2 === 1}>
          <p>{k.body}</p>
        </Prose>
      ))}

      <MediaBand
        slot={IMAGES.ladenRegal}
        caption="Kuscheltiere, Rucksäcke und Spieluhren stehen am Eingang — auf Kinderhöhe."
      />

      <Prose title="Was Sie hier nicht finden" align="right">
        <p>
          Keine Wühltische, keine Zwanzigerpackungen, keine Ware, die niemand erklären kann. Der
          Laden ist klein, und was hier Platz bekommt, muss ihn sich verdienen.
        </p>
        <p>
          Und: keinen Onlineshop. Was hier hängt, ändert sich wöchentlich — eine Bestellseite wäre
          nach zwei Tagen falsch.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Am besten kurz vorbeischauen."
        body="Ob eine bestimmte Größe da ist, lässt sich in einer Minute am Telefon klären — und im Laden in noch weniger."
      />
    </>
  );
}
