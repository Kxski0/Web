import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealImage } from '@/components/motion/RevealImage';
import { IMAGES } from '@/lib/assets';
import styles from './Craft.module.css';

/**
 * Section 05 — the craft, plus the "material to system" idea from the brief.
 *
 * Three photographs at widening scale: a clamp on a rail, a technician wiring a
 * connector, the finished building. The zoom-out is expressed as composition
 * rather than as a second pinned scroll sequence — the energy system already
 * owns that mechanic on this page, and repeating it would make the signature
 * moment feel like a house style instead of a moment.
 *
 * The frames grow in step with the subject: the macro sits small and inset, the
 * building runs nearly full width. Scale carries the argument.
 */

const SEQUENCE = [
  {
    id: 'material',
    step: 'Material',
    image: IMAGES.solarMaterialDetail,
    caption: 'Eine Klemme, eine Schiene, ein definiertes Drehmoment.',
  },
  {
    id: 'montage',
    step: 'Montage',
    image: IMAGES.technicianDetail,
    caption: 'Jeder Steckverbinder wird von Hand gesetzt und geprüft.',
  },
  {
    id: 'gebaeude',
    step: 'Gebäude',
    image: IMAGES.projectWide,
    caption: 'Am Ende steht kein Produkt am Haus, sondern ein System im Haus.',
  },
] as const;

export function Craft() {
  return (
    <section id="handwerk" className={`${styles.section} grain`} aria-labelledby="craft-headline">
      <div className={`${styles.intro} page-grid`}>
        <div className={styles.introText}>
          <Eyebrow index="05">Handwerk</Eyebrow>
          <h2 id="craft-headline" className={styles.headline}>
            Von der ersten Planung
            <br />
            bis zur letzten Verbindung.
          </h2>
        </div>
        <p className={styles.lede}>
          Ein Energiesystem ist so gut wie seine schlechteste Verbindung. Deshalb endet unsere
          Arbeit nicht bei der Auslegung, sondern bei der Klemme, die jemand mit der Hand
          angezogen hat.
        </p>
      </div>

      <ol className={styles.sequence}>
        {SEQUENCE.map((item, index) => (
          <li
            key={item.id}
            className={`${styles.step} page-grid`}
            data-scale={index}
          >
            <figure className={styles.figure}>
              <RevealImage
                slot={item.image}
                className={styles.frame}
                sizes="(min-width: 64rem) 70vw, 100vw"
              />
              <figcaption className={styles.caption}>
                <span className={styles.stepLabel}>{item.step}</span>
                {item.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <div className={`${styles.people} page-grid`}>
        <div className={styles.peopleMedia}>
          <RevealImage
            slot={IMAGES.teamDocumentary}
            className={styles.peopleFrame}
            sizes="(min-width: 64rem) 58vw, 100vw"
          />
        </div>
        <div className={styles.peopleText}>
          <h3 className={styles.peopleTitle}>Es sind Menschen, die das anschließen.</h3>
          <p className={styles.peopleCopy}>
            Planung, Elektroinstallation und Inbetriebnahme laufen bei uns nicht über verschiedene
            Firmen. Wer die Anlage ausgelegt hat, steht auch daneben, wenn sie das erste Mal Strom
            liefert.
          </p>
        </div>
      </div>
    </section>
  );
}
