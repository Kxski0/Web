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
  title: 'Tragehilfen & Trageberatung',
  description:
    'Tragehilfen in Köln ausprobieren statt bestellen: anlegen, einstellen, mit dem eigenen Kind testen — persönliche Trageberatung bei Petite Pali.',
  path: '/sortiment/tragehilfen/',
  image: '/images/boutique-beratung.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Tragehilfen', path: '/sortiment/tragehilfen/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Muss ich mein Kind mitbringen?',
    answer:
      'Am besten ja. Eine Trage lässt sich nur mit dem Kind einstellen, für das sie gedacht ist — vorher ist alles Theorie.',
  },
  {
    question: 'Wie lange dauert eine Beratung?',
    answer:
      'Länger, als man denkt. Planen Sie Zeit ein, und melden Sie sich vorher — dann ist auch jemand für Sie da.',
  },
  {
    question: 'Was, wenn sich die Trage später nicht bewährt?',
    answer:
      'Kommen Sie wieder. Nachjustieren gehört dazu; Kinder wachsen, und die Einstellung von vor drei Monaten stimmt dann nicht mehr.',
  },
];

/*
 * Modus: Persuade. Die Handlung ist die Beratung, nicht das Produkt.
 */
export default function Tragehilfen() {
  return (
    <>
      <PageHero
        label="Tragehilfen · persönlich ausprobieren"
        lines={['Welche Trage', 'passt zu euch?']}
        lede="Eine Tragehilfe lässt sich nicht aus einer Produktbeschreibung auswählen. Was passt, hängt vom Rücken ab, vom Kind und vom Alltag."
        trail={TRAIL}
        image={IMAGES.boutiqueBeratung}
        actions={<Button href="/shopping-termin/">Beratung vereinbaren</Button>}
      />

      <Prose title="Wie die Beratung abläuft">
        <ul>
          <li>
            <strong>Zuhören.</strong> Wie alt ist das Kind, wie sieht euer Alltag aus, wer trägt —
            und wie oft?
          </li>
          <li>
            <strong>Anlegen.</strong> Verschiedene Systeme, nacheinander, am eigenen Körper.
          </li>
          <li>
            <strong>Einstellen.</strong> Stegbreite, Rückenlänge, Gurte. Daran entscheidet sich
            mehr als am Modell.
          </li>
          <li>
            <strong>Tragen.</strong> Ein paar Minuten durch den Laden gehen. Bequem fühlt sich
            nach zwanzig Sekunden fast alles an.
          </li>
        </ul>
      </Prose>

      <MediaBand
        slot={IMAGES.boutiqueGang}
        caption="Platz zum Ausprobieren: im Laden lässt sich mit der Trage ein paar Runden gehen."
      />

      <Prose title="Warum das im Laden besser geht" tinted>
        <p>
          Im Netz ist jede Trage die beste. Im Laden merkt man nach fünf Minuten, welche drückt —
          und das ist die Information, auf die es ankommt.
        </p>
        <p>
          Dazu kommt: Eine falsch eingestellte Trage ist nicht nur unbequem. Deshalb wird hier
          eingestellt und nicht nur verkauft.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Sagen Sie vorher kurz Bescheid."
        body="Für eine Trageberatung brauchen wir Zeit — und die lässt sich besser einplanen, wenn wir voneinander wissen."
      />
    </>
  );
}
