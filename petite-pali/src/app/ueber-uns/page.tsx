import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { BRANDS } from '@/content/brands';
import { SITE } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Über uns',
  description:
    'Petite Pali ist eine kleine Baby- und Kinderboutique am Chlodwigplatz in Köln — was den Laden ausmacht und wie hier ausgesucht wird.',
  path: '/ueber-uns/',
  image: '/images/schaufenster.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Über uns', path: '/ueber-uns/' },
];

export default function UeberUns() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        lines={['Ein kleiner Laden', 'mit einer', 'klaren Meinung.']}
        lede="Petite Pali liegt am Karolingerring, ein paar Schritte vom Chlodwigplatz. Klein genug, dass man in zehn Minuten alles gesehen hat — und dicht genug, dass man länger bleibt."
        trail={TRAIL}
        image={IMAGES.schaufenster}
      />

      <Prose title="Wie hier ausgesucht wird">
        <p>
          Jedes Teil wird einzeln entschieden. Die Frage ist nicht, ob es sich gut verkauft, sondern
          ob sich im Laden begründen lässt, warum es hängt: wie sich der Stoff anfühlt, was er nach
          dem fünften Waschgang macht, ob ein Kind den Schnitt allein anbekommt.
        </p>
        <p>
          Das begrenzt das Sortiment. Es ist der Grund, warum man hier zu jedem Teil eine Antwort
          bekommt, statt auf ein Regal gezeigt zu bekommen.
        </p>
      </Prose>

      <MediaBand
        slot={IMAGES.ladenTisch}
        caption="Nach Größen sortiert statt nach Marken — so wird tatsächlich gesucht."
      />

      <Prose title="Beratung, wenn sie gewünscht ist" align="right" tinted>
        <p>
          Wer zum ersten Mal eine Erstausstattung zusammenstellt, hat meist mehr Fragen als Zeit.
          Dafür ist der Laden da: Größen einschätzen, Mengen einschätzen, aussortieren, was man
          wirklich nicht braucht.
        </p>
        <p>
          Wer nur schauen möchte, wird nicht angesprochen. Beides ist in Ordnung.
        </p>
      </Prose>

      <Prose title="Von Frühchengröße bis Schulkind">
        <p>
          Der Laden deckt die ganze Strecke ab — von den Größen unterhalb der Neugeborenengröße bis
          zur Grundschule, dazu Umstandsmode für die Monate davor. Wer zur Geburt hier war, muss für
          den ersten Kindergartentag nicht woanders hin.
        </p>
      </Prose>

      {/* Nur was belegt ist. Ohne Marken rendert der Block gar nicht. */}
      {BRANDS.length > 0 && (
        <Prose title="Marken, die wir führen" align="right" tinted>
          <p>{BRANDS.map((b) => b.name).join(' · ')}</p>
          <p>
            Eine Auswahl, keine vollständige Liste — das Sortiment wechselt mit der Saison. Was
            gerade da ist, sehen Sie am besten im Laden oder auf{' '}
            <a
              href={SITE.instagram.url}
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: 'var(--color-caramel)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Instagram
            </a>
            .
          </p>
        </Prose>
      )}

      <PageCta
        title="Kommen Sie vorbei."
        body="Karolingerring 5, am Chlodwigplatz. Wer etwas Bestimmtes sucht, ruft am besten kurz vorher an."
      />
    </>
  );
}
