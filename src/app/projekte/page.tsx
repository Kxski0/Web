import { Breadcrumbs } from '@/components/page/Breadcrumbs';
import { PageCta } from '@/components/page/PageCta';
import { Prose } from '@/components/page/Prose';
import { PROJECTS } from '@/content/projects';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Projekte — Referenzen mit Zustimmung der Eigentümer',
  description:
    'Wie SolBauTec Referenzprojekte dokumentiert: Standort, Gebäude, verbaute Komponenten, Umsetzung und Ergebnis — veröffentlicht nur mit Zustimmung der Eigentümer.',
  path: '/projekte/',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Projekte', path: '/projekte/' },
];

/**
 * No project is published here yet, and none is invented to fill the page (§43).
 * Instead the page states what a reference at SolBauTec contains and why the
 * list is empty — which is itself information a prospective customer can use.
 * The moment PROJECTS holds documented entries, they render above this text.
 */
export default function ProjektePage() {
  return (
    <>
      <section className={`${styles.head} grain`} aria-labelledby="projekte-headline">
        <div className={`${styles.inner} page-grid`}>
          <div className={styles.intro}>
            <Breadcrumbs trail={TRAIL} />
            <p className="eyebrow">Projekte</p>
            <h1 id="projekte-headline" className={styles.headline}>
              Gebaut, nicht gerendert.
            </h1>
            <p className={styles.lede}>
              Eine Referenz ist erst eine Referenz, wenn sie nachprüfbar ist. Deshalb steht hier
              nichts, das wir nicht belegen können.
            </p>
          </div>
        </div>
      </section>

      {PROJECTS.length === 0 && (
        <Prose eyebrow="Der Stand" title="Diese Seite ist noch leer — mit Absicht." align="left">
          <p>
            Wir veröffentlichen Projekte erst, wenn zwei Dinge vorliegen: die schriftliche Zustimmung
            der Eigentümer und Daten, die wir belegen können. Beides braucht Zeit, und wir halten es
            für den falschen Weg, diese Zeit mit Beispielbildern und geschätzten Zahlen zu
            überbrücken.
          </p>
          <p>
            Bis dahin gilt: Fragen Sie uns nach Referenzen in Ihrer Nähe. Wir stellen den Kontakt
            her, wo Eigentümer damit einverstanden sind — ein Gespräch mit jemandem, der die Anlage
            seit zwei Wintern betreibt, sagt mehr als jede Projektseite.
          </p>
        </Prose>
      )}

      <Prose eyebrow="Der Maßstab" title="Was in einer Referenz steht." align="right">
        <p>Wenn wir ein Projekt zeigen, gehören diese Angaben dazu:</p>
        <ul>
          <li>
            <strong>Standort und Gebäudetyp.</strong> Baujahr und Bauweise, weil sie den Rahmen
            setzen, in dem alles andere steht.
          </li>
          <li>
            <strong>Ausgangslage.</strong> Welche Heizung, welcher Verbrauch, welches Dach — der
            Zustand vor der Maßnahme.
          </li>
          <li>
            <strong>Verbaute Komponenten.</strong> Was tatsächlich installiert wurde, nicht was
            angeboten war.
          </li>
          <li>
            <strong>Umsetzungszeitraum.</strong> Von der Planung bis zur Inbetriebnahme, inklusive
            der Wartezeiten, die zum Projekt gehören.
          </li>
          <li>
            <strong>Ergebnis.</strong> Was messbar ist, mit Angabe des Messzeitraums. Kein
            hochgerechneter Jahreswert aus zwei Sonnenwochen.
          </li>
        </ul>
      </Prose>

      <PageCta
        headline="Sprechen wir über Ihr Gebäude."
        body="Was bei anderen funktioniert hat, ist ein Anhaltspunkt — mehr nicht. Belastbar wird es erst mit Ihrem Dach, Ihrer Heizung und Ihrem Verbrauch."
      />
    </>
  );
}
