import type { SzenenName } from '@/components/Bild';

/**
 * Bildebene der Website.
 *
 * Es liegen weder eigene Aufnahmen vor, noch ist aus der Entwicklungsumgebung
 * ein Bildhost erreichbar (Unsplash, Pexels, Picsum und Pixabay antworten
 * allesamt nicht — die Netzwerk-Policy blockiert sie). Statt leerer Flaechen
 * oder ungeprueft eingesetzter Foto-URLs, die als 404 enden wuerden, tragen
 * gezeichnete Szenen die Bildebene: technische Architekturzeichnungen in der
 * Farbwelt der Marke, die zum Spezifikationsblatt-Charakter des
 * Designsystems passen.
 *
 * Umstellung auf echte Fotos:
 *   1. Foto nach /public legen oder eine Remote-URL verwenden
 *      (images.unsplash.com ist in next.config.ts freigeschaltet).
 *   2. Hier `foto` statt `szene` eintragen.
 *   3. Sonst nichts — <Bild> nimmt beides, und der Absatz zu
 *      Drittanbieter-Bildern in der Datenschutzerklaerung schaltet sich
 *      ueber `nutztExterneBilder` selbst zu.
 */

export type Bildquelle = { szene: SzenenName; foto?: string };

export const media: Record<string, Bildquelle> = {
  hero: { szene: 'hero' },
  photovoltaik: { szene: 'photovoltaik' },
  energieberatung: { szene: 'energieberatung' },
  waerme: { szene: 'waerme' },
  bau: { szene: 'bau' },
  immobilien: { szene: 'immobilien' },
  unternehmen: { szene: 'unternehmen' },
  tarife: { szene: 'tarife' },
  licht: { szene: 'licht' },
};

/** Bild je Leistungsbereich — fuer die Buehne der Landingpages. */
const nachCluster: Record<string, Bildquelle> = {
  energiekosten: media.tarife,
  erzeugen: media.photovoltaik,
  nutzen: media.waerme,
  gebaeude: media.bau,
  immobilien: media.immobilien,
};

export function bildFuerCluster(clusterId: string): Bildquelle {
  return nachCluster[clusterId] ?? media.unternehmen;
}

/** Bild je einzelner Leistung, wo eine eigene Szene treffender ist. */
const nachSlug: Record<string, Bildquelle> = {
  energieberatung: media.energieberatung,
  'led-beratung': media.licht,
  hausverwaltung: media.immobilien,
};

export function bildFuerLeistung(slug: string, clusterId: string): Bildquelle {
  return nachSlug[slug] ?? bildFuerCluster(clusterId);
}

/**
 * Werden tatsaechlich Bilder von Dritten geladen?
 *
 * Steuert den entsprechenden Absatz der Datenschutzerklaerung. So kann dort
 * nie eine Drittanbieter-Einbindung behauptet werden, die es gar nicht gibt —
 * und sie wird auch nicht vergessen, sobald echte Remote-URLs eingetragen
 * sind.
 */
export const nutztExterneBilder = Object.values(media).some((q) =>
  Boolean(q.foto?.startsWith('http')),
);
