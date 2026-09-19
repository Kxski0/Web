import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import styles from './Besuch.module.css';

/** Kartenlink statt eingebetteter Karte: kein fremdes Skript, keine Einwilligung nötig. */
function mapsHref() {
  if (!CONTACT.address) return null;
  const query = `${CONTACT.address.street}, ${CONTACT.address.postalCode} ${CONTACT.address.city}`;
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

export function Besuch() {
  const maps = mapsHref();

  return (
    <section className={styles.section} id="besuch">
      <div className={`${styles.grid} page-grid`}>
        <div className={styles.head}>
          <Eyebrow index="08">Besuch</Eyebrow>
          <RevealText as="h2" className={styles.title}>
            Kommen Sie vorbei.
          </RevealText>
          <p className={styles.lede}>
            Am schnellsten geht alles im Laden: anfassen, anprobieren, fragen. Wer wissen möchte, ob
            etwas Bestimmtes da ist, ruft vorher an.
          </p>
          <div className={styles.actions}>
            {CONTACT.verified && CONTACT.phone && (
              <Button href={telHref(CONTACT.phone)} arrow={false}>
                {formatPhone(CONTACT.phone)}
              </Button>
            )}
            <Button href="/kontakt/" variant="secondary">
              Anfahrt &amp; Kontakt
            </Button>
          </div>
        </div>

        {/* Der ganze Block hängt an bestätigten Angaben. Ohne sie: nichts. */}
        {CONTACT.verified && (
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Öffnungszeiten</h3>
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

            {CONTACT.address && (
              <address className={styles.address}>
                {CONTACT.address.street}
                <br />
                {CONTACT.address.postalCode} {CONTACT.address.city}
                {CONTACT.neighbourhood && <> — {CONTACT.neighbourhood}</>}
                {maps && (
                  <>
                    <br />
                    <a className={styles.addressLink} href={maps} rel="noopener noreferrer" target="_blank">
                      Auf der Karte ansehen
                    </a>
                  </>
                )}
              </address>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
