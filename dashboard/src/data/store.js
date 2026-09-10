/**
 * Zentraler Datenspeicher.
 *
 * Beim Start wird jede Kollektion genau einmal geladen und danach im Speicher
 * gehalten. Alle Ansichten lesen synchron aus diesem Cache – deshalb fühlt sich
 * Filtern, Sortieren und Suchen sofort an, auch wenn das Backend in Wix liegt.
 * Schreibvorgänge gehen durch `create`/`update`/`remove`: normalisieren,
 * validieren, persistieren, Cache aktualisieren, Aktivität protokollieren,
 * Änderung melden.
 */
import { createEmitter } from '../core/emitter.js';
import { normalizeRecord, validateRecord } from '../core/validate.js';
import { uid, clone, compact } from '../core/util.js';
import { today } from '../core/format.js';
import { ENTITIES, ENTITY_ORDER, ALL_COLLECTIONS, entity, optionLabel } from './schema.js';

const DEFAULT_SETTINGS = {
  /**
   * Womit wird Umsatz gemessen?
   *  invoices – Summe bezahlter Rechnungen, datiert auf das Zahlungsdatum (Standard,
   *             entspricht tatsächlich eingegangenem Geld)
   *  orders   – Summe abgeschlossener Aufträge, datiert auf die Deadline bzw. das
   *             Erstellungsdatum (nützlich, wenn nicht jeder Auftrag eine Rechnung hat)
   */
  revenueBasis: 'invoices',
  /** Widget-Konfiguration des Dashboards (IDs aus ui/widgets.js). */
  widgets: null,
  /** Vorschaubilder externer Websites – standardmäßig aus, siehe Einstellungen. */
  previewProvider: 'none',
  previewTemplate: '',
  /** Endpunkt für „Website analysieren"; leer = Funktion deaktiviert. */
  analyzeEndpoint: '',
  companyName: '',
};

const MAX_ACTIVITY = 500;

function stamp(doc, { isNew }) {
  const now = new Date().toISOString();
  if (isNew) doc._createdAt = now;
  doc._updatedAt = now;
  return doc;
}

export function createStore(adapter) {
  const emitter = createEmitter();
  /** @type {Record<string, any[]>} */
  const cache = {};
  let settings = { ...DEFAULT_SETTINGS };
  let ready = false;

  for (const key of ENTITY_ORDER) cache[key] = [];
  cache.activity = [];

  function collectionName(key) {
    if (key === 'activity') return 'activity';
    if (key === 'settings') return 'settings';
    return entity(key).collection;
  }

  /* ------------------------------------------------------------- Lesen -- */

  function all(key) {
    return cache[key] || [];
  }

  function byId(key, id) {
    if (!id) return null;
    return all(key).find((r) => r._id === id) || null;
  }

  /** Anzeigename eines Datensatzes – für Referenzen, Suche und Aktivitätstexte. */
  function titleOf(key, idOrRecord) {
    const rec = typeof idOrRecord === 'string' ? byId(key, idOrRecord) : idOrRecord;
    if (!rec) return '';
    return String(rec[entity(key).titleField] || '').trim() || '(ohne Titel)';
  }

  /* -------------------------------------------------------- Aktivität -- */

  async function logActivity(entry) {
    const row = {
      _id: uid(),
      at: new Date().toISOString(),
      action: entry.action,
      entityKey: entry.entityKey || '',
      entityId: entry.entityId || '',
      text: String(entry.text || '').slice(0, 400),
    };
    cache.activity.unshift(row);
    if (cache.activity.length > MAX_ACTIVITY) cache.activity.length = MAX_ACTIVITY;
    try {
      await adapter.insert('activity', row);
      // Ältere Einträge im Speicher zurückschneiden, damit er nicht wächst.
      if (cache.activity.length === MAX_ACTIVITY) {
        await adapter.replaceAll('activity', cache.activity);
      }
    } catch (err) {
      // Ein fehlgeschlagenes Protokoll darf die eigentliche Änderung nicht kippen.
      console.warn('[bizdash] Aktivität konnte nicht gespeichert werden', err);
    }
    return row;
  }

  /**
   * Baut den Aktivitätstext. Bei Statuswechseln wird der Übergang erwähnt –
   * genau das will man im Feed sehen („… als bezahlt markiert").
   */
  function describe(action, key, record, before) {
    const def = ENTITIES[key];
    const name = titleOf(key, record);
    if (action === 'create') return `${def.singular} „${name}" angelegt.`;
    if (action === 'delete') return `${def.singular} „${name}" gelöscht.`;

    const changes = [];
    for (const f of def.fields) {
      if (f.type === 'files' || f.type === 'image') continue;
      const a = before?.[f.name];
      const b = record?.[f.name];
      const same = Array.isArray(a) && Array.isArray(b) ? a.join('|') === b.join('|') : a === b;
      if (same) continue;
      if (f.type === 'select') {
        changes.push(`${f.label}: ${optionLabel(f.options, a)} → ${optionLabel(f.options, b)}`);
      } else {
        changes.push(f.label);
      }
    }
    if (!changes.length) return `${def.singular} „${name}" gespeichert.`;
    const shown = changes.slice(0, 3).join(', ');
    const rest = changes.length > 3 ? ` (+${changes.length - 3})` : '';
    return `${def.singular} „${name}" geändert – ${shown}${rest}.`;
  }

  /* ---------------------------------------------------------- Schreiben -- */

  function validationContext(key, id) {
    const refs = {};
    for (const f of entity(key).fields) {
      if (f.type === 'ref' && f.ref) refs[f.ref] = all(f.ref);
    }
    return { all: all(key), id, refs };
  }

  /**
   * Regeln, die beim Speichern automatisch greifen, damit der Nutzer nicht an
   * zwei Stellen dasselbe pflegen muss.
   */
  function applyBusinessRules(key, record) {
    if (key === 'invoices') {
      if (record.status === 'bezahlt' && !record.paidDate) record.paidDate = today();
      if (record.status !== 'bezahlt') record.paidDate = '';
      // Ein manuell auf „Offen" gesetzter, längst fälliger Beleg ist überfällig.
      if (record.status === 'offen' && record.dueDate && record.dueDate < today()) {
        record.status = 'ueberfaellig';
      }
      if (record.status === 'ueberfaellig' && record.dueDate && record.dueDate >= today()) {
        record.status = 'offen';
      }
    }
    return record;
  }

  async function create(key, raw) {
    const record = applyBusinessRules(key, normalizeRecord(key, raw));
    const { ok, errors } = validateRecord(key, record, validationContext(key, null));
    if (!ok) return { ok: false, errors };

    const doc = stamp({ ...compact(record), _id: uid() }, { isNew: true });
    await adapter.insert(collectionName(key), doc);
    cache[key] = [doc, ...all(key)];
    await logActivity({ action: 'create', entityKey: key, entityId: doc._id, text: describe('create', key, doc) });
    emitter.emit('change', { key, action: 'create', id: doc._id });
    return { ok: true, record: doc };
  }

  async function update(key, id, raw) {
    const before = byId(key, id);
    if (!before) return { ok: false, errors: { _: 'Datensatz nicht gefunden.' } };

    const record = applyBusinessRules(key, normalizeRecord(key, { ...before, ...raw }));
    const { ok, errors } = validateRecord(key, record, validationContext(key, id));
    if (!ok) return { ok: false, errors };

    const doc = stamp({ ...before, ...compact(record), _id: id }, { isNew: false });
    await adapter.update(collectionName(key), doc);
    cache[key] = all(key).map((r) => (r._id === id ? doc : r));
    await logActivity({ action: 'update', entityKey: key, entityId: id, text: describe('update', key, doc, before) });
    emitter.emit('change', { key, action: 'update', id });
    return { ok: true, record: doc };
  }

  /**
   * Löschen mit Beziehungsschutz: ein Kunde mit Aufträgen oder Rechnungen wird
   * nicht entfernt, sonst entstehen Datensätze ohne Zuordnung und die
   * Umsatzrechnung wird falsch.
   */
  function blockingReferences(key, id) {
    const blockers = [];
    for (const other of ENTITY_ORDER) {
      for (const f of entity(other).fields) {
        if (f.type !== 'ref' || f.ref !== key) continue;
        const count = all(other).filter((r) => r[f.name] === id).length;
        if (count > 0) blockers.push({ entityKey: other, count, label: ENTITIES[other].label });
      }
    }
    return blockers;
  }

  async function remove(key, id, { cascade = false } = {}) {
    const record = byId(key, id);
    if (!record) return { ok: false, errors: { _: 'Datensatz nicht gefunden.' } };

    const blockers = blockingReferences(key, id);
    if (blockers.length && !cascade) return { ok: false, blockers };

    if (cascade) {
      // Verknüpfungen lösen statt mitzulöschen – Rechnungen und Aufträge sind
      // eigenständige Belege und dürfen nicht verschwinden.
      for (const other of ENTITY_ORDER) {
        for (const f of entity(other).fields) {
          if (f.type !== 'ref' || f.ref !== key) continue;
          for (const row of all(other).filter((r) => r[f.name] === id)) {
            const patched = stamp({ ...row, [f.name]: '' }, { isNew: false });
            await adapter.update(collectionName(other), patched);
            cache[other] = all(other).map((r) => (r._id === row._id ? patched : r));
          }
        }
      }
    }

    await adapter.remove(collectionName(key), id);
    cache[key] = all(key).filter((r) => r._id !== id);
    await logActivity({ action: 'delete', entityKey: key, entityId: id, text: describe('delete', key, record) });
    emitter.emit('change', { key, action: 'delete', id });
    return { ok: true };
  }

  /** Direkter Feld-Patch für Schnellaktionen (z. B. Aufgabe abhaken). */
  async function patch(key, id, partial) {
    return update(key, id, { ...(byId(key, id) || {}), ...partial });
  }

  /* --------------------------------------------------- Automatikregeln -- */

  /**
   * Markiert offene Rechnungen nach Ablauf der Frist als überfällig – und
   * nimmt die Markierung zurück, wenn das Fälligkeitsdatum verschoben wurde.
   * Läuft beim Start und danach einmal pro Stunde.
   */
  async function syncOverdueInvoices() {
    const now = today();
    const changed = [];
    for (const inv of all('invoices')) {
      let next = null;
      if (inv.status === 'offen' && inv.dueDate && inv.dueDate < now) next = 'ueberfaellig';
      if (inv.status === 'ueberfaellig' && (!inv.dueDate || inv.dueDate >= now)) next = 'offen';
      if (next) changed.push({ inv, next });
    }
    if (!changed.length) return 0;

    for (const { inv, next } of changed) {
      const doc = stamp({ ...inv, status: next }, { isNew: false });
      await adapter.update(collectionName('invoices'), doc);
      cache.invoices = all('invoices').map((r) => (r._id === doc._id ? doc : r));
    }
    const overdue = changed.filter((c) => c.next === 'ueberfaellig');
    if (overdue.length) {
      await logActivity({
        action: 'system',
        entityKey: 'invoices',
        text:
          overdue.length === 1
            ? `Rechnung ${overdue[0].inv.number} ist überfällig.`
            : `${overdue.length} Rechnungen wurden als überfällig markiert.`,
      });
    }
    emitter.emit('change', { key: 'invoices', action: 'sync' });
    return changed.length;
  }

  /* --------------------------------------------------- Einstellungen -- */

  async function saveSettings(partial) {
    settings = { ...settings, ...partial };
    const doc = { _id: 'settings', ...settings };
    await adapter.replaceAll('settings', [doc]);
    emitter.emit('settings', settings);
    emitter.emit('change', { key: 'settings', action: 'update' });
    return settings;
  }

  /* --------------------------------------------- Export / Import / Reset -- */

  function exportAll() {
    const data = { format: 'bizdash', version: 1, exportedAt: new Date().toISOString(), collections: {} };
    for (const key of ENTITY_ORDER) data.collections[key] = clone(all(key));
    data.collections.activity = clone(cache.activity);
    data.settings = clone(settings);
    return data;
  }

  /**
   * Import ersetzt den kompletten Datenbestand. Fremde Felder werden über
   * `normalizeRecord` verworfen, IDs bleiben erhalten (oder werden ergänzt),
   * damit Beziehungen den Import überleben.
   */
  async function importAll(payload) {
    if (!payload || payload.format !== 'bizdash' || !payload.collections) {
      throw new Error('Die Datei ist keine gültige Dashboard-Sicherung.');
    }
    for (const key of ENTITY_ORDER) {
      const rows = Array.isArray(payload.collections[key]) ? payload.collections[key] : [];
      const clean = rows.map((row) =>
        compact({
          ...normalizeRecord(key, row),
          _id: typeof row._id === 'string' && row._id ? row._id : uid(),
          _createdAt: row._createdAt || new Date().toISOString(),
          _updatedAt: row._updatedAt || new Date().toISOString(),
        }),
      );
      await adapter.replaceAll(collectionName(key), clean);
      cache[key] = clean;
    }
    const activity = Array.isArray(payload.collections.activity) ? payload.collections.activity.slice(0, MAX_ACTIVITY) : [];
    await adapter.replaceAll('activity', activity);
    cache.activity = activity;

    if (payload.settings) await saveSettings({ ...DEFAULT_SETTINGS, ...payload.settings });
    await logActivity({ action: 'system', text: 'Datensicherung importiert.' });
    emitter.emit('change', { key: '*', action: 'import' });
    return true;
  }

  async function resetAll() {
    for (const key of ENTITY_ORDER) {
      await adapter.replaceAll(collectionName(key), []);
      cache[key] = [];
    }
    await adapter.replaceAll('activity', []);
    cache.activity = [];
    emitter.emit('change', { key: '*', action: 'reset' });
    return true;
  }

  /** Ersetzt den Bestand durch einen fertigen Satz Datensätze (Demodaten). */
  async function loadDataset(collections) {
    for (const key of ENTITY_ORDER) {
      const rows = Array.isArray(collections[key]) ? collections[key] : [];
      await adapter.replaceAll(collectionName(key), rows);
      cache[key] = rows;
    }
    await adapter.replaceAll('activity', []);
    cache.activity = [];
    await logActivity({ action: 'system', text: 'Demodaten geladen.' });
    emitter.emit('change', { key: '*', action: 'import' });
  }

  /* ---------------------------------------------------------------- Init -- */

  async function load() {
    for (const key of ENTITY_ORDER) {
      cache[key] = await adapter.list(collectionName(key));
    }
    cache.activity = (await adapter.list('activity')).sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const stored = await adapter.list('settings');
    settings = { ...DEFAULT_SETTINGS, ...(stored[0] || {}) };
    delete settings._id;
    ready = true;
    await syncOverdueInvoices();
    emitter.emit('ready', null);
    return true;
  }

  return {
    adapter,
    get ready() {
      return ready;
    },
    get settings() {
      return settings;
    },
    collections: ALL_COLLECTIONS,
    on: emitter.on,
    load,
    all,
    byId,
    titleOf,
    create,
    update,
    patch,
    remove,
    blockingReferences,
    logActivity,
    activity: () => cache.activity,
    syncOverdueInvoices,
    saveSettings,
    exportAll,
    importAll,
    resetAll,
    loadDataset,
  };
}
