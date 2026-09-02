import Image from 'next/image';
import { IMAGES } from '@/lib/assets';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './InvisibleEnergy.module.css';

/**
 * Section 02 — the claim that energy is present but unseen, made literal.
 *
 * The photograph is annotated the way a set of drawings is: a dot, a hairline
 * leader, a small label. That is the section's whole argument — the house looks
 * like any house until someone marks what is actually happening in it. No glow,
 * no particles; an annotation is a statement, and a sparkle is not.
 *
 * The three markers name generic roles (generation, storage, consumption), never
 * specific capacities, because no figure for this building is documented.
 */

const MARKERS = [
  { id: 'erzeugung', label: 'Erzeugung', top: '26%', left: '58%', from: 'right' },
  { id: 'speicherung', label: 'Speicherung', top: '62%', left: '73%', from: 'right' },
  { id: 'verbrauch', label: 'Verbrauch', top: '58%', left: '38%', from: 'left' },
] as const;

export function InvisibleEnergy() {
  return (
    <section className={`${styles.section} grain`} aria-labelledby="invisible-headline">
      <div className={styles.frame}>
        <Image
          src={IMAGES.finishedHouseEvening.src}
          alt={IMAGES.finishedHouseEvening.alt}
          width={IMAGES.finishedHouseEvening.width}
          height={IMAGES.finishedHouseEvening.height}
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.scrim} />

        {/* Decorative: each marker's meaning is carried by the prose below. */}
        <div className={styles.markers} aria-hidden="true">
          {MARKERS.map((marker, index) => (
            <span
              key={marker.id}
              className={styles.marker}
              data-from={marker.from}
              style={{ top: marker.top, left: marker.left, '--i': index } as React.CSSProperties}
            >
              <span className={styles.markerDot} />
              <span className={styles.markerLine} />
              <span className={styles.markerLabel}>{marker.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className={`${styles.content} page-grid`}>
        <div className={styles.text}>
          <Eyebrow index="02">Unsichtbare Energie</Eyebrow>
          <h2 id="invisible-headline" className={styles.headline}>
            {/* Three authored lines rather than two: at every column width the
                two-line version re-wrapped and stranded "nicht." on its own. */}
            Energie ist da.
            <br />
            Man sieht sie
            <br />
            nur nicht.
          </h2>
        </div>
        <div className={styles.lede}>
          <p>
            Von außen sieht ein Haus mit Energiesystem aus wie jedes andere Haus. Was es
            unterscheidet, liegt hinter der Fassade: eine Erzeugung auf dem Dach, ein Speicher im
            Technikraum, ein Verbrauch, der sich danach richtet, wann eigener Strom da ist.
          </p>
          <p>
            Unsere Arbeit besteht darin, diese drei Größen so aufeinander abzustimmen, dass möglichst
            wenig davon den Weg über das öffentliche Netz nimmt.
          </p>
        </div>
      </div>
    </section>
  );
}
