import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import styles from './Secondhand.module.css';

/**
 * Das Unterscheidungsmerkmal des Ladens: neue und gebrauchte Ware stehen
 * nebeneinander, nicht in getrennten Abteilungen. Deshalb bekommt es einen
 * eigenen Abschnitt und nicht eine Zeile im Sortiment.
 */
export function Secondhand() {
  return (
    <section className={styles.section} id="secondhand">
      <div className="page-bounds">
        <div className={styles.head}>
          <Eyebrow index="05">Neu &amp; Secondhand</Eyebrow>
          <RevealText as="h2" className={styles.title}>
            Zwei Wege, ein Regal.
          </RevealText>
        </div>

        <div className={styles.tracks}>
          <div className={`${styles.track} ${styles.trackNeu}`}>
            <p className={styles.trackLabel}>Neu</p>
            <h3 className={styles.trackTitle}>Ausgesucht, nicht eingekauft.</h3>
            <p className={styles.trackBody}>
              Neue Ware kommt in kleinen Mengen und wird einzeln ausgewählt. Was sich im Laden nicht
              begründen lässt, wird nicht bestellt — deshalb hängt hier kein Teil, zu dem niemand
              etwas sagen kann.
            </p>
          </div>

          <div className={styles.track}>
            <p className={styles.trackLabel}>Secondhand</p>
            <h3 className={styles.trackTitle}>Geprüft wie neue Ware.</h3>
            <p className={styles.trackBody}>
              Gebrauchtes wird vor der Annahme durchgesehen: keine Löcher, keine ausgewaschenen
              Farben, keine fehlenden Knöpfe. Kinder wachsen schneller aus Kleidung heraus, als sie
              sie kaputt bekommen — das ist der ganze Grund, warum Secondhand hier funktioniert.
            </p>
          </div>
        </div>

        <p className={styles.note}>
          Ob gerade Ware angenommen wird und zu welchen Bedingungen, klärt sich am schnellsten im
          Laden oder am Telefon — das hängt davon ab, was in der jeweiligen Größe schon da ist.
        </p>

        <div style={{ marginTop: '1.75rem' }}>
          <Button href="/secondhand/" variant="secondary">
            Wie Secondhand hier läuft
          </Button>
        </div>
      </div>
    </section>
  );
}
