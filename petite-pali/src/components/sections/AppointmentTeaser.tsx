import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './AppointmentTeaser.module.css';

const SCHRITTE = [
  'Sie sagen uns, worum es geht und wann es passt.',
  'Wir schlagen einen Termin vor — auch außerhalb der Öffnungszeiten.',
  'Sie kommen, wir nehmen uns Zeit. Ohne anderen Betrieb im Laden.',
];

/**
 * Shopping-Termin. Der bestehende Auftritt bietet diese Möglichkeit an; hier
 * bekommt sie einen eigenen Abschnitt, weil sie die stärkste Handlung der
 * Seite ist. Keine erfundene Buchungssoftware — der Ablauf bleibt persönlich.
 */
export function AppointmentTeaser() {
  return (
    <section className={styles.section} id="shopping-termin">
      <div className="page-bounds">
        <div className={styles.inner}>
          <div>
            <SectionHeading label="Shopping-Termin" title="Nur ihr. Ganz in Ruhe." />
            <p className={styles.body}>
              Manches lässt sich zwischen Tür und Angel nicht entscheiden: die Erstausstattung, die
              richtige Trage, der erste Kinderwagen. Dafür gibt es den Shopping-Termin — auf Wunsch
              auch außerhalb der regulären Öffnungszeiten.
            </p>
            <div className={styles.actions}>
              <Button href="/shopping-termin/">Termin anfragen</Button>
              <Button href="/kontakt/" variant="quiet">
                Lieber anrufen
              </Button>
            </div>
          </div>

          <ol className={styles.list}>
            {SCHRITTE.map((schritt, i) => (
              <li key={schritt} className={styles.item}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span>{schritt}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
