import { CONTACT, IMPRINT, SITE, formatPhone, telHref } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from '@/components/page/LegalPage.module.css';

export const metadata = {
  ...pageMetadata({
    title: 'Impressum',
    description: `Anbieterkennzeichnung nach § 5 DDG für ${SITE.name}.`,
    path: '/impressum/',
  }),
  // Rechtstexte gehören nicht in den Index, bleiben aber verfolgbar.
  robots: { index: false, follow: true },
};

/** Pflichtfelder, die noch fehlen — daraus entsteht der Hinweis. */
const MISSING = [
  IMPRINT.owner === null && 'Name der vertretungsberechtigten Person',
  IMPRINT.legalForm === null && 'Rechtsform des Unternehmens',
  IMPRINT.vatId === null && IMPRINT.taxNumber === null && 'Umsatzsteuer-Identifikationsnummer oder Steuernummer',
].filter((x): x is string => typeof x === 'string');

export default function Impressum() {
  return (
    <div className={styles.page}>
      <div className={`page-bounds`}>
        <div className={styles.inner}>
          <p className="eyebrow">Rechtliches</p>
          <h1 className={styles.title}>Impressum</h1>

          {MISSING.length > 0 && (
            <div className={styles.notice}>
              <p className={styles.noticeTitle}>Diese Angaben sind noch nicht vollständig.</p>
              <p className={styles.noticeBody}>
                Für eine Anbieterkennzeichnung nach § 5 DDG fehlen noch folgende Pflichtangaben.
                Solange sie fehlen, ist diese Seite von der Suchmaschinen-Indexierung ausgenommen
                und der Auftritt nicht für den öffentlichen Start freigegeben:
              </p>
              <ul className={styles.missing}>
                {MISSING.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <section className={styles.section}>
            <h2 className={styles.heading}>Angaben gemäß § 5 DDG</h2>
            <div className={styles.body}>
              <address className={styles.address}>
                {SITE.name} — {SITE.descriptor}
                {IMPRINT.owner && (
                  <>
                    <br />
                    {IMPRINT.owner}
                  </>
                )}
                {IMPRINT.legalForm && (
                  <>
                    <br />
                    {IMPRINT.legalForm}
                  </>
                )}
                {CONTACT.address && (
                  <>
                    <br />
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.postalCode} {CONTACT.address.city}
                  </>
                )}
              </address>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Kontakt</h2>
            <div className={styles.body}>
              <p>
                {CONTACT.phone && (
                  <>
                    Telefon: <a href={telHref(CONTACT.phone)}>{formatPhone(CONTACT.phone)}</a>
                    <br />
                  </>
                )}
                {CONTACT.mobile && (
                  <>
                    Mobil: <a href={telHref(CONTACT.mobile)}>{formatPhone(CONTACT.mobile)}</a>
                    <br />
                  </>
                )}
                {CONTACT.email && (
                  <>
                    E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </>
                )}
              </p>
            </div>
          </section>

          {(IMPRINT.vatId || IMPRINT.taxNumber) && (
            <section className={styles.section}>
              <h2 className={styles.heading}>Steuerliche Angaben</h2>
              <div className={styles.body}>
                <p>
                  {IMPRINT.vatId && <>Umsatzsteuer-Identifikationsnummer: {IMPRINT.vatId}</>}
                  {IMPRINT.taxNumber && <>Steuernummer: {IMPRINT.taxNumber}</>}
                </p>
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.heading}>Verbraucherstreitbeilegung</h2>
            <div className={styles.body}>
              <p>
                Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Bildnachweis</h2>
            <div className={styles.body}>
              <p>
                Alle Aufnahmen des Ladengeschäfts stammen von {SITE.name} und wurden dem
                Instagram-Auftritt{' '}
                <a href={SITE.instagram.url} rel="noopener noreferrer" target="_blank">
                  {SITE.instagram.handle}
                </a>{' '}
                entnommen.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
