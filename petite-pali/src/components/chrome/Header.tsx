'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ACTIONS, NAV } from '@/content/nav';
import { SITE } from '@/content/site';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export function Header() {
  const [overMedia, setOverMedia] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /*
   * Zustand beim Seitenwechsel zurücksetzen — beim Rendern, nicht in einem
   * Effekt. Ein setState im Effektrumpf erzwingt einen zweiten Durchlauf mit
   * veraltetem Zustand dazwischen: das Untermenü bliebe für einen Frame offen,
   * und die helle Schrift der Kopfleiste stünde kurz auf der neuen, hellen
   * Seite. Das hier ist das von React dafür vorgesehene Muster.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenSub(null);
    setOverMedia(false);
  }

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    /*
     * Nur der Hero trägt Bildmaterial unter der Leiste. Ein
     * IntersectionObserver mit einem ein Pixel hohen Beobachtungsstreifen auf
     * Höhe der Leistenmitte beantwortet genau die gestellte Frage — was liegt
     * gerade darunter — ohne Scroll-Handler, der Rechtecke misst.
     */
    const media = document.querySelectorAll('[data-surface="media"]');
    // Ohne Bildmaterial gibt es nichts zu beobachten; der Zustand steht beim
    // Seitenwechsel bereits auf false (siehe oben).
    if (media.length === 0) return;
    const probe = 38;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.setAttribute('data-under-header', String(entry.isIntersecting));
        }
        setOverMedia(document.querySelector('[data-surface="media"][data-under-header="true"]') !== null);
      },
      { rootMargin: `-${probe}px 0px -${window.innerHeight - probe - 1}px 0px`, threshold: 0 },
    );
    media.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Untermenü schließt beim Klick nach außen und bei Escape.
  useEffect(() => {
    if (!openSub) return;
    const onDown = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) setOpenSub(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSub(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openSub]);

  const isCurrent = (href: string) => pathname === href;
  const solid = !overMedia || scrolled;

  return (
    <>
      <header
        className={`${styles.header} ${overMedia && !scrolled ? styles.onMedia : ''}`}
        data-solid={solid}
      >
        <div className={`${styles.inner} page-bounds`}>
          <Link href="/" aria-label={`${SITE.name} — zur Startseite`}>
            <Wordmark onMedia={overMedia && !scrolled} />
          </Link>

          <nav className={styles.nav} aria-label="Hauptnavigation">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  ref={openSub === item.href ? subRef : undefined}
                  className={styles.hasMenu}
                  data-open={openSub === item.href}
                  onMouseEnter={() => setOpenSub(item.href)}
                  onMouseLeave={() => setOpenSub(null)}
                >
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    aria-expanded={openSub === item.href}
                    onClick={() => setOpenSub(null)}
                    onFocus={() => setOpenSub(item.href)}
                  >
                    {item.label}
                    <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <div className={styles.submenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={styles.submenuLink}
                        aria-current={isCurrent(child.href) ? 'page' : undefined}
                        onClick={() => setOpenSub(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.link}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className={styles.actions}>
            <Link href={ACTIONS[1].href} className={styles.actionLink}>
              {ACTIONS[1].label}
            </Link>
            <Link href={ACTIONS[0].href} className={`pressable ${styles.actionCta}`}>
              {ACTIONS[0].label}
            </Link>
          </div>

          <button
            type="button"
            className={`pressable ${styles.menuButton}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menü
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
