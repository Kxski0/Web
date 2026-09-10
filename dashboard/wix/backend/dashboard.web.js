/**
 * Velo Web-Modul: Datenzugriff.
 *
 * Diese Datei gehört in Wix nach `backend/dashboard.web.js`.
 *
 * Sicherheitsprinzip
 * ------------------
 * Jede Funktion ist mit `Permissions.Admin` deklariert. Wix prüft das, bevor
 * der Code überhaupt läuft – ein nicht angemeldeter Besucher kann die Funktion
 * nicht aufrufen, egal was im Browser passiert. Die Wix-Data-Kollektionen
 * bleiben deshalb auf "Admin" gestellt; es gibt keine Leseberechtigung für
 * "Anyone", und es liegt kein Schlüssel im Frontend.
 *
 * Zusätzlich:
 *   - Nur Kollektionen aus der Whitelist sind erreichbar (kein beliebiger
 *     Kollektionsname aus dem Browser).
 *   - Jeder eingehende Datensatz wird serverseitig normalisiert und validiert.
 *     Die Frontend-Prüfung ist Komfort, diese hier ist die verbindliche.
 *   - Es werden nur Felder gespeichert, die im Schema stehen; alles andere
 *     wird verworfen.
 */
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';

import { ENTITIES, ENTITY_ORDER, ACTIVITY_COLLECTION, SETTINGS_COLLECTION } from 'public/bizdash/schema.js';
import { normalizeRecord, validateRecord } from 'public/bizdash/validate.js';

/* Erlaubte Kollektionen: Entitäten plus Aktivitäten und Einstellungen. */
const ENTITY_BY_COLLECTION = new Map(
  ENTITY_ORDER.map((key) => [ENTITIES[key].collection, key]),
);
const EXTRA_COLLECTIONS = new Map([
  ['activity', ACTIVITY_COLLECTION],
  ['settings', SETTINGS_COLLECTION],
]);

const PAGE_SIZE = 1000;

/**
 * Löst einen vom Frontend gelieferten Namen auf einen echten Kollektionsnamen
 * auf. Unbekannte Namen führen zu einem Fehler – niemals zu einem Zugriff.
 */
function resolveCollection(name) {
  if (EXTRA_COLLECTIONS.has(name)) {
    return { collection: EXTRA_COLLECTIONS.get(name), entityKey: null };
  }
  if (ENTITY_BY_COLLECTION.has(name)) {
    return { collection: name, entityKey: ENTITY_BY_COLLECTION.get(name) };
  }
  throw new Error(`Unbekannte Kollektion: ${String(name).slice(0, 60)}`);
}

/** Alle Datensätze einer Kollektion, seitenweise geholt. */
async function readAll(collection) {
  const out = [];
  let result = await wixData.query(collection).limit(PAGE_SIZE).find({ suppressAuth: false });
  out.push(...result.items);
  while (result.hasNext()) {
    result = await result.next();
    out.push(...result.items);
  }
  return out;
}

/**
 * Bereitet einen Datensatz für die Speicherung auf.
 * Rückgabe ist ausschließlich aus Schema-Feldern plus Metadaten aufgebaut.
 */
function sanitize(entityKey, doc, existingRows) {
  if (!entityKey) {
    // Aktivitäten und Einstellungen haben kein Entitätsschema; hier werden nur
    // die bekannten Felder durchgelassen.
    return {
      _id: String(doc._id || '').slice(0, 80) || undefined,
      at: typeof doc.at === 'string' ? doc.at.slice(0, 40) : undefined,
      action: typeof doc.action === 'string' ? doc.action.slice(0, 20) : undefined,
      entityKey: typeof doc.entityKey === 'string' ? doc.entityKey.slice(0, 40) : undefined,
      entityId: typeof doc.entityId === 'string' ? doc.entityId.slice(0, 80) : undefined,
      text: typeof doc.text === 'string' ? doc.text.slice(0, 400) : undefined,
      ...pickSettings(doc),
    };
  }

  const record = normalizeRecord(entityKey, doc);
  const { ok, errors } = validateRecord(entityKey, record, {
    all: existingRows,
    id: doc._id || null,
  });
  if (!ok) {
    const message = Object.values(errors).join(' ');
    throw new Error(`Validierung fehlgeschlagen: ${message}`);
  }

  return {
    ...record,
    _id: doc._id || undefined,
    _createdAt: typeof doc._createdAt === 'string' ? doc._createdAt : new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
  };
}

/** Nur bekannte Einstellungsfelder übernehmen. */
function pickSettings(doc) {
  const keys = ['revenueBasis', 'widgets', 'previewProvider', 'previewTemplate', 'analyzeEndpoint', 'companyName'];
  const out = {};
  for (const key of keys) {
    if (doc[key] !== undefined) out[key] = doc[key];
  }
  return out;
}

/* ---------------------------------------------------------- Endpunkte -- */

/** Verbindungstest – bestätigt Berechtigung und erreichbare Datenbank. */
export const ping = webMethod(Permissions.Admin, async () => ({
  ok: true,
  at: new Date().toISOString(),
  collections: [...ENTITY_BY_COLLECTION.keys(), ...EXTRA_COLLECTIONS.values()],
}));

export const listCollection = webMethod(Permissions.Admin, async (name) => {
  const { collection } = resolveCollection(name);
  return readAll(collection);
});

export const insertRecord = webMethod(Permissions.Admin, async (name, doc) => {
  const { collection, entityKey } = resolveCollection(name);
  const existing = entityKey ? await readAll(collection) : [];
  const clean = sanitize(entityKey, doc || {}, existing);
  return wixData.insert(collection, clean);
});

export const updateRecord = webMethod(Permissions.Admin, async (name, doc) => {
  const { collection, entityKey } = resolveCollection(name);
  if (!doc || !doc._id) throw new Error('Zum Aktualisieren wird eine _id benötigt.');
  const existing = entityKey ? await readAll(collection) : [];
  const clean = sanitize(entityKey, doc, existing);
  return wixData.update(collection, clean);
});

export const removeRecord = webMethod(Permissions.Admin, async (name, id) => {
  const { collection } = resolveCollection(name);
  if (!id) throw new Error('Zum Löschen wird eine _id benötigt.');
  await wixData.remove(collection, String(id));
  return true;
});

/**
 * Ersetzt den Inhalt einer Kollektion vollständig.
 * Wird für Import, Zurücksetzen und das Kürzen des Aktivitätsprotokolls
 * gebraucht. Bewusst als eigene, klar benannte Operation statt als Nebenwirkung
 * eines Updates.
 */
export const replaceCollection = webMethod(Permissions.Admin, async (name, rows) => {
  const { collection, entityKey } = resolveCollection(name);
  const list = Array.isArray(rows) ? rows : [];

  await wixData.truncate(collection);
  if (!list.length) return { count: 0 };

  const clean = [];
  for (const row of list) {
    clean.push(sanitize(entityKey, row, clean));
  }

  // Wix Data verarbeitet Massenoperationen in Blöcken zuverlässiger.
  const CHUNK = 100;
  let inserted = 0;
  for (let i = 0; i < clean.length; i += CHUNK) {
    const result = await wixData.bulkInsert(collection, clean.slice(i, i + CHUNK));
    inserted += result.inserted;
    if (result.errors?.length) {
      throw new Error(`${result.errors.length} Datensätze konnten nicht gespeichert werden.`);
    }
  }
  return { count: inserted };
});
