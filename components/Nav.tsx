'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { mainNav } from '@/lib/navigation';
import { cluster, leistungenNachCluster } from '@/content/leistungen';
import { cn } from '@/lib/cn';

/**
 * Schwebende Navigationsleiste mit Aufklappmenue fuer die Leistungen.
 *
 * Die Vorgabe ist an zwei Stellen uneindeutig: Sie nennt die Leiste einmal
 * "oben rechts" und einmal "oben am Viewport mit Logo links", und sie gibt
 * 36px vertikales bei nur 24px horizontalem Padding an — fuer eine
 * schwebende Leiste unplausibel. Gedeutet als: 36px Abstand zum oberen
 * Viewport-Rand, innen 18px/24px. Radius 16px wie im Token.
 *
 * Die Leiste traegt eine helle Hairline: Ueber dunklen Bildflaechen
 * verschwindet eine reine Carbon-Flaeche sonst spurlos. Ein Rahmen statt
 * eines Schattens — die Schattenlosigkeit bleibt gewahrt.
 *
 * Das Aufklappmenue gruppiert die zehn Leistungen nach den fuenf Bereichen,
 * statt sie als lange Liste auszuschuetten. Es oeffnet auf Zeigen, auf Klick
 * und auf Tastaturfokus; Escape schliesst und gibt den Fokus zurueck. Auf
 * schmalen Viewports wird daraus ein aufklappbarer Abschnitt im
 * Vollbildmenue — ein schwebendes Untermenue waere dort unbedienbar.
 */
export function Nav() {
  const [mobilOffen, setMobilOffen] = useState(false);
  const [mobilLeistungen, setMobilLeistungen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownKnopfRef = useRef<HTMLButtonElement>(null);
  const bereichRef = useRef<HTMLDivElement>(null);
  const verzoegerung = useRef<number | null>(null);

  const schliesseMobil = useCallback(() => {
    setMobilOffen(false);
    toggleRef.current?.focus();
  }, []);

  // Routenwechsel schliesst alles, ohne den Fokus umzusetzen.
  useEffect(() => {
    setMobilOffen(false);
    setMobilLeistungen(false);
    setDropdown(false);
  }, [pathname]);

  // --- Aufklappmenue: Zeigen mit kurzer Verzoegerung, damit es beim
  // --- Vorbeifahren nicht aufblitzt.
  const planeOeffnen = (offen: boolean) => {
    if (verzoegerung.current) window.clearTimeout(verzoegerung.current);
    verzoegerung.current = window.setTimeout(() => setDropdown(offen), offen ? 70 : 180);
  };

  useEffect(() => () => {
    if (verzoegerung.current) window.clearTimeout(verzoegerung.current);
  }, []);

  // Escape und Klick nach aussen schliessen das Aufklappmenue.
  useEffect(() => {
    if (!dropdown) return;

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setDropdown(false);
      dropdownKnopfRef.current?.focus();
    };
    const beiKlick = (e: MouseEvent) => {
      if (!bereichRef.current?.contains(e.target as Node)) setDropdown(false);
    };
    const beiFokus = (e: FocusEvent) => {
      if (!bereichRef.current?.contains(e.target as Node)) setDropdown(false);
    };

    document.addEventListener('keydown', beiTaste);
    document.addEventListener('mousedown', beiKlick);
    document.addEventListener('focusin', beiFokus);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.removeEventListener('mousedown', beiKlick);
      document.removeEventListener('focusin', beiFokus);
    };
  }, [dropdown]);

  // --- Vollbildmenue: Fokus halten, Escape schliesst.
  useEffect(() => {
    if (!mobilOffen) return;

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        schliesseMobil();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const bedienbar = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (bedienbar.length === 0) return;

      const erstes = bedienbar[0];
      const letztes = bedienbar[bedienbar.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    };

    document.addEventListener('keydown', beiTaste);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a[href], button')?.focus();

    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = '';
    };
  }, [mobilOffen, schliesseMobil]);

  const istLeistungsseite =
    pathname === '/leistungen' ||
    cluster.some((c) => leistungenNachCluster(c.id).some((l) => `/${l.slug}` === pathname));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-9">
      <div className="container-page">
        <nav
          aria-label="Hauptnavigation"
          className="surface-dark pointer-events-auto flex items-center justify-between gap-6 rounded-[var(--radius-nav)] border border-hairline-inverse bg-carbon-warm px-6 py-[18px]"
        >
          <Link href="/" aria-label="Energie Zentrum Saar — zur Startseite">
            <Logo inverse />
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-6 md:flex">
            <li
              ref={bereichRef as never}
              className="relative"
              onMouseEnter={() => planeOeffnen(true)}
              onMouseLeave={() => planeOeffnen(false)}
            >
              <button
                ref={dropdownKnopfRef}
                type="button"
                aria-expanded={dropdown}
                aria-controls="leistungen-menue"
                onClick={() => setDropdown((v) => !v)}
                onFocus={() => setDropdown(true)}
                className={cn(
                  'flex items-center gap-2 text-body-sm text-paper-white transition-opacity hover:opacity-65',
                  istLeistungsseite && 'underline underline-offset-4',
                )}
              >
                Leistungen
                {/* Zeichen statt Icon — das System schliesst Icons aus. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-block text-[10px] leading-none transition-transform duration-300',
                    dropdown && 'rotate-180',
                  )}
                >
                  ▾
                </span>
              </button>
            </li>

            {mainNav
              .filter((i) => i.href !== '/leistungen')
              .map((item) => {
                const aktiv = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={aktiv ? 'page' : undefined}
                      className={cn(
                        'text-body-sm text-paper-white transition-opacity hover:opacity-65',
                        aktiv && 'underline underline-offset-4',
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
            onClick={() => (mobilOffen ? schliesseMobil() : setMobilOffen(true))}
            aria-expanded={mobilOffen}
            aria-controls="mobile-nav"
            className="text-body-sm text-paper-white md:hidden"
          >
            {mobilOffen ? 'Schließen' : 'Menü'}
          </button>
        </nav>

        {/* Aufklappmenue Leistungen — Desktop */}
        <div
          id="leistungen-menue"
          ref={dropdownRef}
          data-offen={dropdown ? 'true' : 'false'}
          onMouseEnter={() => planeOeffnen(true)}
          onMouseLeave={() => planeOeffnen(false)}
          className="navpanel surface-dark pointer-events-auto absolute left-0 right-0 mt-2 hidden md:block"
        >
          <div className="container-page">
            <div className="rounded-[var(--radius-nav)] border border-hairline-inverse bg-carbon-warm px-6 py-8">
              <div className="grid gap-8 lg:grid-cols-5">
                {cluster.map((c) => (
                  <div key={c.id}>
                    <p className="text-label uppercase tracking-[0.12em] text-paper-white/50">
                      {c.name}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {leistungenNachCluster(c.id).map((l) => (
                        <li key={l.slug}>
                          <Link
                            href={`/${l.slug}`}
                            aria-current={pathname === `/${l.slug}` ? 'page' : undefined}
                            className={cn(
                              'text-body-sm text-paper-white transition-opacity hover:opacity-65',
                              pathname === `/${l.slug}` && 'underline underline-offset-4',
                            )}
                          >
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-hairline-inverse pt-6">
                <Link
                  href="/leistungen"
                  className="text-body-sm text-paper-white transition-opacity hover:opacity-65"
                >
                  Alle Leistungen im Überblick
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vollbildmenue — Mobil */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!mobilOffen}
        className="surface-dark pointer-events-auto fixed inset-0 z-40 overflow-y-auto bg-carbon-warm pb-16 pt-32 md:hidden"
      >
        <div className="container-page">
          <ul className="flex flex-col gap-6">
            <li>
              <button
                type="button"
                aria-expanded={mobilLeistungen}
                aria-controls="mobile-leistungen"
                onClick={() => setMobilLeistungen((v) => !v)}
                className="flex w-full items-center justify-between gap-6 text-left text-heading font-light text-paper-white"
              >
                Leistungen
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-paper-white text-body-sm leading-none"
                >
                  {mobilLeistungen ? '−' : '+'}
                </span>
              </button>

              <div id="mobile-leistungen" hidden={!mobilLeistungen} className="mt-6">
                {cluster.map((c) => (
                  <div key={c.id} className="mb-6 last:mb-0">
                    <p className="text-label uppercase tracking-[0.12em] text-paper-white/50">
                      {c.name}
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {leistungenNachCluster(c.id).map((l) => (
                        <li key={l.slug}>
                          <Link
                            href={`/${l.slug}`}
                            className="text-subheading font-light text-paper-white"
                          >
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href="/leistungen"
                  className="text-body-sm text-paper-white/70 underline underline-offset-4"
                >
                  Alle Leistungen im Überblick
                </Link>
              </div>
            </li>

            {mainNav
              .filter((i) => i.href !== '/leistungen')
              .map((item) => (
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
      </div>
    </header>
  );
}
