'use client';

/**
 * Single registration point for GSAP plugins.
 *
 * GSAP 3.15 ships SplitText, DrawSVG and ScrollTrigger under the standard
 * no-charge licence, so the reveal and flow work needs no hand-rolled
 * substitutes and no second animation runtime.
 */
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
}

/** Editorial reveal budget (§27). Distinct from the UI micro-interaction budget. */
export const REVEAL = {
  duration: 0.82,
  ease: 'power3.out',
  stagger: 0.07,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
