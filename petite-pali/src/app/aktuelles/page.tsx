import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { BEITRAEGE } from '@/content/aktuelles';
import { CONTACT, SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Aktuelles',
  description:
    'Neuigkeiten aus der Boutique: neue Ware, besondere Öffnungszeiten und was sonst gerade bei Petite Pali in Köln passiert.',
  path: '/aktuelles/',
  image: '/images/boutique-mitte.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Aktuelles', path: '/aktuelles/' },
];

/*
 * Modus: Read. Hier wird gelesen. Ohne gepflegte Beiträge verweist die Seite ehrlich weiter.
 */
export default function Aktuelles() {
  return (
    <>
      <PageHero
        label="Aktuelles"
        lines={['Was gerade', 'im Laden passiert.']}
        lede="Neue Ware kommt in kleinen Mengen und oft kurzfristig. Was diese Woche hereingekommen ist, steht am schnellsten auf Instagram."
        trail={TRAIL}
      />

      <section className={styles.section}>
        <div className="page-bounds">
          {BEITRAEGE.length > 0 ? (
            <ol className={styles.list}>
              {BEITRAEGE.map((b) => (
                <li key={b.slug} className={styles.item}>
                  <time className={styles.datum} dateTime={b.datum}>
                    {new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(new Date(b.datum))}
                  </time>
                  <div>
                    <h2 className={styles.titel}>{b.titel}</h2>
                    <p className={styles.text}>{b.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            /*
             * Kein leerer Blogbereich und keine erfundenen Beiträge: solange
             * keine gepflegten Inhalte vorliegen, verweist die Seite auf den
             * Kanal, über den Neuigkeiten tatsächlich laufen — und bleibt
             * damit nützlich statt leer.
             */
            <div className={styles.fallback}>
              <h2 className={styles.fallbackTitel}>Neuigkeiten laufen über Instagram.</h2>
              <p className={styles.text}>
                Dort steht, was neu hereingekommen ist, wann das Schaufenster wechselt und wenn die
                Öffnungszeiten einmal abweichen — meist am selben Tag.
              </p>
              <div className={styles.actions}>
                <Button href={SITE.instagram.url}>{SITE.instagram.handle} folgen</Button>
                {CONTACT.verified && CONTACT.email && (
                  <Button href={`mailto:${CONTACT.email}`} variant="quiet" arrow={false}>
                    {CONTACT.email}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <PageCta
        title="Oder einfach anrufen."
        body="Ob etwas Bestimmtes gerade da ist, lässt sich am Telefon in einer Minute klären."
      />
    </>
  );
}
