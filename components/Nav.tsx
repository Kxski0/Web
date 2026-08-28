'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { mainNav } from '@/lib/navigation';
import { cn } from '@/lib/cn';

/**
 * Schwebende Navigationsleiste.
 *
 * Die Vorgabe ist an zwei Stellen uneindeutig: Sie nennt die Leiste einmal
 * "oben rechts" und einmal "oben am Viewport mit Logo links", und sie gibt
 * 36px vertikales bei nur 24px horizontalem Padding an — fuer eine
 * schwebende Leiste unplausibel. Gedeutet als: 36px Abstand zum oberen
 * Viewport-Rand, innen 18px/24px. Radius 16px wie im Token; "Pille"
 * beschreibt hier die schwebende Form, nicht den Radius.
 *
 * Die Leiste traegt zusaetzlich eine helle Hairline: Ueber dunklen
 * Industriefotos verschwindet eine reine Carbon-Flaeche sonst spurlos.
 * Ein Rahmen statt eines Schattens — die Schattenlosigkeit bleibt gewahrt.
 *
 * Mobile Navigation ist in der Vorgabe gar nicht definiert. Der Umschalter
 * traegt Text statt eines Burger-Icons, weil Icons ausgeschlossen sind.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Route gewechselt → Menue schliessen, ohne den Fokus zurueckzuholen.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      // Fokus im geoeffneten Panel halten.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-9">
      <div className="container-page">
        <nav
          aria-label="Hauptnavigation"
          className="surface-dark pointer-events-auto flex items-center justify-between gap-6 rounded-[var(--radius-nav)] border border-hairline-inverse bg-carbon-warm px-6 py-[18px]"
        >
          <Link href="/" aria-label="EnergieSaar — zur Startseite">
            <Logo inverse />
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-6 md:flex">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'text-body-sm text-paper-white transition-opacity hover:opacity-65',
                      active && 'underline underline-offset-4',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobil — Text statt Burger-Icon, da das System keine Icons kennt. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="text-body-sm text-paper-white md:hidden"
          >
            {open ? 'Schließen' : 'Menü'}
          </button>
        </nav>
      </div>

      {/* Mobiles Panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="surface-dark pointer-events-auto fixed inset-0 z-40 bg-carbon-warm pt-32 md:hidden"
      >
        <ul className="container-page flex flex-col gap-6">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="text-heading font-light text-paper-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
