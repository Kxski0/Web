'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** The server has no preference to read, so it renders the motion-enabled tree. */
const getServerSnapshot = () => false;

/**
 * Reduced-motion preference for components that must render *different markup*
 * rather than merely skip an animation — the energy system swaps its pinned
 * sequence for a static, fully assembled diagram.
 *
 * useSyncExternalStore rather than an effect: a media query is an external
 * store, and reading it this way avoids the extra render pass an effect-plus-
 * setState would cause on every mount, while still tracking changes made
 * mid-session.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
