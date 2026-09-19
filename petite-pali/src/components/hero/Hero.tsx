import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/chrome/Wordmark';
import { CONTACT, SITE } from '@/content/site';
import { HeroMedia } from './HeroMedia';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} data-surface="media">
      <HeroMedia />

      <div className={`${styles.inner} page-bounds`}>
        <div className={styles.panel}>
          <Wordmark variant="full" width={280} />

          <RevealText as="h1" className={styles.claim} on="load">
            {SITE.claim}
          </RevealText>

          <p className={styles.lede}>
            Baby- und Kindermode von Frühchengröße bis Schulkind, Umstandsmode, Spielzeug und
            Geschenke — ausgesucht im Laden, nicht bestellt im Katalog.
          </p>

          <div className={styles.actions}>
            <Button href="/sortiment/">Sortiment ansehen</Button>
            <Button href="/kontakt/" variant="secondary" arrow={false}>
              Öffnungszeiten &amp; Anfahrt
            </Button>
          </div>

          {CONTACT.verified && CONTACT.address && (
            <p className={styles.where}>
              <span className={styles.whereItem}>
                <span className={styles.dot} aria-hidden="true" />
                {CONTACT.address.street}, {CONTACT.address.postalCode} {CONTACT.address.city}
              </span>
              {CONTACT.neighbourhood && (
                <span className={styles.whereItem}>
                  <span className={styles.dot} aria-hidden="true" />
                  {CONTACT.neighbourhood}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
