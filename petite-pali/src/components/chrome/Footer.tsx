import Link from 'next/link';
import { NAV } from '@/content/nav';
import { CONTACT, SITE, formatPhone, telHref } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="page-bounds">
        <div className={styles.grid}>
          <div className={styles.brandBlock}>
            <p className={styles.wordmark}>{SITE.name}</p>
            <p className={styles.descriptor}>{SITE.descriptor}</p>
            <p className={styles.claim}>{SITE.claim}</p>
          </div>

          <div>
            <h2 className={styles.heading}>Seiten</h2>
            <ul className={styles.list}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Laden</h2>
            <ul className={styles.list}>
              {/* Nur bestätigte Angaben. Ohne Bestätigung bliebe dieser Block leer. */}
              {CONTACT.verified && CONTACT.address && (
                <li>
                  <address style={{ fontStyle: 'normal', color: 'rgb(250 246 239 / 0.86)' }}>
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.postalCode} {CONTACT.address.city}
                    {CONTACT.neighbourhood && (
                      <>
                        <br />
                        {CONTACT.neighbourhood}
                      </>
                    )}
                  </address>
                </li>
              )}
              {CONTACT.verified && CONTACT.phone && (
                <li>
                  <a href={telHref(CONTACT.phone)} className={styles.link}>
                    {formatPhone(CONTACT.phone)}
                  </a>
                </li>
              )}
              {CONTACT.verified && CONTACT.email && (
                <li>
                  <a href={`mailto:${CONTACT.email}`} className={styles.link}>
                    {CONTACT.email}
                  </a>
                </li>
              )}
              <li>
                <a href={SITE.instagram.url} className={styles.link} rel="noopener noreferrer" target="_blank">
                  Instagram {SITE.instagram.handle}
                </a>
              </li>
            </ul>

            {CONTACT.verified && CONTACT.hours.length > 0 && (
              <>
                <h2 className={styles.heading} style={{ marginTop: '1.75rem' }}>
                  Öffnungszeiten
                </h2>
                <ul className={styles.list}>
                  {CONTACT.hours.map((h) => (
                    <li key={h.label} className={styles.hoursRow}>
                      <span>{h.label}</span>
                      <span>
                        {h.opens}–{h.closes} Uhr
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {SITE.name}
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/impressum/" className={styles.link}>
              Impressum
            </Link>
            <Link href="/datenschutz/" className={styles.link}>
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
