'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ACTIONS, NAV } from '@/content/nav';
import { CONTACT } from '@/content/site';
import { Wordmark } from './Wordmark';
import styles from './MobileMenu.module.css';

type Props = { open: boolean; onClose: () => void };

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileMenu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const node = panel.current;
    /*
     * Ein Frame warten: `inert` fällt im selben Render weg, in dem `open` wahr
     * wird, aber der Browser wertet das Attribut erst danach aus. Ein .focus()
     * im selben Durchlauf verpufft still.
     */
    const focusFrame = requestAnimationFrame(() => {
      node?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panel}
      className={styles.overlay}
      data-open={open}
      inert={!open ? true : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <div className={`${styles.bar} page-bounds`}>
        <Wordmark />
        <button type="button" onClick={onClose} className={styles.close}>
          Schließen
        </button>
      </div>

      <nav className={`${styles.nav} page-bounds`} aria-label="Hauptnavigation mobil">
        {NAV.map((item) => (
          <div key={item.href}>
            <Link href={item.href} className={styles.item} onClick={onClose}>
              {item.label}
            </Link>
            {item.children && (
              <div className={styles.sub}>
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href} className={styles.subLink} onClick={onClose}>
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className={`${styles.footer} page-bounds`}>
        <Link href={ACTIONS[0].href} onClick={onClose} className={styles.cta}>
          {ACTIONS[0].label}
        </Link>
        <Link href={ACTIONS[1].href} onClick={onClose} className={styles.ctaGhost}>
          {ACTIONS[1].label}
        </Link>
        {CONTACT.verified && (
          <p className={styles.hours}>
            {CONTACT.hours.map((h) => `${h.label} ${h.opens}–${h.closes} Uhr`).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
