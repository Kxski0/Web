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
  /**
   * Erzwungenes Seitenverhältnis, z.B. '4 / 5'. Ohne Angabe behält das Bild
   * sein Eigenformat — das ist der Normalfall, weil die Zuschnitte schon in
   * scripts/media.mjs entschieden wurden und nicht im Layout noch einmal
   * beschnitten werden sollen.
   */
  ratio?: string;
};

/**
 * Maskeneinblendung für Fotografie: der Rahmen öffnet sich von unten, während
 * sich das Bild aus einer leichten Übergröße setzt. Kein harter Zoom — 1,03
 * genügt, damit es als Bewegung gelesen wird, ohne das Foto zum Effekt zu
 * machen.
 */
export function RevealImage({ slot, className, sizes = '100vw', priority = false, ratio }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el || prefersReducedMotion()) return;
      const picture = el.querySelector('img');
      if (!picture) return;

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        .from(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: REVEAL.duration, ease: REVEAL.ease })
        .from(picture, { scale: 1.03, duration: REVEAL.duration * 1.4, ease: REVEAL.ease }, 0);
    },
    { scope: frame },
  );

  return (
    <div
      ref={frame}
      className={className}
      style={{
        clipPath: 'inset(0% 0% 0% 0%)',
        overflow: 'hidden',
        position: 'relative',
        ...(ratio ? { aspectRatio: ratio } : {}),
      }}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        width={slot.width}
        height={slot.height}
        sizes={sizes}
        priority={priority}
        style={
          ratio
            ? { objectFit: 'cover', objectPosition: slot.focus, width: '100%', height: '100%' }
            : { width: '100%', height: 'auto' }
        }
      />
    </div>
  );
}
