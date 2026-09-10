/**
 * Wix Page-Code für die Dashboard-Seite.
 *
 * Diese Datei gehört in Velo in den Code-Bereich der Seite, auf der das
 * Custom Element liegt.
 *
 * Aufgabe: Brücke zwischen Custom Element (läuft im Browser) und Web-Modul
 * (läuft auf dem Server). Das Element selbst hat keinerlei Datenbankzugriff –
 * es kann nur Ereignisse auslösen, die hier geprüft und weitergereicht werden.
 *
 * Voraussetzungen in Wix:
 *   1. Custom Element auf der Seite, Tag-Name `bizdash-app`,
 *      Quelle: Velo-Datei `public/custom-elements/dashboard-element.js`.
 *      Element-ID im Editor: `customElement1` (unten ggf. anpassen).
 *   2. Seite auf "Nur für Mitglieder" bzw. passwortgeschützt stellen,
 *      damit niemand ohne Anmeldung überhaupt auf die Seite kommt.
 *   3. Web-Modul `backend/dashboard.web.js` veröffentlicht.
 */
import wixWindowFrontend from 'wix-window-frontend';
import { currentMember } from 'wix-members-frontend';
import {
  ping, listCollection, insertRecord, updateRecord, removeRecord, replaceCollection,
} from 'backend/dashboard.web';
import { analyzeSite } from 'backend/analyze.web';

const ELEMENT_ID = '#customElement1';

/** Nur diese Operationen sind erlaubt – alles andere wird abgewiesen. */
const OPERATIONS = {
  ping: () => ping(),
  list: ({ collection }) => listCollection(collection),
  insert: ({ collection, doc }) => insertRecord(collection, doc),
  update: ({ collection, doc }) => updateRecord(collection, doc),
  remove: ({ collection, id }) => removeRecord(collection, id),
  replaceAll: ({ collection, rows }) => replaceCollection(collection, rows),
  analyze: ({ url }) => analyzeSite(url).then((analysis) => ({ analysis })),
};

$w.onReady(async () => {
  const element = $w(ELEMENT_ID);

  element.on('bizdash-request', async (event) => {
    const { id, operation, payload } = event.detail || {};
    if (!id) return;

    const handler = OPERATIONS[operation];
    if (!handler) {
      element.rejectRequest(id, `Unbekannte Operation: ${operation}`);
      return;
    }

    let data;
    try {
      data = payload ? JSON.parse(payload) : {};
    } catch {
      element.rejectRequest(id, 'Ungültige Anfragedaten.');
      return;
    }

    try {
      const result = await handler(data);
      element.resolveRequest(id, result === undefined ? null : result);
    } catch (err) {
      // Im Editor/Preview die volle Meldung, live nur eine knappe – damit keine
      // Interna (Kollektionsnamen, Stacktraces) im Browser landen.
      const isPreview = wixWindowFrontend.viewMode !== 'Site';
      console.error('[bizdash] Backend-Fehler', operation, err);
      element.rejectRequest(id, isPreview ? String(err?.message || err) : 'Der Vorgang konnte nicht ausgeführt werden.');
    }
  });

  element.on('bizdash-error', (event) => {
    console.error('[bizdash] Anwendungsfehler', event.detail);
  });

  // Erst nach bestätigter Anmeldung starten. Ohne diesen Schritt würde die App
  // mit leeren Daten hochfahren und der Nutzer hielte das für seinen Stand.
  const member = await currentMember.getMember().catch(() => null);
  if (!member) {
    console.warn('[bizdash] Kein angemeldetes Mitglied – Dashboard wird nicht gestartet.');
    return;
  }

  element.setReady();
});
