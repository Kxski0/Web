'use client';

import { useGSAP } from '@gsap/react';
import { useRef, type ElementType, type ReactNode } from 'react';
import { REVEAL, SplitText, gsap, prefersReducedMotion } from '@/lib/gsap';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 'load' fires immediately; 'scroll' waits until the block enters the viewport. */
  on?: 'load' | 'scroll';
};

/**
 * Line-by-line mask reveal (§28): each line rides up out of its own clipping box
 * instead of fading in. SplitText's `mask` option builds the overflow wrapper,
 * and `autoSplit` re-splits after webfont load and on resize so the mask never
 * ends up cutting the wrong line.
 *
 * The animation is set up inside useLayoutEffect, so the pre-animation state is
 * applied before first paint — no flash of un-revealed text. If JS never runs,
 * the markup renders as plain readable text.
 */
export function RevealText({ as: Tag = 'div', children, className, delay = 0, on = 'scroll' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            stagger: REVEAL.stagger,
            delay,
            scrollTrigger:
              on === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [on, delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
