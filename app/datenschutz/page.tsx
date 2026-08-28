import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';

export const metadata: Metadata = { title: 'Datenschutz' };

/**
 * PFLICHTSEITE nach Art. 13 DSGVO.
 *
 * Struktur steht, Inhalte sind Platzhalter und muessen rechtlich geprueft
 * werden. Zwei Punkte sind technisch bereits jetzt belegbar und deshalb
 * ausformuliert: die Einbindung von Unsplash und die Schriftauslieferung.
 */
export default function DatenschutzSeite() {
  return (
    <>
      <PageHeader label="RECHTLICHES" headline="Datenschutzerklärung" />
      <Section>
        <div className="max-w-2xl space-y-10 text-body">
          <div>
            <h2 className="text-subheading font-normal">Verantwortliche Stelle</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">
              EnergieSaar, Musterstraße 1, 66111 Saarbrücken
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Server-Logfiles</h2>
            {/* PLATZHALTER — abhaengig vom spaeteren Hosting */}
            <p className="mt-3 text-text-muted">
              Der Hosting-Anbieter erhebt und speichert automatisch Informationen
              in Server-Logfiles, die Ihr Browser übermittelt. Angaben zu
              Speicherdauer und Rechtsgrundlage werden ergänzt, sobald das
              Hosting feststeht.
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Bilder von Unsplash</h2>
            <p className="mt-3 text-text-muted">
              Auf dieser Website werden Bilder eingebunden, die vom Dienst
              Unsplash (Unsplash Inc., Kanada) über die Domain
              images.unsplash.com ausgeliefert werden. Beim Aufruf einer Seite
              baut Ihr Browser dadurch eine direkte Verbindung zu diesem
              Anbieter auf und übermittelt dabei technisch notwendige Daten,
              insbesondere Ihre IP-Adresse.
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Schriftarten</h2>
            <p className="mt-3 text-text-muted">
              Die verwendete Schriftart wird ausschließlich von unserem eigenen
              Server ausgeliefert. Beim Laden der Schrift entsteht keine
              Verbindung zu Servern Dritter.
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Cookies</h2>
            <p className="mt-3 text-text-muted">
              Diese Website setzt keine Cookies, die nicht für den Betrieb
              erforderlich sind. Es findet keine Analyse des Nutzungsverhaltens
              statt.
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Ihre Rechte</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
              Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
              Widerspruch. Zudem steht Ihnen ein Beschwerderecht bei einer
              Aufsichtsbehörde zu.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
