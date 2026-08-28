import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { unternehmen } from '@/content/unternehmen';
import { nutztExterneBilder } from '@/content/media';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Informationen zur Verarbeitung personenbezogener Daten auf der Website von Energie Zentrum Saar.',
  robots: { index: false, follow: true },
};

/**
 * PFLICHTSEITE nach Art. 13 DSGVO.
 *
 * Die technisch belegbaren Absaetze (Formular, Schriftarten, Bilder, Cookies)
 * sind ausformuliert und beschreiben den tatsaechlichen Zustand der Anwendung.
 * Der Absatz zu externen Bildern erscheint nur, wenn wirklich Bilder von
 * Dritten geladen werden — so behauptet die Erklaerung nie etwas Falsches.
 * Die uebrigen Angaben muessen rechtlich geprueft werden.
 */
export default function DatenschutzSeite() {
  return (
    <>
      <PageHeader label="RECHTLICHES" headline="Datenschutzerklärung" />
      <Section>
        <div className="max-w-2xl space-y-10 text-body">
          <div>
            <h2 className="text-subheading font-normal">Verantwortliche Stelle</h2>
            <p className="mt-3 text-text-muted">
              {unternehmen.traeger}, {unternehmen.strasse}, {unternehmen.plz}{' '}
              {unternehmen.ort}
              <br />
              Telefon: {unternehmen.telefon} — E-Mail: {unternehmen.email}
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Server-Logfiles</h2>
            {/* PLATZHALTER — abhängig vom späteren Hosting */}
            <p className="mt-3 text-text-muted">
              Der Hosting-Anbieter erhebt und speichert automatisch Informationen
              in Server-Logfiles, die Ihr Browser übermittelt. Angaben zu
              Speicherdauer und Rechtsgrundlage werden ergänzt, sobald das
              Hosting feststeht.
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Kontaktformular</h2>
            <p className="mt-3 text-text-muted">
              Wenn Sie uns über das Kontaktformular eine Anfrage senden, werden
              Ihre Angaben aus dem Formular einschließlich Name, E-Mail-Adresse,
              Telefonnummer und Ihrer Nachricht zum Zweck der Bearbeitung der
              Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw.
              lit. f DSGVO. Wir geben diese Daten nicht ohne Ihre Einwilligung
              weiter.
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
            <h2 className="text-subheading font-normal">Bilder</h2>
            {nutztExterneBilder ? (
              <p className="mt-3 text-text-muted">
                Auf dieser Website werden Bilder eingebunden, die vom Dienst
                Unsplash (Unsplash Inc., Kanada) ausgeliefert werden. Beim Aufruf
                einer Seite baut Ihr Browser dadurch eine direkte Verbindung zu
                diesem Anbieter auf und übermittelt dabei technisch notwendige
                Daten, insbesondere Ihre IP-Adresse.
              </p>
            ) : (
              <p className="mt-3 text-text-muted">
                Alle Bilder dieser Website werden von unserem eigenen Server
                ausgeliefert. Es werden keine Bilder von Dritten nachgeladen.
              </p>
            )}
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
