import { CONTACT, SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from '@/components/page/LegalPage.module.css';

export const metadata = {
  ...pageMetadata({
    title: 'Datenschutz',
    description: `Datenschutzerklärung für ${SITE.name}.`,
    path: '/datenschutz/',
  }),
  robots: { index: false, follow: true },
};

/**
 * Diese Erklärung ist gegen den tatsächlichen Code geschrieben, nicht aus einem
 * Baukasten übernommen. Was hier steht, lässt sich im Repository nachprüfen:
 *
 *  - Keine Cookies. Die Seite setzt keine, und es gibt keinen Consent-Banner,
 *    weil es nichts einzuwilligen gibt.
 *  - Kein Analytics, kein Tag Manager, kein Pixel.
 *  - Keine externen Einbettungen. Schriften liegen selbst gehostet (next/font),
 *    Bilder und Video im eigenen Ursprung, die Karte ist ein Link und kein
 *    iframe, Instagram ist verlinkt und nicht eingebettet.
 *  - Der einzige Datenfluss ist das Kontaktformular.
 *
 * Wird daran etwas geändert, gehört dieser Text mit geändert.
 */
export default function Datenschutz() {
  return (
    <div className={styles.page}>
      <div className="page-bounds">
        <div className={styles.inner}>
          <p className="eyebrow">Rechtliches</p>
          <h1 className={styles.title}>Datenschutzerklärung</h1>

          <section className={styles.section}>
            <h2 className={styles.heading}>Verantwortlich</h2>
            <div className={styles.body}>
              <address className={styles.address}>
                {SITE.name} — {SITE.descriptor}
                {CONTACT.address && (
                  <>
                    <br />
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.postalCode} {CONTACT.address.city}
                  </>
                )}
                {CONTACT.email && (
                  <>
                    <br />
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </>
                )}
              </address>
              <p>
                Die vollständige Anbieterkennzeichnung steht im <a href="/impressum/">Impressum</a>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Was diese Seite nicht tut</h2>
            <div className={styles.body}>
              <p>
                Diese Website setzt keine Cookies, bindet keine Analyse- oder Trackingdienste ein
                und lädt keine Inhalte von fremden Servern nach. Schriften, Bilder und das Video im
                Kopfbereich werden vom selben Server ausgeliefert wie die Seite selbst. Es gibt
                deshalb auch keinen Einwilligungsbanner — es gibt nichts, worin eingewilligt werden
                müsste.
              </p>
              <p>
                Die Verlinkungen zu Instagram und zur Kartenansicht sind gewöhnliche Links. Erst
                wenn Sie einen davon anklicken, entsteht eine Verbindung zum jeweiligen Anbieter,
                und es gelten dessen Datenschutzbestimmungen.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Server-Protokolle</h2>
            <div className={styles.body}>
              <p>
                Beim Abruf der Seite verarbeitet der Hostinganbieter technisch notwendige Daten —
                IP-Adresse, Zeitpunkt, aufgerufene Adresse, übertragene Datenmenge, Browsertyp. Das
                ist für die Auslieferung und den sicheren Betrieb erforderlich, Rechtsgrundlage ist
                Art. 6 Abs. 1 lit. f DSGVO. Diese Daten werden nicht mit anderen Quellen
                zusammengeführt und nicht zur Wiedererkennung einzelner Personen verwendet.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Kontaktformular</h2>
            <div className={styles.body}>
              <p>
                Wenn Sie das Formular ausfüllen, werden die von Ihnen eingetragenen Angaben — Name,
                E-Mail-Adresse, wahlweise Telefonnummer, Ihr Anliegen und Ihre Nachricht — an uns
                übermittelt, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit.
                b bzw. lit. f DSGVO. Die Angaben werden gelöscht, sobald die Anfrage erledigt ist
                und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
              <p>
                Ein Dateiupload ist nicht vorgesehen. Es werden keine weiteren Angaben erhoben, als
                die Felder zeigen — insbesondere keine versteckte Erfassung Ihres Verhaltens auf der
                Seite.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Hosting</h2>
            <div className={styles.body}>
              <p>
                Die Website wird bei Vercel Inc. betrieben. Dabei werden die oben genannten
                Server-Protokolldaten verarbeitet. Zwischen uns und dem Anbieter besteht ein Vertrag
                über die Auftragsverarbeitung.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Ihre Rechte</h2>
            <div className={styles.body}>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                Verarbeitung, auf Datenübertragbarkeit sowie ein Widerspruchsrecht gegen
                Verarbeitungen auf Grundlage berechtigter Interessen. Wenden Sie sich dafür an die
                oben genannte Adresse.
              </p>
              <p>
                Außerdem steht Ihnen ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
                Zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit
                Nordrhein-Westfalen.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
