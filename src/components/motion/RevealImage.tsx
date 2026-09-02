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
 * Mask reveal for photography (§29): the frame opens from the bottom while the
 * picture settles from a slight over-scale. No aggressive zoom — 1.04 is enough
 * to read as movement without turning the photograph into an effect.
 */
export function RevealImage({ slot, className, sizes = '100vw', priority = false }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el || prefersReducedMotion()) return;
      const picture = el.querySelector('img');
      if (!picture) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });

      tl.from(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: REVEAL.duration * 1.1,
        ease: REVEAL.ease,
      }).from(
        picture,
        { scale: 1.04, yPercent: 3, duration: REVEAL.duration * 1.3, ease: REVEAL.ease },
        0,
      );
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
