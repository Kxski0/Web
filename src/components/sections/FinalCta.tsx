import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CONTACT } from '@/content/site';
import styles from './FinalCta.module.css';

/**
 * Section 09 — the close.
 *
 * Advice, not pressure: one primary action and one quieter alternative. The
 * direct contact line only appears once CONTACT.verified is true — publishing an
 * unconfirmed phone number would be worse than showing none.
 */
export function FinalCta() {
  return (
    <section id="kontakt" className={`${styles.section} grain`} aria-labelledby="cta-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.text}>
          <Eyebrow index="09">Nächster Schritt</Eyebrow>
          <h2 id="cta-headline" className={styles.headline}>
            Machen wir Ihr Haus
            <br />
            zum Energiesystem.
          </h2>
          <p className={styles.copy}>
            Erzählen Sie uns von Ihrem Projekt. Wir sehen uns Gebäude, Verbrauch und Bestand an und
            sagen Ihnen ehrlich, was sinnvoll ist — auch wenn das weniger ist, als Sie erwartet
            haben.
          </p>

          <div className={styles.actions}>
            <Button href="#kontaktformular" variant="primary">
              Projekt besprechen
            </Button>
            <Button href="#loesungen" variant="secondary" arrow={false}>
              Lösungen entdecken
            </Button>
          </div>

          {CONTACT.verified && (CONTACT.phone || CONTACT.email) && (
            <p className={styles.direct}>
              Lieber direkt:{' '}
              {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>}
              {CONTACT.phone && CONTACT.email && ' · '}
              {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
