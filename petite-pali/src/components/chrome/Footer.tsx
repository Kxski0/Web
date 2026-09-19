import Link from 'next/link';
import { ACTIONS, NAV } from '@/content/nav';
import { CONTACT, SITE, formatPhone, telHref } from '@/content/site';
import { Wordmark } from './Wordmark';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  const sortiment = NAV.find((item) => item.children)?.children ?? [];

  return (
    <footer className={styles.footer}>
      <div className="page-bounds">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Wordmark />
            <p className={styles.claim}>{SITE.claim}</p>
          </div>

          <div>
            <h2 className={styles.heading}>Sortiment</h2>
            <ul className={styles.list}>
              {sortiment.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Boutique</h2>
            <ul className={styles.list}>
              {NAV.filter((i) => !i.children).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {ACTIONS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className={styles.link}>
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Hier finden Sie uns</h2>
            {/* Nur bestätigte Angaben. Ohne Bestätigung bliebe der Block leer. */}
            {CONTACT.verified && CONTACT.address && (
              <address className={styles.address}>
                {CONTACT.address.street}
                <br />
                {CONTACT.address.postalCode} {CONTACT.address.city}
                <br />
                {CONTACT.phone && (
                  <a href={telHref(CONTACT.phone)} className={styles.link}>
                    {formatPhone(CONTACT.phone)}
                  </a>
                )}
                <br />
                {CONTACT.email && (
                  <a href={`mailto:${CONTACT.email}`} className={styles.link}>
                    {CONTACT.email}
                  </a>
                )}
              </address>
            )}

            {CONTACT.verified && CONTACT.hours.length > 0 && (
              <>
                <h2 className={styles.heading} style={{ marginTop: '1.75rem' }}>
                  Öffnungszeiten
                </h2>
                <dl className={styles.list}>
                  {CONTACT.hours.map((h) => (
                    <div key={h.label} className={styles.hoursRow}>
                      <dt>{h.label}</dt>
                      <dd>
                        {h.opens}–{h.closes}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {SITE.name} · {SITE.descriptor}
          </p>
          <div className={styles.bottomLinks}>
            <a href={SITE.instagram.url} className={styles.link} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
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
