import { CREDENTIALS, KEY_FIGURES, TESTIMONIALS } from '@/content/trust';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './Trust.module.css';

/**
 * Section 08 — trust.
 *
 * Each block renders only if it has documented content, and the section itself
 * disappears when all three are empty. Nothing here may be produced to fill
 * space: an invented review, certificate, partner or figure is exactly what §43
 * rules out, and a plausible-looking number is the easiest of those to slip in.
 */
export function Trust() {
  const hasContent =
    TESTIMONIALS.length > 0 || CREDENTIALS.length > 0 || KEY_FIGURES.length > 0;
  if (!hasContent) return null;

  return (
    <section id="vertrauen" className={styles.section} aria-labelledby="trust-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.intro}>
          <Eyebrow index="08">Vertrauen</Eyebrow>
          <h2 id="trust-headline" className={styles.headline}>
            Nachprüfbar, nicht behauptet.
          </h2>
        </div>

        {KEY_FIGURES.length > 0 && (
          <dl className={styles.figures}>
            {KEY_FIGURES.map((figure) => (
              <div key={figure.label} className={styles.figure}>
                <dt className={styles.figureValue}>{figure.value}</dt>
                <dd className={styles.figureLabel}>{figure.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {TESTIMONIALS.length > 0 && (
          <ul className={styles.quotes}>
            {TESTIMONIALS.map((item) => (
              <li key={item.quote} className={styles.quote}>
                <blockquote className={styles.quoteText}>{item.quote}</blockquote>
                <p className={styles.quoteMeta}>
                  {item.author} ·{' '}
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} rel="nofollow noopener">
                      {item.source}
                    </a>
                  ) : (
                    item.source
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}

        {CREDENTIALS.length > 0 && (
          <ul className={styles.credentials}>
            {CREDENTIALS.map((item) => (
              <li key={item.label} className={styles.credential}>
                <span>{item.label}</span>
                <span className={styles.credentialIssuer}>{item.issuer}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
