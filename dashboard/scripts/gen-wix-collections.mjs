/**
 * Erzeugt die Wix-CMS-Kollektionsdefinitionen aus dem App-Schema.
 *
 * Die JSON-Dateien landen in dashboard/wix/collections/ und beschreiben Felder,
 * Typen und Berechtigungen. Sie dienen als Bauanleitung für das Wix-CMS
 * (Kollektion anlegen, Felder nach Liste ergänzen) und als Prüfliste.
 *
 * Aufruf: node dashboard/scripts/gen-wix-collections.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ENTITIES, ENTITY_ORDER, ACTIVITY_COLLECTION, SETTINGS_COLLECTION } from '../src/data/schema.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'wix/collections');

/**
 * Abbildung Schema-Typ -> Wix-Data-Feldtyp.
 * Referenzen werden bewusst als Text gespeichert und nicht als Wix-Referenzfeld:
 * die Anwendung hält alle Daten im Speicher und löst Beziehungen selbst auf.
 * Ein echtes Referenzfeld würde zusätzliche Abfragen erzwingen, ohne dass die
 * App davon profitiert – und der Export/Import bliebe nicht mehr verlustfrei.
 */
const TYPE_MAP = {
  text: 'text',
  textarea: 'text',
  url: 'url',
  date: 'text',
  money: 'number',
  number: 'number',
  select: 'text',
  tags: 'tags',
  ref: 'text',
  image: 'text',
  files: 'object',
};

/**
 * Berechtigungen jeder Kollektion.
 * Alles auf Admin: Zugriff erfolgt ausschließlich über das Web-Modul, das
 * selbst `Permissions.Admin` verlangt. Damit ist die Kollektion für Besucher
 * der Website weder les- noch schreibbar.
 */
const PERMISSIONS = {
  read: 'Admin',
  insert: 'Admin',
  update: 'Admin',
  remove: 'Admin',
};

function fieldsFor(entityKey) {
  const def = ENTITIES[entityKey];
  return def.fields.map((f) => ({
    key: f.name,
    displayName: f.label,
    type: TYPE_MAP[f.type] || 'text',
    required: Boolean(f.required),
    description: [
      f.type === 'date' ? 'ISO-Tagesformat YYYY-MM-DD' : null,
      f.type === 'ref' ? `Verweis auf ${ENTITIES[f.ref].collection} (_id)` : null,
      f.type === 'select' ? `Erlaubt: ${f.options.map((o) => o.value).join(', ')}` : null,
      f.unique ? 'Muss eindeutig sein (wird in der App geprüft)' : null,
      f.hint || null,
    ].filter(Boolean).join(' · ') || undefined,
  }));
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const index = [];

  for (const key of ENTITY_ORDER) {
    const def = ENTITIES[key];
    const doc = {
      collectionId: def.collection,
      displayName: def.label,
      displayField: def.titleField,
      permissions: PERMISSIONS,
      // Wix legt _id, _createdDate und _updatedDate selbst an. Die App führt
      // zusätzlich eigene Zeitstempel, damit Export/Import unabhängig von Wix
      // funktioniert.
      fields: fieldsFor(key),
    };
    index.push({ collection: def.collection, label: def.label, fields: doc.fields.length });
    await writeFile(path.join(outDir, `${def.collection}.json`), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  }

  const activity = {
    collectionId: ACTIVITY_COLLECTION,
    displayName: 'Aktivitätsverlauf',
    displayField: 'text',
    permissions: PERMISSIONS,
    fields: [
      { key: 'at', displayName: 'Zeitpunkt', type: 'text', required: true, description: 'ISO-Zeitstempel' },
      { key: 'action', displayName: 'Art', type: 'text', required: true, description: 'create, update, delete, system' },
      { key: 'entityKey', displayName: 'Bereich', type: 'text', required: false },
      { key: 'entityId', displayName: 'Datensatz', type: 'text', required: false },
      { key: 'text', displayName: 'Text', type: 'text', required: true },
    ],
  };
  await writeFile(path.join(outDir, `${ACTIVITY_COLLECTION}.json`), `${JSON.stringify(activity, null, 2)}\n`, 'utf8');
  index.push({ collection: ACTIVITY_COLLECTION, label: activity.displayName, fields: activity.fields.length });

  const settings = {
    collectionId: SETTINGS_COLLECTION,
    displayName: 'Einstellungen',
    displayField: 'companyName',
    permissions: PERMISSIONS,
    description: 'Enthält genau einen Datensatz mit der _id "settings".',
    fields: [
      { key: 'revenueBasis', displayName: 'Umsatzbasis', type: 'text', required: false, description: 'invoices oder orders' },
      { key: 'widgets', displayName: 'Widgets', type: 'tags', required: false },
      { key: 'previewProvider', displayName: 'Vorschau-Dienst', type: 'text', required: false },
      { key: 'previewTemplate', displayName: 'Vorschau-Vorlage', type: 'text', required: false },
      { key: 'analyzeEndpoint', displayName: 'Analyse-Endpunkt', type: 'url', required: false },
      { key: 'companyName', displayName: 'Anzeigename', type: 'text', required: false },
    ],
  };
  await writeFile(path.join(outDir, `${SETTINGS_COLLECTION}.json`), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  index.push({ collection: SETTINGS_COLLECTION, label: settings.displayName, fields: settings.fields.length });

  await writeFile(
    path.join(outDir, 'index.json'),
    `${JSON.stringify({ generatedFrom: 'src/data/schema.js', permissions: PERMISSIONS, collections: index }, null, 2)}\n`,
    'utf8',
  );

  console.log(`${index.length} Kollektionsdefinitionen geschrieben nach wix/collections/`);
  for (const row of index) console.log(`  ${row.collection.padEnd(24)} ${row.fields} Felder`);
}

await main();
