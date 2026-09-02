import { Button } from '@/components/ui/Button';
import styles from './PageCta.module.css';

/**
 * Closing call to action for a sub-page. Advice framing, not sales pressure
 * (§34) — the copy is set per page so the six pages do not end with the same
 * sentence.
 */
export function PageCta({ headline, body }: { headline: string; body: string }) {
  return (
    <section className={`${styles.section} grain`} aria-labelledby="page-cta-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.text}>
          <h2 id="page-cta-headline" className={styles.headline}>
            {headline}
          </h2>
          <p className={styles.body}>{body}</p>
          <div className={styles.actions}>
            <Button href="/kontakt/" variant="primary">
              Projekt besprechen
            </Button>
            <Button href="/#system" variant="secondary" arrow={false}>
              Das System ansehen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
