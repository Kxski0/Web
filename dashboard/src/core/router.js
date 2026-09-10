/**
 * Router.
 *
 * Zwei Betriebsarten, weil die App an zwei Orten läuft:
 *  - Standalone (eigene Seite, iPad-Homescreen): Hash-Routing, damit
 *    Zurück-Geste und Lesezeichen funktionieren und kein Server nötig ist.
 *  - Eingebettet in Wix: reines Speicher-Routing. Ein Custom Element darf die
 *    URL der Wix-Seite nicht verändern – das würde Wix' eigenes Routing stören.
 */
import { createEmitter } from './emitter.js';

/** `#/kunden/abc` -> { path: 'kunden', params: ['abc'] } */
function parse(hash) {
  const raw = String(hash || '').replace(/^#/, '').replace(/^\//, '');
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const query = {};
  if (queryPart) {
    for (const [k, v] of new URLSearchParams(queryPart)) query[k] = v;
  }
  return { path: segments[0] || '', params: segments.slice(1), query };
}

export function createRouter({ useHash = true, fallback = 'dashboard' } = {}) {
  const emitter = createEmitter();
  let current = { path: fallback, params: [], query: {} };
  let started = false;

  function apply(route, { silent = false } = {}) {
    current = { path: route.path || fallback, params: route.params || [], query: route.query || {} };
    if (!silent) emitter.emit('route', current);
  }

  function onHashChange() {
    apply(parse(globalThis.location?.hash));
  }

  return {
    get current() {
      return current;
    },
    on: emitter.on,

    /** `navigate('kunden', 'abc')` oder `navigate('kunden/abc')`. */
    navigate(...parts) {
      const target = parts.filter((p) => p !== null && p !== undefined && p !== '').map(String).join('/');
      const route = parse(target);
      if (useHash && globalThis.location) {
        const next = `#/${target}`;
        if (globalThis.location.hash === next) {
          // Gleicher Pfad: kein hashchange, also direkt melden (Neu laden).
          apply(route);
        } else {
          globalThis.location.hash = next;
        }
        return;
      }
      apply(route);
    },

    start() {
      if (started) return;
      started = true;
      if (useHash && globalThis.addEventListener) {
        globalThis.addEventListener('hashchange', onHashChange);
        const initial = parse(globalThis.location?.hash);
        apply(initial.path ? initial : { path: fallback, params: [], query: {} });
      } else {
        apply({ path: fallback, params: [], query: {} });
      }
    },

    stop() {
      if (useHash && globalThis.removeEventListener) globalThis.removeEventListener('hashchange', onHashChange);
      started = false;
      emitter.clear();
    },
  };
}
