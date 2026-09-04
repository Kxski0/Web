import type { ReactNode } from 'react';

/**
 * Section marker. Carries the sequence number as a graphic element, which is
 * how the technical register earns its precision without extra ornament.
 */
export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      {index && <span className="text-[color:var(--color-amber)]">{index}</span>}
      <span>{children}</span>
    </p>
  );
}
