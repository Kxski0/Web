import { Breadcrumbs } from '@/components/page/Breadcrumbs';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { Prose } from '@/components/page/Prose';
import { CREDENTIALS, KEY_FIGURES } from '@/content/trust';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Über uns — Planung und Installation aus einer Hand',
  description:
    'SolBauTec plant und realisiert Energiesysteme für Wohngebäude in Augsburg und Umgebung: Photovoltaik, Speicher, Wärmepumpe und Energiemanagement als ein zusammenhängendes System.',
  path: '/ueber-uns/',
  image: '/images/team-documentary.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Über uns', path: '/ueber-uns/' },
];

/**
 * Written from what can be stated about how the company works. Team size,
 * founding year, certificates and partners are NOT asserted here — none of them
 * is documented, and §43 rules out filling an about page with plausible-sounding
 * company history. The credential and figure blocks below appear the moment
 * src/content/trust.ts holds verified entries.
 */
export default function UeberUnsPage() {
  return (
    <>
      <section className={`${styles.head} grain`} aria-labelledby="ueber-headline">
        <div className={`${styles.inner} page-grid`}>
          <div className={styles.intro}>
            <Breadcrumbs trail={TRAIL} />
            <p className="eyebrow">Über uns</p>
            <h1 id="ueber-headline" className={styles.headline}>
              Wer plant, sollte
              <br />
              auch anschließen.
            </h1>
            <p className={styles.lede}>
              SolBauTec plant und realisiert Energiesysteme für Wohngebäude in Augsburg und Umgebung.
              Planung, Elektroinstallation und Inbetriebnahme laufen nicht über verschiedene Firmen.
            </p>
          </div>
        </div>
      </section>

      <MediaBand
        image={IMAGES.teamDocumentary}
        width="inset"
        caption="Abstimmung an der installierten Technik. Wer die Anlage ausgelegt hat, steht auch daneben, wenn sie das erste Mal Strom liefert."
      />

      <Prose eyebrow="Die Haltung" title="Ein System hat einen Verantwortlichen." align="left">
        <p>
          Der häufigste Grund dafür, dass eine Anlage nicht so läuft wie versprochen, ist keine
          schlechte Komponente. Es ist eine Schnittstelle, für die sich niemand zuständig fühlte: Der
          Dachdecker hat montiert, der Elektriker angeschlossen, der Heizungsbauer die Wärmepumpe
          gesetzt — und die Frage, warum der Speicher um elf Uhr voll ist, gehörte niemandem.
        </p>
        <p>
          Deshalb arbeiten wir über die ganze Kette. Nicht, weil das für uns bequemer wäre, sondern
          weil sich nur so klären lässt, wer es richtet, wenn etwas nicht stimmt.
        </p>
      </Prose>

      <Prose eyebrow="Die Arbeitsweise" title="Was Sie von uns erwarten können." align="right">
        <ul>
          <li>
            <strong>Ein Termin vor Ort, bevor ein Angebot kommt.</strong> Ein Gebäude lässt sich nicht
            aus der Ferne beurteilen, und ein Angebot ohne Begehung ist eine Preisliste.
          </li>
          <li>
            <strong>Eine Auslegung, die Sie nachvollziehen können.</strong> Sie sollen verstehen,
            warum eine Komponente diese Größe hat — nicht darauf vertrauen müssen.
          </li>
          <li>
            <strong>Ein Nein, wenn es nichts wird.</strong> Wenn ein Dach nicht trägt, eine
            Vorlauftemperatur zu hoch ist oder ein Speicher sich nicht rechnet, sagen wir das. Ein
            Auftrag, der Sie enttäuscht, kostet uns mehr als der entgangene Umsatz.
          </li>
          <li>
            <strong>Dokumentation zur Übergabe.</strong> Strangpläne, Datenblätter, Prüfprotokoll und
            eine Einweisung, die über {'„hier ist die App“'} hinausgeht.
          </li>
          <li>
            <strong>Erreichbarkeit danach.</strong> Eine Anlage läuft zwanzig Jahre. Die Fragen
            kommen nicht alle in der ersten Woche.
          </li>
        </ul>
      </Prose>

      {KEY_FIGURES.length > 0 && (
        <section className={styles.figures} aria-label="Zahlen">
          <dl className={`${styles.figuresInner} page-grid`}>
            {KEY_FIGURES.map((figure) => (
              <div key={figure.label} className={styles.figure}>
                <dt className={styles.figureValue}>{figure.value}</dt>
                <dd className={styles.figureLabel}>{figure.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {CREDENTIALS.length > 0 && (
        <Prose eyebrow="Qualifikation" title="Nachweise." align="left">
          <ul>
            {CREDENTIALS.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> — {item.issuer}
              </li>
            ))}
          </ul>
        </Prose>
      )}

      <PageCta
        headline="Lernen wir uns kennen."
        body="Der beste Einstieg ist ein Termin an Ihrem Gebäude. Danach wissen beide Seiten, ob es passt — und was überhaupt möglich ist."
      />
    </>
  );
}
