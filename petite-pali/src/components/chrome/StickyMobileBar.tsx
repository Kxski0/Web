import { CONTACT, telHref } from '@/content/site';
import styles from './StickyMobileBar.module.css';

/** Kartenlink statt eingebetteter Karte: kein fremdes Skript, keine Einwilligung. */
function mapsHref() {
  if (!CONTACT.address) return null;
  const query = `${CONTACT.address.street}, ${CONTACT.address.postalCode} ${CONTACT.address.city}`;
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

const Phone = () => (
  <svg className={styles.icon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M6.3 3.2 7.6 6 6.2 7.5c.8 1.7 2.1 3 3.8 3.8L11.5 10l2.8 1.3v2.9c0 .6-.5 1-1.1 1C7.4 14.8 3 10.4 2.6 4.6c0-.6.4-1.1 1-1.1h2.7Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const Calendar = () => (
  <svg className={styles.icon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2.6" y="3.8" width="12.8" height="11" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.6 7.2h12.8M6 2.4v2.6M12 2.4v2.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const Pin = () => (
  <svg className={styles.icon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 15.6s5-4.3 5-8a5 5 0 0 0-10 0c0 3.7 5 8 5 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="9" cy="7.4" r="1.8" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function StickyMobileBar() {
  const maps = mapsHref();

  return (
    <nav className={styles.bar} aria-label="Schnellzugriff">
      {CONTACT.verified && CONTACT.phone && (
        <a href={telHref(CONTACT.phone)} className={styles.item}>
          <Phone />
          Anrufen
        </a>
      )}
      <a href="/shopping-termin/" className={styles.item}>
        <Calendar />
        Termin
      </a>
      {maps && (
        <a href={maps} className={styles.item} rel="noopener noreferrer" target="_blank">
          <Pin />
          Route
        </a>
      )}
    </nav>
  );
}
