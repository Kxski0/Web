import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { Button } from '@/components/ui/Button';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Dies & Das',
  description:
    'Geschenke zur Geburt, Kuscheltiere, Spieluhren, Holzspielzeug und Karten — ausgesucht bei Petite Pali in der Kölner Südstadt.',
  path: '/sortiment/dies-das/',
  image: '/images/ware-regal.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Dies & Das', path: '/sortiment/dies-das/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Verpackt ihr Geschenke?',
    answer: 'Ja, solange Sie im Laden sind.',
  },
  {
    question: 'Ich weiß nicht, was ich schenken soll.',
    answer:
      'Dann sagen Sie uns, für wen und zu welchem Anlass — wir stellen etwas zusammen. Das ist der häufigste Grund, warum Leute hereinkommen.',
  },
  {
    question: 'Gibt es Gutscheine?',
    answer:
      'Ja. Wie es abläuft, steht auf der Gutschein-Seite — wir stellen ihn persönlich aus, es gibt keinen automatischen Versand.',
  },
];

/*
 * Modus: Persuade. Die Handlung ist der Besuch oder der Gutschein.
 */
export default function DiesDas() {
  return (
    <>
      <PageHero
        label="Dies & Das · Geschenke & Accessoires"
        lines={['Für den Besuch', 'nach der Geburt.']}
        lede="Kuscheltiere, Spieluhren, Holzspielzeug, Karten und Kleinigkeiten — ausgesucht danach, ob sie ein zweites und drittes Jahr überstehen."
        trail={TRAIL}
        image={IMAGES.wareRegal}
        actions={<Button href="/gutschein/" variant="secondary">Gutschein verschenken</Button>}
      />

      <Prose title="Was hier steht">
        <p>
          Spielzeug wird danach ausgesucht, ob es benutzt wird — nicht danach, wie es in der
          Verpackung aussieht. Das schließt einiges aus und macht die Auswahl kleiner.
        </p>
        <p>
          Dafür kann Ihnen zu jedem Teil jemand sagen, woher es kommt und warum es hier liegt.
        </p>
      </Prose>

      <MediaBand
        slot={IMAGES.boutiqueDetail}
        caption="Manches bleibt jahrelang — und sitzt irgendwann oben auf dem Regal."
        width="narrow"
      />

      <Faq entries={FAQ} />

      <PageCta
        title="Sagen Sie uns, für wen."
        body="Anlass und Alter genügen — den Rest stellen wir zusammen, während Sie im Laden stehen."
      />
    </>
  );
}
