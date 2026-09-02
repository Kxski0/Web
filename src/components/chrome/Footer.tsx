import { NAV } from '@/content/nav';
import { CONTACT, SITE } from '@/content/site';
import { Wordmark } from './Wordmark';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.brand}>
          <Wordmark />
          <p className={styles.claim}>{SITE.claim}</p>
        </div>

        <nav className={styles.nav} aria-label="Fußzeilennavigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.legal}>
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
          <div className={styles.legalLinks}>
            <a href="/impressum/">Impressum</a>
            <a href="/datenschutz/">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
