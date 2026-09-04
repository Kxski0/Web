import { NAV, SOLUTION_ROUTES } from '@/content/nav';
import { CONTACT, SITE } from '@/content/site';
import { Wordmark } from './Wordmark';
import styles from './Footer.module.css';

/**
 * The footer runs on the off-white ground.
 *
 * That is a deliberate choice, not a stylistic whim: the supplied logo is drawn
 * for light backgrounds and loses half its artwork on graphite. The page already
 * alternates dark, image and light, so closing on light costs the rhythm nothing
 * and gives the brand mark the one surface where it reads correctly.
 *
 * data-surface="light" also tells the fixed header to invert over it.
 */
export function Footer() {
  return (
    <footer className={styles.footer} data-surface="light">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.brand}>
          <Wordmark variant="light" />
          <p className={styles.claim}>{SITE.claim}</p>
          <p className={styles.region}>Energie- und Gebäudetechnik für {SITE.region}.</p>
        </div>

        <nav className={styles.column} aria-label="Lösungen">
          <h2 className={styles.columnTitle}>Lösungen</h2>
          {SOLUTION_ROUTES.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className={styles.column} aria-label="Fußzeilennavigation">
          <h2 className={styles.columnTitle}>Unternehmen</h2>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
          <a href="/kontakt/" className={styles.link}>
            Kontakt
          </a>
        </nav>

        <div className={styles.legal}>
          <h2 className={styles.columnTitle}>Rechtliches</h2>
          {/*
            Address and phone stay out until SolBauTec confirms them — an imprint
            is the last place to publish an unverified detail. See CONTENT-TODO.md.
          */}
          {CONTACT.verified && CONTACT.address && (
            <address className={styles.address}>
              {CONTACT.address.street}
              <br />
              {CONTACT.address.postalCode} {CONTACT.address.city}
            </address>
          )}
          <a href="/impressum/" className={styles.link}>
            Impressum
          </a>
          <a href="/datenschutz/" className={styles.link}>
            Datenschutz
          </a>
        </div>
      </div>
    </footer>
  );
}
