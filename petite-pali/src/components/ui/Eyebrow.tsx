import type { ReactNode } from 'react';

/**
 * Abschnittsmarke. Die laufende Nummer ist eine der drei Rollen, in denen
 * Altrosa vorkommt — als Zeichen, nicht als Text: sie steht nie allein für eine
 * Information, die nur über ihre Farbe zu erkennen wäre.
 */
export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      {index && (
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-[var(--radius-pill)] bg-[color:var(--color-blush)] px-2 text-[color:var(--color-bark)]">
          {index}
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}
