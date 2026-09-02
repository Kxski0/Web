import styles from './EnergySystem.module.css';

type Props = {
  /** Layer ids currently switched on. Layers accumulate across phases. */
  visible: Set<string>;
  /** Suppresses the travelling pulse; the drawn paths still carry the meaning. */
  stillFlow: boolean;
};

/**
 * Architectural section of a house, drawn rather than rendered.
 *
 * Deliberately SVG and not WebGL. The brief asks for high-grade information
 * visualisation, not a 3D scene: a section drawing stays razor-sharp at any
 * density, weighs a few kilobytes instead of a few hundred, carries a real
 * accessible description, and can be authored to actual architectural
 * proportions. A three.js house would cost the page a renderer and buy nothing
 * the drawing does not already say.
 *
 * Every conductor is a real path. The amber pulse travels those same paths via
 * stroke-dashoffset, so the light follows the wiring instead of decorating it.
 */
export function HouseDiagram({ visible, stillFlow }: Props) {
  const on = (id: string) => (visible.has(id) ? 'true' : 'false');

  return (
    <svg
      viewBox="0 0 880 540"
      className={styles.diagram}
      role="img"
      aria-label="Schnitt durch ein Wohnhaus: Photovoltaikmodule auf der rechten Dachfläche, Wechselrichter, Stromspeicher und Energiemanagement im Technikraum, Wärmepumpe an der Außenwand. Linien zeigen, wie der Strom zwischen den Komponenten verteilt wird."
      data-still={stillFlow}
    >
      {/* --- Ground ------------------------------------------------------- */}
      <g className={styles.layer} data-on="true">
        <line x1="60" y1="470" x2="830" y2="470" className={styles.ground} />
      </g>

      {/* --- Building shell ----------------------------------------------- */}
      <g className={styles.layer} data-on={on('house')}>
        <path
          d="M300 470 L300 290 L500 150 L700 290 L700 470"
          className={styles.structure}
          pathLength={1}
        />
        <line x1="300" y1="380" x2="700" y2="380" className={styles.structureThin} pathLength={1} />
        <line x1="300" y1="290" x2="700" y2="290" className={styles.structureThin} pathLength={1} />
      </g>

      {/* --- Photovoltaic array ------------------------------------------- */}
      <g className={styles.layer} data-on={on('pv')}>
        <polygon points="503,146 703,286 710,275 510,135" className={styles.array} />
        {Array.from({ length: 7 }, (_, i) => {
          const t = (i + 1) / 8;
          return (
            <line
              key={i}
              x1={503 + (703 - 503) * t}
              y1={146 + (286 - 146) * t}
              x2={510 + (710 - 510) * t}
              y2={135 + (275 - 135) * t}
              className={styles.arrayDivision}
            />
          );
        })}
      </g>

      {/* --- Sun ---------------------------------------------------------- */}
      <g className={styles.layer} data-on={on('sun')}>
        <circle cx="810" cy="70" r="17" className={styles.sun} />
      </g>

      {/* --- Components ----------------------------------------------------
          Labels sit outside the drawing, below the ground line, so no caption
          ever lands on a conductor or inside a component. */}
      <g className={styles.layer} data-on={on('inverter')}>
        <rect x="640" y="392" width="42" height="56" className={styles.component} />
        <line x1="648" y1="408" x2="674" y2="408" className={styles.componentDetail} />
        <text x="661" y="494" className={styles.label}>
          Wechselrichter
        </text>
      </g>

      <g className={styles.layer} data-on={on('storage')}>
        <rect x="520" y="390" width="46" height="70" className={styles.component} />
        <line x1="520" y1="413" x2="566" y2="413" className={styles.componentDetail} />
        <line x1="520" y1="436" x2="566" y2="436" className={styles.componentDetail} />
        <text x="543" y="494" className={styles.label}>
          Speicher
        </text>
      </g>

      <g className={styles.layer} data-on={on('heatpump')}>
        <rect x="120" y="408" width="84" height="62" className={styles.component} />
        <circle cx="162" cy="439" r="19" className={styles.componentDetail} />
        <circle cx="162" cy="439" r="4" className={styles.componentDetail} />
        <text x="162" y="494" className={styles.label}>
          Wärmepumpe
        </text>
      </g>

      <g className={styles.layer} data-on={on('load')}>
        <circle cx="400" cy="420" r="10" className={styles.node} />
        <text x="400" y="494" className={styles.label}>
          Haushalt
        </text>
        <line x1="400" y1="430" x2="400" y2="478" className={styles.leader} />
      </g>

      {/* --- Conductors ---------------------------------------------------
          Each pair is the same geometry twice: a hairline that draws itself in
          when its phase arrives, and a short amber dash that travels it. */}
      <FlowPath id="flowSun" d="M 798 84 L 625 195" visible={visible} dashed />
      <FlowPath
        id="flowDc"
        d="M 603 216 L 603 300 L 661 300 L 661 392"
        visible={visible}
        delay={0}
      />
      {/*
        Every conductor leaves the inverter, because that is the only component
        present when it first appears. A line drawn from the energy management
        unit before that unit exists would show current coming out of nothing.
        The management unit is inserted INTO the distribution line later, which
        is both what it does electrically and what phase 06 says it does.
      */}
      <FlowPath id="flowStorage" d="M 640 420 L 566 420" visible={visible} delay={1.4} />
      <FlowPath
        id="flowHeat"
        d="M 648 392 L 648 330 L 162 330 L 162 408"
        visible={visible}
        delay={2.2}
      />
      <FlowPath
        id="flowLoad"
        d="M 603 434 L 603 452 L 400 452 L 400 430"
        visible={visible}
        delay={1.8}
      />

      {/* Drawn last so it covers the distribution line passing beneath it. */}
      <g className={styles.layer} data-on={on('ems')}>
        <rect x="586" y="400" width="34" height="34" className={styles.componentAccent} />
        <circle cx="603" cy="417" r="4.5" className={styles.emsCore} />
        {/* Leader into the empty upper floor — the only clear space nearby. */}
        <line x1="603" y1="400" x2="603" y2="352" className={styles.leader} />
        <text x="603" y="342" className={styles.label}>
          Energiemanagement
        </text>
      </g>
    </svg>
  );
}

function FlowPath({
  id,
  d,
  visible,
  dashed = false,
  delay = 0,
}: {
  id: string;
  d: string;
  visible: Set<string>;
  dashed?: boolean;
  /** Offsets the pulse so the conductors do not blink in unison. */
  delay?: number;
}) {
  const on = visible.has(id) ? 'true' : 'false';
  return (
    <g className={styles.layer} data-on={on}>
      <path
        d={d}
        className={dashed ? styles.conductorDashed : styles.conductor}
        pathLength={1}
      />
      {!dashed && (
        <path
          d={d}
          className={styles.pulse}
          pathLength={1}
          style={{ animationDelay: `${-delay}s` }}
        />
      )}
    </g>
  );
}
