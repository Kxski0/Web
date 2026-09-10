/**
 * Globale Suche über alle Entitäten.
 *
 * Bewusst ohne Index: bei den hier realistischen Datenmengen ist ein linearer
 * Durchlauf über bereits im Speicher liegende Datensätze schneller, als einen
 * Index aktuell zu halten – und er kann nie veralten.
 */
import { ENTITY_ORDER, ENTITIES, field, identityText, optionLabel } from '../data/schema.js';
import { fold } from '../core/util.js';

const SEP = ' · ';

/** Alle durchsuchbaren Texte eines Datensatzes zu einer Zeile zusammenfassen. */
function haystack(key, record, store) {
  const def = ENTITIES[key];
  const parts = [];
  for (const name of def.searchFields) {
    const value = record[name];
    if (Array.isArray(value)) parts.push(value.join(' '));
    else if (value) parts.push(String(value));
  }
  // Referenzen mitdurchsuchen: "Max Mueller" soll auch dessen Rechnungen finden.
  for (const f of def.fields) {
    if (f.type === 'ref' && record[f.name]) parts.push(identityText(f.ref, store.byId(f.ref, record[f.name])));
    if (f.type === 'select') parts.push(optionLabel(f.options, record[f.name]));
  }
  return fold(parts.join('  '));
}

function scoreOf(needle, title, hay) {
  const t = fold(title);
  if (t === needle) return 100;
  if (t.startsWith(needle)) return 80;
  if (t.includes(needle)) return 60;
  if (hay.includes(needle)) return 30;
  return 0;
}

/** Beschriftung eines Auswahlfelds über das Schema. */
function selectLabel(key, name, value) {
  const f = field(key, name);
  return f ? optionLabel(f.options, value) : '';
}

/** Zweite Zeile eines Suchtreffers - gibt der Zeile Kontext. */
function subtitleFor(store, key, record) {
  const customer = record.customerId ? store.titleOf('customers', record.customerId) : '';
  const join = (parts) => parts.filter(Boolean).join(SEP);
  switch (key) {
    case 'customers':
      return join([record.contact, record.city, record.email]);
    case 'orders':
      return join([customer, selectLabel('orders', 'status', record.status)]);
    case 'invoices':
      return join([customer, selectLabel('invoices', 'status', record.status)]);
    case 'websites':
      return join([customer, record.url]);
    case 'references':
      return join([selectLabel('references', 'category', record.category), record.url]);
    case 'projects':
      return join([customer, selectLabel('projects', 'status', record.status)]);
    case 'tasks':
      return join([
        record.projectId ? store.titleOf('projects', record.projectId) : '',
        selectLabel('tasks', 'status', record.status),
      ]);
    default:
      return '';
  }
}

/**
 * @returns Gruppen `{ key, label, items: [{ record, title, subtitle, score }] }`
 *          - nur Gruppen mit Treffern, sortiert nach bester Uebereinstimmung.
 */
export function search(store, query, { perGroup = 6 } = {}) {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const groups = [];
  for (const key of ENTITY_ORDER) {
    const def = ENTITIES[key];
    const items = [];
    for (const record of store.all(key)) {
      const title = store.titleOf(key, record);
      const hay = `${fold(title)}  ${haystack(key, record, store)}`;
      // Alle Suchwoerter muessen vorkommen (UND-Verknuepfung).
      if (!terms.every((t) => hay.includes(t))) continue;
      const score = Math.max(...terms.map((t) => scoreOf(t, title, hay)));
      items.push({ record, title, subtitle: subtitleFor(store, key, record), score });
    }
    if (!items.length) continue;
    items.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'de'));
    groups.push({
      key,
      label: def.label,
      total: items.length,
      items: items.slice(0, perGroup),
      best: items[0].score,
    });
  }
  return groups.sort((a, b) => b.best - a.best);
}
