import { ContactForm } from '@/components/page/ContactForm';
import { PageHero } from '@/components/page/PageHero';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { CONTACT, SITE, formatPhone, telHref } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Besuch & Kontakt',
  description:
    'Öffnungszeiten, Anfahrt und Kontakt: Petite Pali, Karolingerring 5, 50678 Köln — am Chlodwigplatz.',
  path: '/kontakt/',
  image: '/images/eingang.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Besuch & Kontakt', path: '/kontakt/' },
];

function mapsHref() {
  if (!CONTACT.address) return null;
  const query = `${CONTACT.address.street}, ${CONTACT.address.postalCode} ${CONTACT.address.city}`;
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

export default function Kontakt() {
  const maps = mapsHref();

  return (
    <>
      <PageHero
        eyebrow="Besuch & Kontakt"
        lines={['Am', 'Chlodwigplatz.']}
        lede="Der Laden liegt am Karolingerring, wenige Schritte vom Chlodwigplatz. Am schnellsten geht alles vor Ort — für alles andere gibt es Telefon, E-Mail und das Formular."
        trail={TRAIL}
        image={IMAGES.eingang}
      />

      <section className={styles.section}>
        <div className={`${styles.grid} page-grid`}>
          <div className={styles.facts}>
            {/* Jeder Block hängt an bestätigten Angaben. Ohne sie steht hier nichts. */}
            {CONTACT.verified && CONTACT.hours.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardHeading}>Öffnungszeiten</h2>
                <dl className={styles.hours}>
                  {CONTACT.hours.map((h) => (
                    <div key={h.label} className={styles.hoursRow}>
                      <dt>{h.label}</dt>
                      <dd>
                        {h.opens}–{h.closes} Uhr
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={styles.route}>
                  An Sonn- und Feiertagen ist der Laden geschlossen. Abweichungen kündigen wir auf{' '}
                  <a className={styles.link} href={SITE.instagram.url} rel="noopener noreferrer" target="_blank">
                    Instagram
                  </a>{' '}
                  an.
                </p>
              </div>
            )}

            {CONTACT.verified && (
              <div className={styles.card}>
                <h2 className={styles.cardHeading}>Adresse &amp; Kontakt</h2>
                <address className={styles.lines}>
                  <span>
                    {CONTACT.address?.street}
                    <br />
                    {CONTACT.address?.postalCode} {CONTACT.address?.city}
                    {CONTACT.neighbourhood && (
                      <>
                        <br />
                        {CONTACT.neighbourhood}
                      </>
                    )}
                  </span>
                  {CONTACT.phone && (
                    <a className={styles.link} href={telHref(CONTACT.phone)}>
                      {formatPhone(CONTACT.phone)}
                    </a>
                  )}
                  {CONTACT.mobile && (
                    <a className={styles.link} href={telHref(CONTACT.mobile)}>
                      {formatPhone(CONTACT.mobile)} (mobil)
                    </a>
                  )}
                  {CONTACT.email && (
                    <a className={styles.link} href={`mailto:${CONTACT.email}`}>
                      {CONTACT.email}
                    </a>
                  )}
                </address>

                <p className={styles.route}>
                  Mit der KVB bis Chlodwigplatz — Stadtbahn 15, 16 und 17, dazu die Buslinien
                  106, 132, 133 und 142. Von dort sind es wenige Schritte.
                  {maps && (
                    <>
                      {' '}
                      <a className={styles.link} href={maps} rel="noopener noreferrer" target="_blank">
                        Auf der Karte ansehen
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className={styles.form}>
            <h2 className={styles.formTitle}>Schreiben Sie uns</h2>
            <p className={styles.formLede}>
              Für Fragen, die keinen Anruf brauchen. Wenn es eilig ist, ist das Telefon schneller.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
