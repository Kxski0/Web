/**
 * Bildwelt.
 *
 * Es liegen keine Fotos vor, und aus dieser Umgebung ist kein Bildhost
 * erreichbar. Statt leerer Flaechen tragen gezeichnete Szenen die Bildebene:
 * technische Architekturzeichnungen in der Farbwelt der Marke. Das passt zum
 * Spezifikationsblatt-Charakter des Designsystems besser als ein beliebiges
 * Stockfoto und wirkt gewollt statt fehlend.
 *
 * Aufbau jeder Szene:
 *   1. tonaler Grund (Flaechen in abgestuften Werten der Palette)
 *   2. Massen als gefuellte Formen
 *   3. Linienwerk, das beim Einblenden gezeichnet wird (Klasse "zeichnen")
 *
 * Werden spaeter echte Fotos geliefert, ersetzt <Bild src="..."> die Szene —
 * die Komponente nimmt beides.
 */

const TON = {
  himmelDunkel: '#26221f',
  himmelMittel: '#322d2a',
  grundDunkel: '#1a1715',
  onyx: '#0f0e12',
  vellum: '#f0efe9',
  vellumTief: '#e4e2da',
  vellumTiefer: '#d9d7ce',
  carbon: '#322d2a',
  weiss: '#ffffff',
} as const;

type SzenenProps = { className?: string };

const linien = {
  stroke: TON.carbon,
  strokeWidth: 1.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

const linienHell = { ...linien, stroke: TON.vellum };

/* ------------------------------------------------------------------ *
 * Hero — Energielandschaft bei Daemmerung
 * Interesse liegt rechts oben, weil der Text unten links sitzt.
 * ------------------------------------------------------------------ */
export function SzeneHero({ className }: SzenenProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TON.himmelMittel} />
          <stop offset="62%" stopColor={TON.himmelDunkel} />
          <stop offset="100%" stopColor={TON.grundDunkel} />
        </linearGradient>
        <radialGradient id="sonne" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={TON.vellum} stopOpacity="0.20" />
          <stop offset="100%" stopColor={TON.vellum} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#himmel)" />
      <circle cx="1180" cy="250" r="300" fill="url(#sonne)" />
      <circle cx="1180" cy="250" r="86" fill={TON.vellum} opacity="0.10" />

      {/* Ferne Hoehenzuege */}
      <path d="M0 470 L210 424 L392 462 L560 418 L742 458 L900 430 L1090 466 L1290 428 L1460 460 L1600 436 V900 H0 Z"
        fill={TON.himmelDunkel} opacity="0.85" />
      <path d="M0 528 L240 496 L470 530 L700 494 L940 528 L1180 498 L1420 530 L1600 508 V900 H0 Z"
        fill={TON.grundDunkel} opacity="0.9" />

      {/* Industriebau rechts */}
      <g>
        <rect x="1108" y="396" width="330" height="176" fill={TON.onyx} />
        <path d="M1108 396 L1273 330 L1438 396" fill={TON.grundDunkel} />
        <g {...linienHell} opacity="0.22" className="zeichnen">
          <path d="M1108 396 L1273 330 L1438 396" pathLength={1} />
          <path d="M1160 572 V462 h72 v110 M1290 470 h108 v56 h-108 z" pathLength={1} />
          <path d="M1108 452 h330 M1108 512 h330" pathLength={1} />
        </g>
        {/* Schornstein */}
        <rect x="1466" y="286" width="30" height="286" fill={TON.onyx} />
        <rect x="1461" y="280" width="40" height="12" fill={TON.grundDunkel} />
      </g>

      {/* Solarreihen in Flucht, linke Bildhaelfte */}
      <g>
        {[
          { y: 596, h: 30, x: 40, b: 190, n: 4, o: 0.9 },
          { y: 654, h: 36, x: -10, b: 224, n: 4, o: 0.95 },
          { y: 726, h: 44, x: -70, b: 268, n: 4, o: 1 },
        ].map((reihe, ri) => (
          <g key={ri} opacity={reihe.o}>
            {Array.from({ length: reihe.n }).map((_, i) => {
              const x = reihe.x + i * (reihe.b + 26);
              return (
                <g key={i}>
                  <path
                    d={`M${x} ${reihe.y + reihe.h} L${x + reihe.b * 0.24} ${reihe.y} L${x + reihe.b} ${reihe.y} L${x + reihe.b - reihe.b * 0.24} ${reihe.y + reihe.h} Z`}
                    fill={TON.himmelMittel}
                  />
                  <g {...linienHell} opacity="0.3" strokeWidth={0.8} className="zeichnen">
                    <path
                      d={`M${x + reihe.b * 0.08} ${reihe.y + reihe.h} L${x + reihe.b * 0.32} ${reihe.y} M${x + reihe.b * 0.32} ${reihe.y + reihe.h} L${x + reihe.b * 0.56} ${reihe.y} M${x + reihe.b * 0.56} ${reihe.y + reihe.h} L${x + reihe.b * 0.8} ${reihe.y}`}
                      pathLength={1}
                    />
                  </g>
                  <rect x={x + reihe.b * 0.5} y={reihe.y + reihe.h} width="3" height={reihe.h * 0.5} fill={TON.grundDunkel} />
                </g>
              );
            })}
          </g>
        ))}
      </g>

      {/* Freileitung */}
      <g {...linienHell} opacity="0.24" className="zeichnen">
        <path d="M980 560 V392 M956 420 h48 M962 448 h36" pathLength={1} />
        <path d="M1058 566 V430 M1040 452 h36 M1044 474 h28" pathLength={1} />
        <path d="M980 400 C 1010 424 1030 430 1058 438" pathLength={1} />
        <path d="M980 428 C 1012 450 1032 456 1058 462" pathLength={1} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Photovoltaik — Dachflaeche in Aufsicht mit Modulraster
 * ------------------------------------------------------------------ */
export function SzenePhotovoltaik({ className }: SzenenProps) {
  const felder = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      felder.push({ r, c });
    }
  }
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.vellumTief} />
      {/* Dachflaeche als Parallelogramm */}
      <path d="M90 690 L440 130 L1120 130 L880 690 Z" fill={TON.vellum} />
      <path d="M90 690 L440 130 L1120 130 L880 690 Z" fill={TON.carbon} opacity="0.04" />

      {/* Module */}
      <g>
        {felder.map(({ r, c }) => {
          const ox = 442 + c * 112 - r * 92;
          const oy = 152 + r * 128;
          return (
            <path
              key={`${r}-${c}`}
              d={`M${ox} ${oy} L${ox + 100} ${oy} L${ox + 100 - 22} ${oy + 112} L${ox - 22} ${oy + 112} Z`}
              fill={TON.carbon}
              opacity={0.82 - r * 0.06}
            />
          );
        })}
      </g>

      {/* Fugen */}
      <g {...linien} strokeWidth={0.9} opacity="0.5" className="zeichnen">
        <path d="M90 690 L440 130 M1120 130 L880 690 M440 130 L1120 130" pathLength={1} />
      </g>

      {/* Firstlinie und Gebaeudekante */}
      <g {...linien} className="zeichnen">
        <path d="M90 690 L880 690" pathLength={1} />
        <path d="M90 690 V810 L880 810 V690" pathLength={1} />
        <path d="M200 810 V722 M400 810 V722 M600 810 V722 M780 810 V722" pathLength={1} opacity="0.45" />
      </g>

      {/* Ertragskurve, dezent */}
      <g {...linien} opacity="0.35" className="zeichnen">
        <path d="M100 878 C 320 878 380 848 520 840 S 860 828 1120 824" pathLength={1} />
      </g>
      <circle cx="1120" cy="824" r="5" fill={TON.carbon} opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Energieberatung — Gebaeudeschnitt mit Verlusten
 * ------------------------------------------------------------------ */
export function SzeneEnergieberatung({ className }: SzenenProps) {
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.carbon} />
      <rect x="0" y="620" width="1200" height="280" fill={TON.grundDunkel} />

      {/* Baukoerper im Schnitt */}
      <rect x="330" y="300" width="540" height="320" fill={TON.himmelMittel} />
      <path d="M300 300 L600 130 L900 300 Z" fill={TON.himmelDunkel} />

      {/* Geschossdecken und Raeume */}
      <g {...linienHell} opacity="0.3" className="zeichnen">
        <path d="M330 408 h540 M330 514 h540" pathLength={1} />
        <path d="M510 300 V620 M690 300 V620" pathLength={1} />
        <path d="M300 300 L600 130 L900 300" pathLength={1} />
        <path d="M330 300 V620 M870 300 V620 M330 620 h540" pathLength={1} />
      </g>

      {/* Fenster */}
      <g fill={TON.vellum} opacity="0.14">
        <rect x="372" y="336" width="52" height="52" />
        <rect x="560" y="336" width="52" height="52" />
        <rect x="748" y="336" width="52" height="52" />
        <rect x="372" y="442" width="52" height="52" />
        <rect x="748" y="442" width="52" height="52" />
      </g>

      {/* Verlustpfeile nach aussen */}
      <g {...linienHell} opacity="0.5" className="zeichnen">
        <path d="M330 360 H236 M266 342 L236 360 L266 378" pathLength={1} />
        <path d="M330 470 H252 M282 452 L252 470 L282 488" pathLength={1} />
        <path d="M870 360 H964 M934 342 L964 360 L934 378" pathLength={1} />
        <path d="M870 470 H948 M918 452 L948 470 L918 488" pathLength={1} />
        <path d="M600 130 V54 M582 84 L600 54 L618 84" pathLength={1} />
      </g>

      {/* Messraster */}
      <g {...linienHell} opacity="0.12" strokeWidth={0.7} className="zeichnen">
        <path d="M120 620 h960 M120 190 V620 M1080 190 V620" pathLength={1} />
        <path d="M120 300 h60 M1020 300 h60 M120 408 h60 M1020 408 h60 M120 514 h60 M1020 514 h60" pathLength={1} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Waerme — Kreislauf aus Quelle, Pumpe und Speicher
 * ------------------------------------------------------------------ */
export function SzeneWaerme({ className }: SzenenProps) {
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.vellumTiefer} />
      <rect x="0" y="0" width="1200" height="900" fill={TON.vellum} opacity="0.45" />

      {/* Aussengeraet */}
      <rect x="120" y="420" width="250" height="200" fill={TON.carbon} opacity="0.9" />
      <circle cx="245" cy="520" r="66" fill={TON.vellum} opacity="0.16" />
      <g {...linienHell} opacity="0.5" className="zeichnen">
        <path d="M245 462 A58 58 0 0 1 297 548" pathLength={1} />
        <path d="M245 578 A58 58 0 0 1 193 492" pathLength={1} />
      </g>
      <circle cx="245" cy="520" r="9" fill={TON.vellum} opacity="0.5" />

      {/* Speicher */}
      <rect x="830" y="330" width="180" height="330" rx="86" fill={TON.carbon} opacity="0.88" />
      <g {...linienHell} opacity="0.3" className="zeichnen">
        <path d="M856 430 h128 M856 496 h128 M856 562 h128" pathLength={1} />
      </g>

      {/* Leitungen */}
      <g {...linien} strokeWidth={1.6} className="zeichnen">
        <path d="M370 480 H600 C 660 480 660 396 720 396 H830" pathLength={1} />
        <path d="M370 566 H560 C 640 566 640 620 720 620 H830" pathLength={1} />
      </g>

      {/* Heizkoerper rechts unten */}
      <g {...linien} opacity="0.55" className="zeichnen">
        <path d="M900 720 h240 M900 720 V830 M1140 720 V830 M900 830 h240" pathLength={1} />
        <path d="M940 730 V820 M980 730 V820 M1020 730 V820 M1060 730 V820 M1100 730 V820" pathLength={1} />
      </g>

      {/* Bodenlinie */}
      <g {...linien} opacity="0.3" className="zeichnen">
        <path d="M60 660 h1080" pathLength={1} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Bau — Tragwerk und Geruest
 * ------------------------------------------------------------------ */
export function SzeneBau({ className }: SzenenProps) {
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.vellumTief} />

      {/* Baumasse */}
      <rect x="250" y="250" width="620" height="470" fill={TON.carbon} opacity="0.10" />
      <rect x="250" y="250" width="300" height="470" fill={TON.carbon} opacity="0.08" />

      {/* Tragwerk */}
      <g {...linien} className="zeichnen">
        <path d="M250 720 V250 h620 v470" pathLength={1} />
        <path d="M250 372 h620 M250 486 h620 M250 604 h620" pathLength={1} />
        <path d="M404 250 V720 M560 250 V720 M716 250 V720" pathLength={1} />
      </g>

      {/* Diagonalen als Aussteifung */}
      <g {...linien} opacity="0.4" strokeWidth={0.9} className="zeichnen">
        <path d="M250 372 L404 250 M404 486 L560 372 M560 604 L716 486 M716 720 L870 604" pathLength={1} />
      </g>

      {/* Kran */}
      <g {...linien} strokeWidth={1.4} className="zeichnen">
        <path d="M980 780 V150" pathLength={1} />
        <path d="M700 150 H1120" pathLength={1} />
        <path d="M980 150 L1120 196 M980 150 L700 196" pathLength={1} opacity="0.5" />
        <path d="M820 150 V296" pathLength={1} />
        <path d="M786 296 h68 v46 h-68 z" pathLength={1} />
      </g>

      {/* Bodenlinie */}
      <g {...linien} className="zeichnen">
        <path d="M80 780 h1040" pathLength={1} />
      </g>
      <rect x="0" y="780" width="1200" height="120" fill={TON.carbon} opacity="0.06" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Immobilien — Fassadenraster
 * ------------------------------------------------------------------ */
export function SzeneImmobilien({ className }: SzenenProps) {
  const fenster = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) {
      // Unregelmaessige Belegung, damit das Raster nicht mechanisch wirkt
      const belegt = (r * 7 + c * 3) % 4 !== 0;
      fenster.push({ r, c, belegt });
    }
  }
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.carbon} />
      <rect x="150" y="90" width="900" height="740" fill={TON.himmelMittel} />

      <g>
        {fenster.map(({ r, c, belegt }) => (
          <rect
            key={`${r}-${c}`}
            x={206 + c * 118}
            y={150 + r * 138}
            width="78"
            height="94"
            fill={TON.vellum}
            opacity={belegt ? 0.17 : 0.05}
          />
        ))}
      </g>

      <g {...linienHell} opacity="0.22" className="zeichnen">
        <path d="M150 90 h900 v740 h-900 z" pathLength={1} />
        <path d="M150 288 h900 M150 426 h900 M150 564 h900 M150 702 h900" pathLength={1} />
      </g>

      {/* Eingang */}
      <rect x="536" y="736" width="128" height="94" fill={TON.grundDunkel} />
      <g {...linienHell} opacity="0.35" className="zeichnen">
        <path d="M600 736 V830" pathLength={1} />
        <path d="M470 830 h260" pathLength={1} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Unternehmen — Gebaeude mit Vorplatz
 * ------------------------------------------------------------------ */
export function SzeneUnternehmen({ className }: SzenenProps) {
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.vellumTief} />
      <rect x="0" y="660" width="1200" height="240" fill={TON.carbon} opacity="0.05" />

      {/* Hauptbau */}
      <rect x="270" y="190" width="560" height="470" fill={TON.carbon} opacity="0.90" />
      <rect x="830" y="330" width="230" height="330" fill={TON.carbon} opacity="0.70" />
      <rect x="140" y="400" width="130" height="260" fill={TON.carbon} opacity="0.55" />

      {/* Fensterbaender */}
      <g fill={TON.vellum} opacity="0.18">
        <rect x="310" y="240" width="480" height="52" />
        <rect x="310" y="342" width="480" height="52" />
        <rect x="310" y="444" width="330" height="52" />
        <rect x="860" y="380" width="170" height="44" />
        <rect x="860" y="466" width="170" height="44" />
      </g>

      {/* Eingang */}
      <rect x="650" y="560" width="140" height="100" fill={TON.grundDunkel} />

      <g {...linien} opacity="0.5" className="zeichnen">
        <path d="M80 660 h1040" pathLength={1} />
        <path d="M270 190 h560 v470 M830 330 h230 v330 M140 400 h130 v260" pathLength={1} />
      </g>

      {/* Vorplatz-Fugen */}
      <g {...linien} opacity="0.18" strokeWidth={0.8} className="zeichnen">
        <path d="M220 716 h800 M180 780 h880 M140 844 h940" pathLength={1} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Tarife — Vergleich als Balkenfeld
 * ------------------------------------------------------------------ */
export function SzeneTarife({ className }: SzenenProps) {
  const balken = [
    { h: 300, o: 0.22 },
    { h: 244, o: 0.28 },
    { h: 356, o: 0.18 },
    { h: 196, o: 0.34 },
    { h: 132, o: 0.9 },
    { h: 268, o: 0.24 },
  ];
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="1200" height="900" fill={TON.vellum} />
      <g>
        {balken.map((b, i) => (
          <rect
            key={i}
            x={180 + i * 148}
            y={640 - b.h}
            width="98"
            height={b.h}
            fill={TON.carbon}
            opacity={b.o}
          />
        ))}
      </g>
      <g {...linien} className="zeichnen">
        <path d="M80 660 h1040" pathLength={1} />
        <path d="M120 508 h980" pathLength={1} opacity="0.2" />
        <path d="M120 376 h980" pathLength={1} opacity="0.2" />
        <path d="M120 244 h980" pathLength={1} opacity="0.2" />
      </g>
      {/* Markierung des guenstigsten Werts */}
      <g {...linien} className="zeichnen">
        <path d="M772 470 V420 h120" pathLength={1} opacity="0.6" />
      </g>
      <circle cx="772" cy="508" r="6" fill={TON.carbon} />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Licht — Leuchtenraster einer Halle
 * ------------------------------------------------------------------ */
export function SzeneLicht({ className }: SzenenProps) {
  const leuchten = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) leuchten.push({ r, c });
  return (
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="lichtkegel" cx="0.5" cy="0" r="1">
          <stop offset="0%" stopColor={TON.vellum} stopOpacity="0.30" />
          <stop offset="100%" stopColor={TON.vellum} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill={TON.carbon} />

      {leuchten.map(({ r, c }) => {
        const x = 200 + c * 200;
        const y = 180 + r * 190;
        return (
          <g key={`${r}-${c}`}>
            <path d={`M${x - 90} ${y} L${x + 90} ${y} L${x + 150} ${y + 190} L${x - 150} ${y + 190} Z`} fill="url(#lichtkegel)" opacity={0.5 - r * 0.12} />
            <rect x={x - 56} y={y - 10} width="112" height="12" fill={TON.vellum} opacity={0.55 - r * 0.12} />
          </g>
        );
      })}

      <g {...linienHell} opacity="0.18" className="zeichnen">
        <path d="M80 120 h1040 M80 310 h1040 M80 500 h1040" pathLength={1} />
        <path d="M120 120 V820 M1080 120 V820" pathLength={1} />
        <path d="M80 820 h1040" pathLength={1} />
      </g>
    </svg>
  );
}
