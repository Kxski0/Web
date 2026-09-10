/**
 * Persistenz über Wix Data.
 *
 * Wichtig: Dieser Adapter spricht **niemals** direkt mit Wix Data. Er schickt
 * jede Operation an ein Velo-Web-Modul (`backend/dashboard.web.js`), das mit
 * `Permissions.Admin` abgesichert ist. Damit liegt weder ein Schlüssel noch
 * eine Schreibberechtigung im Frontend, und die Kollektionen können in Wix auf
 * „Nur Admin" gestellt bleiben.
 *
 * Die Brücke selbst wird von außen injiziert:
 *  - im Wix Custom Element vom Page-Code (`wix/page-code/dashboard.page.js`),
 *  - im Standalone-Betrieb gar nicht (dann greift der lokale Adapter).
 */
export function createWixAdapter(bridge) {
  if (!bridge || typeof bridge.call !== 'function') {
    throw new Error('Wix-Adapter benötigt eine Brücke mit call(operation, payload).');
  }

  const call = (op, payload) => bridge.call(op, payload);

  return {
    name: 'wix',
    persistent: true,
    label: 'Wix Data (Velo)',

    async init() {
      const info = await call('ping', {});
      return { persistent: true, ...info };
    },

    async list(collection) {
      const rows = await call('list', { collection });
      return Array.isArray(rows) ? rows : [];
    },

    async insert(collection, doc) {
      return call('insert', { collection, doc });
    },

    async update(collection, doc) {
      return call('update', { collection, doc });
    },

    async remove(collection, id) {
      await call('remove', { collection, id });
      return true;
    },

    async replaceAll(collection, rows) {
      await call('replaceAll', { collection, rows });
      return rows;
    },
  };
}
