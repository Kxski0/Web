'use client';

import { useSyncExternalStore } from 'react';

/** Nichts zu abonnieren: der Wert wechselt genau einmal, bei der Hydration. */
const subscribe = () => () => {};

/**
 * Falsch beim Serverrendern und im ersten Durchlauf der Hydration, danach wahr.
 *
 * Gebraucht für Markup, das es im Serverausgabe nicht geben darf — etwa das
 * Hero-Video: `prefers-reduced-motion` ist auf dem Server nicht bekannt, und ein
 * Video-Element, das ausgeliefert wird, lädt seine Datei, bevor React
 * entscheiden könnte, es zu entfernen.
 *
 * useSyncExternalStore statt eines Effekts mit setState: der Wert ist von außen
 * vorgegeben, nicht vom Zustand der Komponente, und ein setState im Effektrumpf
 * erzwingt einen zusätzlichen Renderdurchlauf bei jedem Mounten.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
