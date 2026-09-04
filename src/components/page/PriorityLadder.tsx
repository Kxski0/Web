import styles from './PriorityLadder.module.css';

/**
 * The order the energy management resolves conflicts in.
 *
 * A ladder rather than a flow chart: the argument on this page is that the
 * components need a SEQUENCE, and a ranked list says that more plainly than
 * boxes and arrows would. Each rung is real text, so the ordering survives
 * without CSS and reads correctly to a screen reader.
 */

const STEPS = [
  {
    rank: '01',
    title: 'Direktverbrauch im Haus',
    body: 'Was gerade gebraucht wird, kommt direkt aus der Erzeugung. Keine Umwandlung, keine Speicherverluste — die günstigste Kilowattstunde ist die, die nirgends zwischengelagert wird.',
  },
  {
    rank: '02',
    title: 'Flexible große Verbraucher',
    body: 'Wärmepumpe, Warmwasser, Fahrzeug. Sie können Energie in Wärme oder in eine Batterie legen, die ohnehin gefüllt werden muss, und sind zeitlich verschiebbar.',
  },
  {
    rank: '03',
    title: 'Hausspeicher',
    body: 'Was danach übrig bleibt, geht in den Speicher — mit Blick auf die Prognose, damit am Mittag noch Aufnahmefähigkeit vorhanden ist.',
  },
  {
    rank: '04',
    title: 'Einspeisung ins Netz',
    body: 'Der Rest. Nicht das Ziel, aber auch kein Verlust — nur die am schlechtesten vergütete Verwendung.',
  },
];

export function PriorityLadder() {
  return (
    <section className={styles.section} aria-labelledby="ladder-headline">
      <div className={`${styles.inner} page-grid`}>
        <h2 id="ladder-headline" className={styles.headline}>
          Die Reihenfolge, in der eigener Strom verwendet wird.
        </h2>
        <ol className={styles.list}>
          {STEPS.map((step) => (
            <li key={step.rank} className={styles.step}>
              <span className={styles.rank}>{step.rank}</span>
              <div>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
