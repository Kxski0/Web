import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { Button } from '@/components/ui/Button';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { STROLLER } from '@/content/facts';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Kinderwagen',
  description:
    'Kinderwagen in Köln ansehen und ausprobieren: Petite Pali ist einer der exklusiven BEQOONI®-Showrooms — schieben, falten, testen statt nur bestellen.',
  path: '/sortiment/kinderwagen/',
  image: '/images/boutique-gang.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Kinderwagen', path: '/sortiment/kinderwagen/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Kann ich den Wagen ausprobieren?',
    answer:
      'Dafür ist der Showroom da: schieben, falten, hochheben. Wenn Sie mögen, bringen Sie zum Falten-Test die Maße Ihres Kofferraums mit.',
  },
  {
    question: 'Beraten Sie auch, wenn ich mich noch gar nicht entschieden habe?',
    answer:
      'Gerade dann. Die Frage ist nie „welcher Wagen ist der beste", sondern „welcher passt zu Ihrem Alltag".',
  },
  {
    question: 'Brauche ich einen Termin?',
    answer:
      'Nicht zwingend. Für eine ausführliche Beratung ist ein Termin aber angenehmer — für Sie und für uns.',
  },
];

/*
 * Modus: Persuade. Die Handlung ist das Ausprobieren vor Ort.
 */
export default function Kinderwagen() {
  return (
    <>
      <PageHero
        label="Kinderwagen · vor Ort entdecken"
        lines={['Nicht nur anschauen.', 'Ausprobieren.']}
        lede={`Petite Pali ist ${STROLLER.role}. Das heißt: ${STROLLER.brand} steht hier nicht als Bild in einem Prospekt, sondern als Wagen im Laden.`}
        trail={TRAIL}
        image={IMAGES.boutiqueGang}
        actions={<Button href="/shopping-termin/">Termin vereinbaren</Button>}
      />

      <Prose title="Was sich nur vor Ort klärt">
        <ul>
          <li>
            <strong>Schieben.</strong> Über Kopfsteinpflaster fährt sich jeder Wagen anders als
            über Laminat.
          </li>
          <li>
            <strong>Falten.</strong> Einhändig, mit Kind auf dem Arm — oder eben nicht.
          </li>
          <li>
            <strong>Heben.</strong> Das Gewicht steht im Datenblatt. Wie es sich im Treppenhaus
            anfühlt, nicht.
          </li>
          <li>
            <strong>Verstauen.</strong> Passt er in den Kofferraum? Die einzige ehrliche Antwort
            ist: einmal hineinstellen.
          </li>
        </ul>
      </Prose>

      <MediaBand
        slot={IMAGES.boutiqueMitte}
        caption="Im Laden ist Platz, einen Wagen ein paar Meter zu schieben."
      />

      <Prose title="Zu Modellen, Preisen und Verfügbarkeit" tinted>
        <p>
          Dazu steht hier bewusst nichts. Ausstattung und Verfügbarkeit ändern sich, und eine
          Angabe, die im Laden nicht mehr stimmt, ist schlechter als keine.
        </p>
        <p>
          Rufen Sie an oder kommen Sie vorbei — dann bekommen Sie den Stand von heute statt den
          von vorletztem Monat.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Einmal selbst schieben."
        body="Zehn Minuten im Laden beantworten mehr Fragen als jede Produktseite."
      />
    </>
  );
}
