import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Umstands- & Stillmode',
  description:
    'Schwangerschaftsmode und Stillmode in Köln: bequeme Schnitte aus Naturfasern, im selben Laden wie die Erstausstattung — Petite Pali am Chlodwigplatz.',
  path: '/sortiment/fuer-mama/',
  image: '/images/boutique-regalwand.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Für Mama', path: '/sortiment/fuer-mama/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Führt ihr auch Stillmode?',
    answer:
      'Ja — Umstands- und Stillmode gehören hier zusammen, weil die Zeit davor und danach zusammengehört.',
  },
  {
    question: 'Kann ich in Ruhe anprobieren?',
    answer:
      'Ja. Wenn es Ihnen lieber ist, ganz ohne anderen Betrieb im Laden: dafür gibt es den Shopping-Termin.',
  },
];

/*
 * Modus: Persuade. Die Handlung ist der ruhige Anprobetermin.
 */
export default function FuerMama() {
  return (
    <>
      <PageHero
        label="Für Mama · Schwangerschaft & Stillzeit"
        lines={['Schwanger.', 'Schön. Du.']}
        lede="Umstands- und Stillmode im selben Laden wie die Erstausstattung. Wer für das Kind kommt, muss für sich selbst nicht noch woanders hin."
        trail={TRAIL}
        image={IMAGES.boutiqueRegalwand}
      />

      <Prose title="Dieselben Maßstäbe">
        <p>
          Was für die Kindersachen gilt, gilt hier auch: Naturfasern, ordentliche Schnitte, Teile,
          die nach dem Waschen noch sitzen. Schwangerschaftsmode ist kein Zwischenlager — sie wird
          neun Monate lang jeden Tag getragen.
        </p>
        <p>
          Und sie soll danach nicht sofort unbrauchbar sein. Was sich weitertragen lässt, ist uns
          lieber als das, was nur für einen Sommer gedacht ist.
        </p>
      </Prose>

      <MediaBand
        slot={IMAGES.boutiqueAuswahl}
        caption="Im Laden steht alles nebeneinander — für das Kind und für Sie."
        width="narrow"
      />

      <Faq entries={FAQ} />

      <PageCta
        title="Kommen Sie in Ruhe vorbei."
        body="Für die Anprobe ist ein ruhiger Laden mehr wert als eine große Auswahl. Ein Termin lässt sich einrichten."
      />
    </>
  );
}
