/**
 * Zentrale Bildquellen.
 *
 * Zielzustand laut Briefing: grosse, hochwertige Bilder aus den Bereichen
 * Architektur, Energie-Infrastruktur, Solaranlagen und moderne Gebaeude —
 * ausdruecklich KEINE generischen Solar-Stockfotos, keine Menschen mit
 * Schutzhelm und Tablet, keine KI-Menschen. Fuer Unternehmen und Team sind
 * echte Aufnahmen vorgesehen.
 *
 * Aktueller Stand: Es liegen weder eigene Aufnahmen vor, noch ist
 * images.unsplash.com aus dieser Umgebung erreichbar (die Netzwerk-Policy
 * blockiert den Host, konkrete Foto-URLs liessen sich daher nicht pruefen).
 * Statt ungeprueft URLs einzusetzen, die als 404 enden, stehen hier tonale
 * Platzhalter aus /public.
 *
 * Umstellung = ausschliesslich die Strings in dieser Datei ersetzen.
 * images.unsplash.com ist in next.config.ts bereits freigeschaltet.
 */
export const media = {
  hero: '/platzhalter/hero.svg',
  photovoltaik: '/platzhalter/flaeche-hell.svg',
  gebaeude: '/platzhalter/flaeche-mittel.svg',
  energieberatung: '/platzhalter/flaeche-dunkel.svg',
  heizung: '/platzhalter/flaeche-mittel.svg',
  bau: '/platzhalter/flaeche-hell.svg',
  immobilien: '/platzhalter/flaeche-mittel.svg',
  team: '/platzhalter/flaeche-hell.svg',
  quadrat: '/platzhalter/quadrat.svg',
} as const;

/** Bild je Leistungsbereich — fuer die Buehne der Landingpages. */
const nachCluster: Record<string, string> = {
  energiekosten: media.energieberatung,
  erzeugen: media.photovoltaik,
  nutzen: media.heizung,
  gebaeude: media.bau,
  immobilien: media.immobilien,
};

export function bildFuerCluster(clusterId: string): string {
  return nachCluster[clusterId] ?? media.gebaeude;
}

/**
 * Werden tatsaechlich Bilder von Dritten geladen?
 *
 * Steuert den entsprechenden Absatz der Datenschutzerklaerung. So kann dort
 * nie eine Drittanbieter-Einbindung behauptet werden, die es gar nicht gibt —
 * und sie wird auch nicht vergessen, sobald echte Unsplash-URLs eingetragen
 * sind.
 */
export const nutztExterneBilder = Object.values(media).some((pfad) =>
  pfad.startsWith('http'),
);
