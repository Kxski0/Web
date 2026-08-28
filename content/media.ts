/**
 * Zentrale Bildquellen.
 *
 * Zielzustand laut Absprache: Fotos direkt von Unsplash
 * (images.unsplash.com ist in next.config.ts bereits freigeschaltet).
 *
 * Aktueller Stand: Die Netzwerk-Policy der Entwicklungsumgebung blockiert
 * images.unsplash.com, weshalb sich konkrete Foto-IDs von dort aus nicht
 * pruefen liessen. Statt ungeprueft URLs einzusetzen, die als 404 enden
 * koennten, stehen hier vorerst tonale Platzhalter aus /public.
 *
 * Umstellung auf echte Fotos = nur die Strings in dieser Datei ersetzen,
 * z. B.:
 *   hero: 'https://images.unsplash.com/photo-XXXXXXXXXXXXX-XXXXXXXXXXXX?w=2000&q=80&auto=format&fit=crop'
 * Sonst ist nichts anzupassen.
 */
export const media = {
  hero: '/platzhalter/hero.svg',
  anlage: '/platzhalter/flaeche-hell.svg',
  montage: '/platzhalter/flaeche-dunkel.svg',
  team: '/platzhalter/flaeche-hell.svg',
  technik: '/platzhalter/flaeche-dunkel.svg',
  referenzThumbnail: '/platzhalter/quadrat.svg',
} as const;
