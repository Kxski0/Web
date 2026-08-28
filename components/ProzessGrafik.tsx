import { cn } from '@/lib/cn';

/**
 * Schematische Gebaeude-Energie-Visualisierung.
 *
 * Fuenf Ebenen, die den fuenf Prozessschritten entsprechen und beim Scrollen
 * nacheinander gezeichnet werden:
 *   0 Gebaeude  1 Verluste  2 Analyse  3 Photovoltaik und Speicher  4 Kostenverlauf
 *
 * Bewusst eine Strichzeichnung statt Icons oder Illustration: Das System
 * schliesst Icons aus, und eine technische Zeichnung passt zur
 * Spezifikationsblatt-Anmutung. Linien werden ueber pathLength gezeichnet.
 */
export function ProzessGrafik({ stufe }: { stufe: number }) {
  const ebene = (index: number) =>
    cn(
      'transition-all duration-1000 ease-out motion-reduce:transition-none',
      stufe >= index ? 'opacity-100 [stroke-dashoffset:0]' : 'opacity-0 [stroke-dashoffset:1]',
    );

  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
      className="w-full [&_path]:[stroke-dasharray:1] [&_line]:[stroke-dasharray:1] [&_polyline]:[stroke-dasharray:1]"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 0 — Gebaeude */}
      <g className={ebene(0)}>
        <line x1="60" y1="340" x2="380" y2="340" pathLength={1} />
        <path d="M110 340 V200 M310 340 V200" pathLength={1} />
        <path d="M95 200 L210 130 L325 200" pathLength={1} />
        <path d="M180 340 V280 H240 V340" pathLength={1} />
      </g>

      {/* 1 — Wo Energie verloren geht */}
      <g className={ebene(1)} opacity={0.75}>
        <path d="M110 235 H72 M110 275 H80" pathLength={1} />
        <path d="M310 235 H348 M310 275 H340" pathLength={1} />
        <path d="M210 130 V96" pathLength={1} />
      </g>

      {/* 2 — Analyse */}
      <g className={ebene(2)} opacity={0.4} strokeWidth="0.75">
        <path d="M145 168 V340 M180 148 V340 M240 148 V340 M275 168 V340" pathLength={1} />
      </g>

      {/* 3 — Photovoltaik und Speicher */}
      <g className={ebene(3)}>
        <path d="M124 190 L152 173 L176 173 L152 190 Z" pathLength={1} />
        <path d="M158 186 L186 169 L210 169 L186 186 Z" pathLength={1} />
        <path d="M192 182 L220 165 L244 165 L220 182 Z" pathLength={1} />
        <path d="M330 288 H372 V340 H330 Z" pathLength={1} />
        <path d="M310 300 H330" pathLength={1} />
        <path d="M345 302 V326 M357 302 V326" pathLength={1} opacity={0.5} />
      </g>

      {/* 4 — Kostenverlauf */}
      <g className={ebene(4)}>
        <path
          d="M110 372 C 158 372 176 392 224 396 S 300 402 340 403"
          pathLength={1}
        />
        <circle cx="340" cy="403" r="3.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
