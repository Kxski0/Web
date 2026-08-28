'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cluster, leistungenNachCluster } from '@/content/leistungen';
import { Reveal } from './Reveal';
import { cn } from '@/lib/cn';

/**
 * "Was koennen wir fuer Sie optimieren?"
 *
 * Bewusst keine Karten mit Icons, sondern grosse typografische Zeilen: Der
 * Brief verlangt Komposition statt Komponentenhaufen, und das Designsystem
 * schliesst Icons aus. Die Zeilen tragen den Bereichsnamen gross, die
 * enthaltenen Leistungen klein daneben — beim Ueberfahren tritt die aktive
 * Zeile hervor und die uebrigen treten zurueck.
 */
export function BereichListe() {
  const [aktiv, setAktiv] = useState<string | null>(null);

  return (
    <ul
      className="border-t border-hairline"
      onMouseLeave={() => setAktiv(null)}
    >
      {cluster.map((c, i) => {
        const eintraege = leistungenNachCluster(c.id);
        const gedimmt = aktiv !== null && aktiv !== c.id;

        return (
          <Reveal as="li" key={c.id} delay={i * 60}>
            <div
              onMouseEnter={() => setAktiv(c.id)}
              className={cn(
                'border-b border-hairline py-8 transition-opacity duration-300 md:py-10',
                gedimmt ? 'opacity-55' : 'opacity-100',
              )}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-12">
                <h3
                  className={cn(
                    'text-heading font-light transition-colors duration-300',
                    aktiv === c.id ? 'text-kupfer' : 'text-carbon-warm',
                  )}
                >
                  {c.name}
                </h3>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 md:max-w-lg md:justify-end">
                  {eintraege.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/${l.slug}`}
                        className="text-body-sm text-text-muted transition-colors hover:text-carbon-warm"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
