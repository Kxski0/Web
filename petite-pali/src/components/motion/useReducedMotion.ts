'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** Der Server kennt keine Einstellung und rendert den bewegten Baum. */
const getServerSnapshot = () => false;

/**
 * Für Komponenten, die bei reduzierter Bewegung *anderes Markup* rendern
 * müssen, statt nur eine Animation auszulassen: der Hero lädt dann gar kein
 * Video, und die Lebensphasen-Leiste zeigt alle Phasen gleichzeitig.
 *
 * useSyncExternalStore statt Effekt: eine Media Query ist ein externer Speicher,
 * und so gelesen entfällt der zusätzliche Renderdurchlauf, den Effekt plus
 * setState bei jedem Mounten verursachen würde — Änderungen während der Sitzung
 * werden trotzdem bemerkt.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
