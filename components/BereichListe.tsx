'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cluster, leistungenNachCluster } from '@/content/leistungen';
import { cn } from '@/lib/cn';

/**
 * "Was koennen wir fuer Sie optimieren?" als horizontale Bahn.
 *
 * Auf breiten Viewports bleibt die Sektion stehen, waehrend die fuenf
 * Bereiche seitlich vorbeilaufen — das Briefing verlangt ausdruecklich
 * horizontale Scrollbereiche, und es unterbricht den senkrechten Fluss der
 * Seite an der Stelle, an der sonst die vierte Liste in Folge kaeme.
 *
 * Zurueckgebaut wird grosszuegig: Unter 1024px und bei
 * prefers-reduced-motion steht schlicht eine Liste untereinander. Eine
 * entfuehrte Scrollrichtung ist auf dem Handy eine Zumutung, und wer
 * Bewegung abbestellt hat, bekommt sie hier nicht durch die Hintertuer.
 */
export function BereichListe() {
  const rahmen = useRef<HTMLDivElement>(null);
  const bahn = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);
  const [versatz, setVersatz] = useState(0);
  const [weite, setWeite] = useState(0);

  // Schritt 1: Ist die horizontale Bahn hier ueberhaupt angebracht?
  useEffect(() => {
    const pruefe = () =>
      setHorizontal(
        window.matchMedia('(min-width: 1024px)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );

    pruefe();
    window.addEventListener('resize', pruefe);
    return () => window.removeEventListener('resize', pruefe);
  }, []);

  // Schritt 2: Erst messen, wenn die Bahn tatsaechlich im DOM steht.
  // Beides in einem Effekt zu erledigen ginge nicht: Beim ersten Durchlauf
  // ist `horizontal` noch false, die Bahn also gar nicht gerendert — die
  // Messung ergaebe null und die Bahn bliebe fuer immer stehen.
  useEffect(() => {
    if (!horizontal) return;

    const miss = () => {
      if (!bahn.current) return;
      // Wie weit muss die Bahn wandern, damit ihr Ende buendig steht?
      setWeite(Math.max(0, bahn.current.scrollWidth - window.innerWidth + 48));
    };

    miss();
    window.addEventListener('resize', miss);
    return () => window.removeEventListener('resize', miss);
  }, [horizontal]);

  useEffect(() => {
    if (!horizontal) return;

    let laeuft = false;
    const beiScroll = () => {
      if (laeuft) return;
      laeuft = true;
      requestAnimationFrame(() => {
        laeuft = false;
        const el = rahmen.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const strecke = el.offsetHeight - window.innerHeight;
        if (strecke <= 0) return;
        // 0 → 1, waehrend die Sektion am oberen Rand klebt
        const anteil = Math.min(1, Math.max(0, -r.top / strecke));
        setVersatz(anteil * weite);
      });
    };

    beiScroll();
    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, [horizontal, weite]);

  const panels = cluster.map((c, i) => {
    const eintraege = leistungenNachCluster(c.id);
    return (
      <article
        key={c.id}
        className={cn(
          'flex flex-col justify-between border-t border-hairline pt-8',
          horizontal
            ? 'h-[58svh] w-[clamp(20rem,32vw,30rem)] shrink-0'
            : 'py-8 lg:py-10',
        )}
      >
        <div>
          <p className="text-label uppercase tracking-[0.12em] text-text-muted">
            {String(i + 1).padStart(2, '0')}
          </p>
          <h3
            className={cn(
              'mt-4 font-light text-carbon-warm',
              horizontal ? 'text-display' : 'text-heading',
            )}
          >
            {c.name}
          </h3>
          <p className="mt-4 max-w-sm text-body text-text-muted">{c.unterzeile}</p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {eintraege.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/${l.slug}`}
                className="text-body-sm text-text-muted transition-colors hover:text-kupfer"
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    );
  });

  if (!horizontal) {
    return <div className="border-b border-hairline">{panels}</div>;
  }

  return (
    /*
      Die Scrollstrecke richtet sich nach der tatsaechlichen Laufweite:
      ein Bildschirm fuer die stehende Sektion, dazu genau so viel, wie die
      Bahn wandern muss. Eine feste Hoehe waere entweder traege (zu lang)
      oder hektisch (zu kurz) — je nach Viewport.
    */
    <div ref={rahmen} style={{ height: `calc(100svh + ${weite}px)` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          ref={bahn}
          style={{ transform: `translate3d(${-versatz}px, 0, 0)` }}
          className="flex gap-12 pl-[max(1.5rem,calc((100vw-var(--page-max-width))/2+1.5rem))] pr-12 will-change-transform"
        >
          {panels}
        </div>
      </div>
    </div>
  );
}
