import type { SzenenName } from '@/components/Bild';

/**
 * Bildebene der Website.
 *
 * Jeder Eintrag hat eine gezeichnete Szene und optional ein Foto. Liegt ein
 * Foto vor, wird es gezeigt; laedt es nicht, faellt <Bild> automatisch auf
 * die Szene zurueck. Es gibt also nie ein kaputtes Bild.
 *
 * ACHTUNG zu den Foto-URLs: Aus der Entwicklungsumgebung ist kein Bildhost
 * erreichbar (Unsplash, Pexels, Picsum, Pixabay, Wikimedia, Flickr — alle
 * geblockt). Die IDs konnten deshalb WEDER auf Existenz geprueft NOCH auf
 * ihr Motiv angesehen werden. Auf einem normalen Server laden sie; wo eine
 * ID nicht mehr stimmt, erscheint die Szene.
 *
 * Motivvorgabe aus dem Briefing: Industrie, Architektur,
 * Energie-Infrastruktur, Solaranlagen, moderne Gebaeude. Ausdruecklich
 * NICHT: Menschen mit Schutzhelm und Tablet, generische Solar-Stockfotos,
 * KI-Menschen.
 *
 * Eigene Aufnahmen einsetzen: `foto` auf einen Pfad unter /public aendern.
 * Das ist der bessere Weg — Bilder liegen dann auf der eigenen Domain, und
 * der Absatz zu Drittanbietern in der Datenschutzerklaerung entfaellt
 * automatisch (siehe `nutztExterneBilder` unten).
 */

export type Bildquelle = { szene: SzenenName; foto?: string };

const unsplash = (id: string, breite = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${breite}&q=80`;

export const media: Record<string, Bildquelle> = {
  hero: { szene: 'hero', foto: unsplash('photo-1466611653911-95081537e5b7', 2000) },
  photovoltaik: { szene: 'photovoltaik', foto: unsplash('photo-1509391366360-2e959784a276') },
  energieberatung: { szene: 'energieberatung', foto: unsplash('photo-1486406146926-c627a92ad1ab') },
  waerme: { szene: 'waerme', foto: unsplash('photo-1518709268805-4e9042af2176') },
  bau: { szene: 'bau', foto: unsplash('photo-1541888946425-d81bb19240f5') },
  immobilien: { szene: 'immobilien', foto: unsplash('photo-1487958449943-2429e8be8625') },
  unternehmen: { szene: 'unternehmen', foto: unsplash('photo-1503387762-592deb58ef4e') },
  tarife: { szene: 'tarife', foto: unsplash('photo-1497435334941-8c899ee9e8e9') },
  licht: { szene: 'licht', foto: unsplash('photo-1565608087341-404b25492fee') },
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
 * und sie wird auch nicht vergessen. Werden die Fotos spaeter durch eigene
 * Aufnahmen unter /public ersetzt, schaltet sich der Absatz von selbst ab.
 */
export const nutztExterneBilder = Object.values(media).some((q) =>
  Boolean(q.foto?.startsWith('http')),
);
