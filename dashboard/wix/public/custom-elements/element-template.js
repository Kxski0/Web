/**
 * Wix Custom Element – Vorlage.
 *
 * `node dashboard/build.mjs` setzt hier das gebündelte JavaScript und das
 * Stylesheet ein und schreibt das Ergebnis nach `dashboard/dist/dashboard-element.js`.
 * Diese Datei kommt in Wix nach `public/custom-elements/`.
 *
 * Warum eine einzige Datei: Velo lädt Custom-Element-Dateien als eigenständiges
 * Skript. Ein Import weiterer Public-Dateien ist nicht zugesichert, also wird
 * alles eingebettet.
 *
 * Warum Shadow DOM: die Wix-Seite bringt eigene Styles mit. Der Shadow-Root
 * kapselt beide Richtungen ab, sodass weder Wix das Dashboard verändert noch
 * umgekehrt.
 *
 * Kommunikation mit Velo (siehe wix/page-code/dashboard.page.js):
 *   Element -> Seite   this.dispatchEvent(new CustomEvent('bizdash-request', …))
 *   Seite  -> Element  element.resolveRequest(id, result) bzw. rejectRequest(id, msg)
 * Das Element spricht also nie selbst mit der Datenbank; jeder Zugriff läuft
 * über den Page-Code und von dort in ein `Permissions.Admin`-Web-Modul.
 */
(function () {
  'use strict';

  var STYLES = /*__STYLES__*/;

  /* Gebündelte Anwendung. esbuild erzeugt `var BizDash = (() => {…})();` –
     durch die umschließende IIFE ist das eine lokale Variable und landet NICHT
     auf window. Deshalb wird sie unten direkt verwendet. */
  /*__BUNDLE__*/

  /* Zugriff auf die Anwendung, egal ob lokal gebunden oder global. */
  var App = typeof BizDash !== 'undefined' ? BizDash : window.BizDash;

  var REQUEST_TIMEOUT = 20000;

  function BizDashElementFactory() {
    return class BizDashElement extends HTMLElement {
      constructor() {
        super();
        this._pending = new Map();
        this._seq = 0;
        this._app = null;
      }

      connectedCallback() {
        if (this._root) return;
        this._root = this.attachShadow({ mode: 'open' });

        var style = document.createElement('style');
        style.textContent = STYLES;
        this._root.appendChild(style);

        var mountPoint = document.createElement('div');
        mountPoint.className = 'bizdash';
        mountPoint.style.minHeight = '100%';
        this._root.appendChild(mountPoint);
        this._mount = mountPoint;

        // Der Page-Code meldet sich mit `setReady(true)`, sobald das Backend
        // erreichbar ist. Bis dahin wird gewartet – so startet die App nie
        // versehentlich mit dem lokalen Speicher, während Wix-Daten existieren.
        if (this.getAttribute('standalone') === 'true') this._boot(null);
      }

      disconnectedCallback() {
        if (this._app && typeof this._app.destroy === 'function') this._app.destroy();
        this._app = null;
      }

      /** Vom Page-Code aufgerufen, sobald das Backend bereit ist. */
      setReady() {
        if (this._app) return;
        var element = this;
        this._boot({
          call: function (operation, payload) {
            return element._request(operation, payload);
          },
        });
      }

      /** Antwort des Page-Codes auf eine Anfrage. */
      resolveRequest(id, result) {
        var entry = this._pending.get(id);
        if (!entry) return;
        this._pending.delete(id);
        clearTimeout(entry.timer);
        entry.resolve(result);
      }

      /** Fehler des Page-Codes auf eine Anfrage. */
      rejectRequest(id, message) {
        var entry = this._pending.get(id);
        if (!entry) return;
        this._pending.delete(id);
        clearTimeout(entry.timer);
        entry.reject(new Error(message || 'Unbekannter Fehler im Wix-Backend.'));
      }

      _request(operation, payload) {
        var element = this;
        this._seq += 1;
        var id = 'r' + this._seq;

        return new Promise(function (resolve, reject) {
          var timer = setTimeout(function () {
            element._pending.delete(id);
            reject(new Error('Zeitüberschreitung beim Zugriff auf die Wix-Datenbank.'));
          }, REQUEST_TIMEOUT);

          element._pending.set(id, { resolve: resolve, reject: reject, timer: timer });

          // Der Nutzdatenteil geht als JSON-String raus: Velo reicht nur
          // serialisierbare Werte zuverlässig durch Custom-Element-Events.
          element.dispatchEvent(new CustomEvent('bizdash-request', {
            detail: { id: id, operation: operation, payload: JSON.stringify(payload || {}) },
          }));
        });
      }

      _boot(bridge) {
        var element = this;
        App.startApp({
          container: this._mount,
          bridge: bridge,
          // Kein Hash-Routing innerhalb von Wix: die Adresszeile gehört der
          // Wix-Seite, ein Eingriff würde deren Navigation stören.
          useHash: false,
          title: this.getAttribute('app-title') || 'Business Dashboard',
        }).then(function (app) {
          element._app = app;
          element.dispatchEvent(new CustomEvent('bizdash-ready', { detail: { ok: true } }));
        }).catch(function (err) {
          element._mount.textContent = 'Start fehlgeschlagen: ' + err.message;
          element.dispatchEvent(new CustomEvent('bizdash-error', { detail: { message: err.message } }));
        });
      }
    };
  }

  if (!customElements.get('bizdash-app')) {
    customElements.define('bizdash-app', BizDashElementFactory());
  }
}());
