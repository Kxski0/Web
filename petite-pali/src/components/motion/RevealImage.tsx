'use client';

import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useRef } from 'react';
import type { ImageSlot } from '@/lib/assets';
import { REVEAL, gsap, prefersReducedMotion } from '@/lib/gsap';

type Props = {
  slot: ImageSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Maskeneinblendung für Fotografie: der Rahmen öffnet sich von unten, während
 * sich das Bild aus einer leichten Übergröße setzt. Kein harter Zoom — 1,04
 * genügt, damit es als Bewegung gelesen wird, ohne das Foto zum Effekt zu
 * machen.
 */
export function RevealImage({ slot, className, sizes = '100vw', priority = false }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el || prefersReducedMotion()) return;
      const picture = el.querySelector('img');
      if (!picture) return;

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        .from(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: REVEAL.duration * 1.1, ease: REVEAL.ease })
        .from(picture, { scale: 1.04, yPercent: 3, duration: REVEAL.duration * 1.3, ease: REVEAL.ease }, 0);
    },
    { scope: frame },
  );

  return (
    <div
      ref={frame}
      className={className}
      style={{ clipPath: 'inset(0% 0% 0% 0%)', overflow: 'hidden', position: 'relative' }}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        width={slot.width}
        height={slot.height}
        sizes={sizes}
        priority={priority}
        style={{ objectFit: 'cover', objectPosition: slot.focus, width: '100%', height: '100%' }}
      />
    </div>
  );
}
