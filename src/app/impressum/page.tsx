import { Breadcrumbs } from '@/components/page/Breadcrumbs';
import { CONTACT, SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from '@/components/page/LegalPage.module.css';

export const metadata = {
  ...pageMetadata({
    title: 'Impressum',
    description: `Anbieterkennzeichnung nach § 5 DDG für ${SITE.name}.`,
    path: '/impressum/',
  }),
  robots: { index: false, follow: true },
};

/**
 * Legally required supplier identification.
 *
 * The company details are NOT invented. An incomplete imprint is a liability in
 * Germany, and a wrong one is worse — so while CONTACT.verified is false the
 * page states plainly that it is not yet complete instead of printing
 * plausible-looking data. See CONTENT-TODO.md; this must be filled before the
 * site goes live.
 */
export default function ImpressumPage() {
  return (
    <section className={styles.page} aria-labelledby="impressum-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.head}>
          <Breadcrumbs
            trail={[
              { name: 'Start', path: '/' },
              { name: 'Impressum', path: '/impressum/' },
            ]}
          />
          <p className="eyebrow">Rechtliches</p>
          <h1 id="impressum-headline" className={styles.headline}>
            Impressum
          </h1>
        </div>

        <div className={styles.body}>
          {!CONTACT.verified && (
            <div className={styles.pending}>
              <p className={styles.pendingLabel}>Noch nicht vollständig</p>
              <p>
                Die Anbieterkennzeichnung nach § 5 DDG liegt noch nicht in bestätigter Form vor.
                Firmierung, Anschrift, Vertretungsberechtigte, Registereintrag und
                Umsatzsteuer-Identifikationsnummer werden ergänzt, sobald sie von SolBauTec
                freigegeben sind. Diese Seite darf vor der Ergänzung nicht öffentlich gehen.
              </p>
            </div>
          )}

          <div className={styles.block}>
            <h2>Angaben gemäß § 5 DDG</h2>
            {CONTACT.verified && CONTACT.address ? (
              <address>
                {SITE.name}
                <br />
                {CONTACT.address.street}
                <br />
                {CONTACT.address.postalCode} {CONTACT.address.city}
              </address>
            ) : (
              <p>Firmierung, Rechtsform und Anschrift folgen.</p>
            )}
          </div>

          <div className={styles.block}>
            <h2>Kontakt</h2>
            {CONTACT.verified && (CONTACT.phone || CONTACT.email) ? (
              <p>
                {CONTACT.phone && <>Telefon: {CONTACT.phone}</>}
                {CONTACT.phone && CONTACT.email && <br />}
                {CONTACT.email && <>E-Mail: {CONTACT.email}</>}
              </p>
            ) : (
              <p>Telefonnummer und E-Mail-Adresse folgen.</p>
            )}
          </div>

          <div className={styles.block}>
            <h2>Vertretungsberechtigte</h2>
            <p>Folgt.</p>
          </div>

          <div className={styles.block}>
            <h2>Registereintrag und Umsatzsteuer</h2>
            <p>
              Registergericht, Registernummer und Umsatzsteuer-Identifikationsnummer nach § 27 a
              Umsatzsteuergesetz folgen.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Bildnachweis</h2>
            <p>
              Die auf dieser Website verwendeten Aufnahmen wurden für SolBauTec erstellt und
              bereitgestellt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
