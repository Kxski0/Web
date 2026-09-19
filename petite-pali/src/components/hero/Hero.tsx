import Link from 'next/link';
import { RevealText } from '@/components/motion/RevealText';
import { CONTACT, SITE } from '@/content/site';
import { HeroMedia } from './HeroMedia';
import styles from './Hero.module.css';

const Arrow = () => (
  <svg className={styles.arrow} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Hero() {
  return (
    <section className={styles.hero} data-surface="media">
      <HeroMedia />

      <div className={`${styles.inner} page-bounds`}>
        <div className={styles.text}>
          <p className={styles.kicker}>
            <span>{SITE.name}</span>
            <span className={styles.kickerRule} aria-hidden="true" />
            <span>Baby- &amp; Kinderboutique in Köln</span>
          </p>

          {/*
            * Der Umbruch ist gesetzt, nicht dem Zufall überlassen: die beiden
            * Sätze gehören je auf eine eigene Zeile. Das Leerzeichen am
            * Zeilenende ist nicht kosmetisch — die Zeilen sind Blöcke, der
            * zugängliche Name der Überschrift ist aber reiner Text.
            */}
          <RevealText as="h1" className={styles.headline} on="load">
            <span className={styles.line}>Für die kleinen Menschen. </span>
            <span className={styles.line}>Und die großen Momente dazwischen.</span>
          </RevealText>

          <p className={styles.sub}>
            Baby- und Kindermode, Frühchenkleidung, Umstandsmode und ausgewählte Lieblingsstücke in
            der Kölner Südstadt.
          </p>

          <div className={styles.actions}>
            <Link href="/sortiment/" className={`pressable ${styles.primary}`}>
              Boutique entdecken <Arrow />
            </Link>
            <Link href="/shopping-termin/" className={`pressable ${styles.secondary}`}>
              Shopping-Termin <Arrow />
            </Link>
          </div>

          {CONTACT.verified && CONTACT.address && (
            <p className={styles.meta}>
              <span>
                {CONTACT.address.street}, {CONTACT.address.postalCode} {CONTACT.address.city}
              </span>
              {CONTACT.hours[0] && (
                <span>
                  {CONTACT.hours[0].label} {CONTACT.hours[0].opens}–{CONTACT.hours[0].closes} Uhr
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
