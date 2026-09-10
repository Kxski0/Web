/**
 * Persistenz im Browser (localStorage), eine Kollektion pro Schlüssel.
 *
 * Das ist der Standard außerhalb von Wix: kein Server, keine Latenz, offline
 * nutzbar. Für die Datenmengen eines Ein-Personen-Betriebs (einige tausend
 * Datensätze) ist das ausreichend schnell, weil der Store ohnehin alles einmal
 * in den Speicher lädt und danach nur noch schreibt.
 */
const PREFIX = 'bizdash:v1:';

function keyFor(collection) {
  return PREFIX + collection;
}

/** Prüft echten Schreibzugriff – Safari im privaten Modus wirft beim Schreiben. */
function probe(storage) {
  const k = `${PREFIX}__probe`;
  storage.setItem(k, '1');
  storage.removeItem(k);
}

export function createLocalAdapter(options = {}) {
  let storage = options.storage || null;
  if (!storage) {
    try {
      storage = globalThis.localStorage;
      probe(storage);
    } catch {
      storage = null;
    }
  }

  // Fallback: reiner Speicher. Die App funktioniert weiter, warnt aber sichtbar.
  const memory = new Map();
  const persistent = Boolean(storage);

  function read(collection) {
    if (!persistent) return memory.get(collection) || [];
    const raw = storage.getItem(keyFor(collection));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Beschädigte Daten nicht stillschweigend löschen – umbenennen und melden.
      storage.setItem(`${keyFor(collection)}:corrupt:${Date.now()}`, raw);
      throw new Error(`Gespeicherte Daten für „${collection}" waren beschädigt und wurden beiseitegelegt.`);
    }
  }

  function write(collection, rows) {
    if (!persistent) {
      memory.set(collection, rows);
      return;
    }
    try {
      storage.setItem(keyFor(collection), JSON.stringify(rows));
    } catch (err) {
      if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
        throw new Error(
          'Der Speicher des Browsers ist voll. Bitte große Anhänge entfernen oder die Daten exportieren und ein Backend anbinden.',
        );
      }
      throw err;
    }
  }

  return {
    name: 'local',
    persistent,
    label: persistent ? 'Browser-Speicher' : 'Nur Sitzungsspeicher',

    async init() {
      return { persistent };
    },

    async list(collection) {
      return read(collection);
    },

    async insert(collection, doc) {
      const rows = read(collection);
      rows.push(doc);
      write(collection, rows);
      return doc;
    },

    async update(collection, doc) {
      const rows = read(collection);
      const i = rows.findIndex((r) => r._id === doc._id);
      if (i === -1) rows.push(doc);
      else rows[i] = doc;
      write(collection, rows);
      return doc;
    },

    async remove(collection, id) {
      const rows = read(collection).filter((r) => r._id !== id);
      write(collection, rows);
      return true;
    },

    async replaceAll(collection, rows) {
      write(collection, rows);
      return rows;
    },
  };
}
