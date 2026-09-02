import styles from './DayCurve.module.css';

/**
 * Generation against consumption over one day.
 *
 * Deliberately unnumbered. The point is the SHAPE of the mismatch — a single
 * midday bell against a two-peaked household day — and any kilowatt-hour figure
 * printed here would be a number invented for a building we have never seen
 * (§43). The hours on the axis are the only quantities, and those are facts.
 *
 * Drawn rather than charted: it is one idea, and a charting library would cost
 * more than the twelve path commands it takes to say it.
 */
export function DayCurve() {
  return (
    <section className={styles.section} aria-labelledby="curve-title">
      <figure className={`${styles.figure} page-bounds`}>
        <svg viewBox="0 0 900 300" className={styles.svg} role="img" aria-labelledby="curve-title curve-desc">
          <title id="curve-title">Erzeugung und Verbrauch im Tagesverlauf</title>
          <desc id="curve-desc">
            Die Erzeugung der Photovoltaikanlage bildet eine einzelne Kurve mit dem Maximum um die
            Mittagszeit. Der Verbrauch eines Haushalts hat zwei Spitzen, morgens und abends. Zwischen
            den beiden Kurven liegt mittags ein Überschuss, der in den Speicher geht, und morgens
            sowie abends ein Bedarf, den der Speicher deckt.
          </desc>

          <defs>
            <clipPath id="curve-clip-surplus">
              <path d="M120 230 C 260 230, 300 60, 450 60 C 600 60, 640 230, 780 230 Z" />
            </clipPath>
          </defs>

          {/* Baseline and hour marks */}
          <line x1="90" y1="230" x2="830" y2="230" className={styles.axis} />
          {[
            { x: 120, label: '06' },
            { x: 300, label: '09' },
            { x: 450, label: '12' },
            { x: 600, label: '15' },
            { x: 780, label: '21' },
          ].map((tick) => (
            <g key={tick.label}>
              <line x1={tick.x} y1="230" x2={tick.x} y2="238" className={styles.axis} />
              <text x={tick.x} y="258" className={styles.tick}>
                {tick.label}
              </text>
            </g>
          ))}

          {/* Surplus: generation above consumption, clipped to the generation area. */}
          <g clipPath="url(#curve-clip-surplus)">
            <path
              d="M90 214 C 170 214, 190 150, 250 150 C 330 150, 330 196, 430 196 C 540 196, 560 128, 660 128 C 740 128, 760 206, 830 206 L 830 40 L 90 40 Z"
              className={styles.surplus}
            />
          </g>

          {/* Generation */}
          <path
            d="M120 230 C 260 230, 300 60, 450 60 C 600 60, 640 230, 780 230"
            className={styles.generation}
          />

          {/* Consumption */}
          <path
            d="M90 214 C 170 214, 190 150, 250 150 C 330 150, 330 196, 430 196 C 540 196, 560 128, 660 128 C 740 128, 760 206, 830 206"
            className={styles.consumption}
          />

          <text x="450" y="112" className={styles.labelSurplus}>
            Überschuss → Speicher
          </text>
          <text x="250" y="138" className={styles.label}>
            Verbrauch
          </text>
          <text x="450" y="46" className={styles.label}>
            Erzeugung
          </text>
        </svg>

        <figcaption className={styles.caption}>
          Die Erzeugung hat eine Spitze, der Verbrauch zwei — und sie liegen nicht übereinander. Der
          Speicher nimmt auf, was mittags übrig ist, und gibt es ab, wenn abends nichts mehr kommt.
        </figcaption>
      </figure>
    </section>
  );
}
