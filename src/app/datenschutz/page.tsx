import { Breadcrumbs } from '@/components/page/Breadcrumbs';
import { CONTACT, SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from '@/components/page/LegalPage.module.css';

export const metadata = {
  ...pageMetadata({
    title: 'Datenschutzerklärung',
    description: `Wie ${SITE.name} personenbezogene Daten auf dieser Website verarbeitet.`,
    path: '/datenschutz/',
  }),
  robots: { index: false, follow: true },
};

/**
 * Privacy notice.
 *
 * The technical statements below describe what this codebase ACTUALLY does and
 * were written against the implementation, not copied from a generator:
 * fonts are self-hosted through next/font, so no request reaches Google; there
 * is no analytics, no tag manager, no embedded map or video, and the site sets
 * no cookies of its own. If any of that changes, this page changes with it.
 *
 * The controller block stays gated until the company details are confirmed, and
 * the hosting section is deliberately unspecific because the production host is
 * not yet fixed. Both are listed in CONTENT-TODO.md.
 */
export default function DatenschutzPage() {
  return (
    <section className={styles.page} aria-labelledby="datenschutz-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.head}>
          <Breadcrumbs
            trail={[
              { name: 'Start', path: '/' },
              { name: 'Datenschutz', path: '/datenschutz/' },
            ]}
          />
          <p className="eyebrow">Rechtliches</p>
          <h1 id="datenschutz-headline" className={styles.headline}>
            Datenschutz
          </h1>
        </div>

        <div className={styles.body}>
          {!CONTACT.verified && (
            <div className={styles.pending}>
              <p className={styles.pendingLabel}>Noch nicht vollständig</p>
              <p>
                Der Verantwortliche im Sinne der DSGVO sowie die Angaben zum Hosting-Dienstleister
                und zum Auftragsverarbeitungsvertrag fehlen noch. Die technischen Beschreibungen
                unten geben den tatsächlichen Stand dieser Website wieder. Vor Veröffentlichung ist
                die Erklärung juristisch zu prüfen.
              </p>
            </div>
          )}

          <div className={styles.block}>
            <h2>Verantwortlicher</h2>
            {CONTACT.verified && CONTACT.address ? (
              <address>
                {SITE.name}
                <br />
                {CONTACT.address.street}
                <br />
                {CONTACT.address.postalCode} {CONTACT.address.city}
                {CONTACT.email && (
                  <>
                    <br />
                    {CONTACT.email}
                  </>
                )}
              </address>
            ) : (
              <p>Folgt.</p>
            )}
          </div>

          <div className={styles.block}>
            <h2>Keine Cookies, keine Analyse, kein Tracking</h2>
            <p>
              Diese Website setzt keine eigenen Cookies und verwendet keine Analyse-, Tracking- oder
              Werbedienste. Es sind keine Zählpixel, kein Tag-Manager und keine sozialen Plug-ins
              eingebunden. Es gibt deshalb auch keinen Cookie-Banner — es gäbe nichts, worin
              eingewilligt werden könnte.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Schriften und Bilder</h2>
            <p>
              Alle Schriftarten werden vom eigenen Server ausgeliefert. Beim Aufruf dieser Website
              wird keine Verbindung zu Google Fonts oder einem anderen Schriften-Dienst aufgebaut,
              und es wird keine IP-Adresse an Dritte übertragen. Dasselbe gilt für sämtliche Bilder.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Server-Logfiles</h2>
            <p>
              Beim Aufruf dieser Website werden durch den Hosting-Dienstleister technisch notwendige
              Zugriffsdaten verarbeitet, üblicherweise IP-Adresse, Zeitpunkt der Anfrage, abgerufene
              Ressource, übertragene Datenmenge, Referrer und Browserkennung.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt im
              sicheren und störungsfreien Betrieb der Website. Eine Zusammenführung dieser Daten mit
              anderen Datenquellen findet nicht statt.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Kontaktformular</h2>
            <p>
              Wenn Sie das Kontaktformular nutzen, verarbeiten wir die Angaben, die Sie dort machen:
            </p>
            <ul>
              <li>Ihre Auswahl, worum es geht</li>
              <li>Name und Ort</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer, sofern Sie sie angeben</li>
              <li>Ihre Beschreibung des Vorhabens</li>
              <li>ein Foto Ihres Hauses, sofern Sie eines hochladen</li>
            </ul>
            <p>
              Diese Angaben verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf einen Vertrag
              gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht,
              sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen.
            </p>
            <p>
              Bitte übermitteln Sie über das Formular keine besonderen Kategorien personenbezogener
              Daten und keine Angaben zu Dritten ohne deren Kenntnis. Wenn ein hochgeladenes Foto
              Personen oder Kennzeichen zeigt, schwärzen Sie diese bitte vorab.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Hosting</h2>
            <p>
              Diese Website wird bei einem Dienstleister betrieben, der die Daten in unserem Auftrag
              verarbeitet. Der Name des Dienstleisters und die Angaben zum Vertrag über
              Auftragsverarbeitung nach Art. 28 DSGVO werden hier ergänzt.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten
              (Art. 15 DSGVO), auf Berichtigung (Art. 16), auf Löschung (Art. 17), auf Einschränkung
              der Verarbeitung (Art. 18), auf Datenübertragbarkeit (Art. 20) sowie ein
              Widerspruchsrecht gegen Verarbeitungen auf Grundlage berechtigter Interessen
              (Art. 21 DSGVO).
            </p>
            <p>
              Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu. Für
              Bayern ist das Bayerische Landesamt für Datenschutzaufsicht zuständig.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Verschlüsselung</h2>
            <p>
              Diese Website wird ausschließlich über eine verschlüsselte Verbindung (TLS)
              ausgeliefert. Sie erkennen das an dem vorangestellten https:// in der Adresszeile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
