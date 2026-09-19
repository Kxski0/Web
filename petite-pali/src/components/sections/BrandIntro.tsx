import { MATERIALS, ORIGIN, SIZES } from '@/content/facts';
import styles from './BrandIntro.module.css';

/**
 * Die Zahlen unten sind keine Marketingkennzahlen, sondern Angaben des Ladens:
 * die Größenspanne, die Herkunft der Ware und die Materialien. Jede davon ist
 * im bestehenden Auftritt belegt.
 */
export function BrandIntro() {
  return (
    <section className={styles.section} id="boutique">
      <div className="page-grid">
        <h2 className={styles.lead}>Ein kleiner Laden für ganz besondere Anfänge.</h2>

        <div className={styles.body}>
          <p>
            Petite Pali ist inhabergeführt. Was hier hängt, ist einzeln ausgesucht — nicht nach
            Einkaufsliste, sondern danach, ob sich im Laden begründen lässt, warum es hängt: wie
            sich der Stoff anfühlt, was er nach dem fünften Waschgang macht, ob ein Kind den
            Schnitt allein anbekommt.
          </p>
          <p>
            Das begrenzt das Sortiment. Es ist der Grund, warum Sie hier zu jedem Teil eine Antwort
            bekommen, statt auf ein Regal gezeigt zu bekommen.
          </p>
          <p>
            Beraten wird, wer beraten werden möchte. Wer nur schauen will, darf auch nur schauen.
          </p>
        </div>

        <ul className={styles.facts}>
          <li className={styles.fact}>
            <span className={styles.factValue}>
              {SIZES.from} – {SIZES.to}
            </span>
            <span className={styles.factLabel}>
              Größen, von Frühchen bis Grundschule — im selben Laden.
            </span>
          </li>
          <li className={styles.fact}>
            <span className={styles.factValue}>{ORIGIN.share}</span>
            <span className={styles.factLabel}>der Ware kommt aus {ORIGIN.where}.</span>
          </li>
          <li className={styles.fact}>
            <span className={styles.factValue}>{MATERIALS.length} Materialien</span>
            <span className={styles.factLabel}>
              {MATERIALS.join(', ')} — Naturfasern, weil sie an der Haut liegen.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
