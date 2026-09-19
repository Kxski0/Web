'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY, IMAGES, type ImageSlotName } from '@/lib/assets';
import styles from './Gallery.module.css';

/**
 * Galerie mit Lightbox.
 *
 * Bedienbar mit Maus, Finger und Tastatur: Pfeiltasten blättern, Escape
 * schließt, der Fokus bleibt in der Auflage gefangen und kehrt danach auf das
 * Bild zurück, von dem aus geöffnet wurde. Die Auflage ist ein `dialog` mit
 * `aria-modal`, damit Hilfsmittel den Rest der Seite ausblenden.
 *
 * Kein Karussell-Paket: Blättern ist ein Index, und den kann React selbst.
 */
export function Gallery({ slots = GALLERY }: { slots?: ImageSlotName[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const isOpen = openAt !== null;

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) => (i === null ? null : (i + delta + slots.length) % slots.length)),
    [slots.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    /*
     * Das auslösende Bild wird beim Öffnen festgehalten, nicht beim Schließen
     * nachgeschlagen: beim Blättern ändert sich der Index, und der Fokus soll
     * am Ende dorthin zurück, wo die Galerie geöffnet wurde.
     */
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const node = overlay.current;
    const focusFrame = requestAnimationFrame(() => {
      node?.querySelector<HTMLElement>('button')?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      const items = Array.from(node.querySelectorAll<HTMLElement>('button'));
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

    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [isOpen, close, step]);

  const current = openAt === null ? null : IMAGES[slots[openAt]];

  return (
    <>
      <ul className={styles.grid}>
        {slots.map((name, i) => {
          const slot = IMAGES[name];
          return (
            <li key={name} className={styles.item}>
              <button
                type="button"
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                className={styles.button}
                onClick={() => setOpenAt(i)}
                aria-haspopup="dialog"
              >
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  width={slot.width}
                  height={slot.height}
                  sizes="(min-width: 75rem) 24vw, (min-width: 48rem) 32vw, 46vw"
                  className={styles.thumb}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div
        ref={overlay}
        className={styles.overlay}
        data-open={isOpen}
        inert={!isOpen ? true : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Galerie"
      >
        <div className={styles.bar}>
          <span className={styles.counter}>{isOpen ? `${openAt + 1} / ${slots.length}` : ''}</span>
          <div className={styles.controls}>
            <button type="button" className={styles.control} onClick={() => step(-1)}>
              <span aria-hidden="true">←</span>
              <span className="sr-only">Vorheriges Bild</span>
            </button>
            <button type="button" className={styles.control} onClick={() => step(1)}>
              <span aria-hidden="true">→</span>
              <span className="sr-only">Nächstes Bild</span>
            </button>
            <button type="button" className={styles.control} onClick={close}>
              Schließen
            </button>
          </div>
        </div>

        <div className={styles.stage}>
          {current && (
            <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" />
          )}
        </div>

        {current && <p className={styles.caption}>{current.alt}</p>}
      </div>
    </>
  );
}
