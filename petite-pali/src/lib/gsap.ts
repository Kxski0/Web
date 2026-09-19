'use client';

/**
 * Einziger Registrierungspunkt für GSAP-Plugins.
 *
 * DrawSVG wird hier nicht registriert: diese Seite zeichnet keine Pfade, und
 * ein Plugin zu laden, das niemand benutzt, kostet nur Gewicht.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** Budget für redaktionelle Einblendungen. Getrennt vom Budget der Bedienelemente. */
export const REVEAL = {
  duration: 0.78,
  ease: 'power3.out',
  stagger: 0.07,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText };
