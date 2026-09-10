/**
 * Einstiegspunkt.
 *
 * Baut Speicher, Store, Router und Rahmen auf und verbindet Routen mit
 * Ansichten. Wird sowohl von der eigenständigen Seite (`index.html`) als auch
 * vom Wix Custom Element aufgerufen.
 */
import { createAdapter } from './data/adapters/index.js';
import { createStore } from './data/store.js';
import { createRouter } from './core/router.js';
import { createShell, NAV_ITEMS } from './ui/layout/Shell.js';
import { openGlobalSearch } from './ui/layout/GlobalSearch.js';
import { h, mount } from './ui/dom.js';
import { setOverlayRoot, overlayRoot } from './ui/overlay.js';
import { Spinner, Notice, Button, PageHeader, EmptyState } from './ui/components/basics.js';
import { toast } from './ui/components/Modal.js';
import { ENTITIES } from './data/schema.js';
import { TASK_OPEN, INVOICE_GROUPS } from './data/schema.js';

import { renderDashboard } from './ui/views/dashboard.js';
import { renderOrders, renderOrderDetail } from './ui/views/orders.js';
import { renderCustomers, renderCustomerDetail } from './ui/views/customers.js';
import { renderInvoices, renderInvoiceDetail } from './ui/views/invoices.js';
import { renderWebsites, renderWebsiteDetail } from './ui/views/websites.js';
import { renderReferences, renderReferenceDetail } from './ui/views/inspiration.js';
import { renderProjects, renderProjectDetail } from './ui/views/projects.js';
import { renderTasks, renderTaskDetail } from './ui/views/tasks.js';
import { renderFinance } from './ui/views/finance.js';
import { renderActivity } from './ui/views/activity.js';
import { renderSettings } from './ui/views/settings.js';

/** Route -> Listenansicht und Detailansicht. */
const ROUTES = {
  dashboard: { label: 'Dashboard', list: renderDashboard },
  auftraege: { label: 'Aufträge', list: renderOrders, detail: renderOrderDetail },
  kunden: { label: 'Kunden', list: renderCustomers, detail: renderCustomerDetail },
  rechnungen: { label: 'Rechnungen', list: renderInvoices, detail: renderInvoiceDetail },
  projekte: { label: 'Projekte', list: renderProjects, detail: renderProjectDetail },
  aufgaben: { label: 'Aufgaben', list: renderTasks, detail: renderTaskDetail },
  websites: { label: 'Meine Websites', list: renderWebsites, detail: renderWebsiteDetail },
  inspiration: { label: 'Website Inspiration', list: renderReferences, detail: renderReferenceDetail },
  finanzen: { label: 'Finanzen', list: renderFinance },
  aktivitaet: { label: 'Aktivität', list: renderActivity },
  einstellungen: { label: 'Einstellungen', list: renderSettings },
};

/**
 * Startet die Anwendung in `container`.
 *
 * @param {object} options
 * @param {HTMLElement} options.container
 * @param {object} [options.bridge]   Wix-Brücke; ohne sie läuft alles lokal
 * @param {boolean} [options.useHash] Hash-Routing (Standalone) an/aus
 * @returns {Promise<{ destroy(): void }>}
 */
export async function startApp(options = {}) {
  const {
    container = document.body,
    bridge = globalThis.__BIZDASH_BRIDGE__ || null,
    useHash = !bridge,
    title = 'Business Dashboard',
  } = options;

  mount(container, h('div.boot', null, Spinner('Daten werden geladen …')));

  let store;
  try {
    const adapter = await createAdapter({ bridge });
    store = createStore(adapter);
    await store.load();
  } catch (err) {
    console.error('[bizdash] Start fehlgeschlagen', err);
    mount(container, h('div.boot', null,
      Notice(`Die Anwendung konnte nicht starten: ${err?.message || err}`, 'danger'),
      Button('Erneut versuchen', { variant: 'primary', onClick: () => globalThis.location?.reload() })));
    return { destroy() {} };
  }

  const router = createRouter({ useHash, fallback: 'dashboard' });

  /**
   * Zustand pro Ansicht (Filter, Sortierung, Modus).
   * Liegt außerhalb der Ansichten, damit ein Wechsel und zurück die Auswahl
   * nicht vergisst – auf dem iPad ist das Neu-Einstellen von Filtern lästig.
   */
  const viewStates = new Map();

  const shell = createShell({
    title,
    storageLabel: store.adapter.label,
    onNavigate: (path) => router.navigate(path),
    onSearch: () => openSearch(),
  });

  const ctx = {
    store,
    bridge,
    navigate: (...parts) => router.navigate(...parts),
    refresh: () => draw(router.current),
    getViewState(key, initial) {
      if (!viewStates.has(key)) viewStates.set(key, { ...initial });
      return viewStates.get(key);
    },
    setViewState(key, patch) {
      const current = viewStates.get(key) || {};
      viewStates.set(key, { ...current, ...patch });
    },
  };

  function openSearch() {
    openGlobalSearch({
      store,
      onPick: (entityKey, id) => router.navigate(ENTITIES[entityKey].route, id),
    });
  }

  /* ------------------------------------------------------- Zeichnen -- */

  let currentKey = '';

  function draw(route) {
    const config = ROUTES[route.path] || ROUTES.dashboard;
    const path = ROUTES[route.path] ? route.path : 'dashboard';
    const id = route.params[0] || null;
    // Nur bei echtem Ansichtswechsel nach oben springen, nicht bei jedem
    // Neuzeichnen wegen einer Datenänderung.
    const resetScroll = currentKey !== `${path}/${id || ''}`;

    shell.setActive(path, config.label);
    updateBadges();

    try {
      const node = id && config.detail
        ? config.detail(ctx, id)
        : config.list(ctx);
      shell.render(node, { resetScroll });
    } catch (err) {
      console.error(`[bizdash] Ansicht "${path}" konnte nicht gezeichnet werden`, err);
      shell.render(h('div.view', null,
        PageHeader({ title: config.label }),
        EmptyState({
          iconName: 'warning',
          title: 'Diese Ansicht konnte nicht geladen werden',
          text: err?.message || 'Unbekannter Fehler.',
          action: Button('Zum Dashboard', { variant: 'primary', onClick: () => router.navigate('dashboard') }),
        })));
    }
    currentKey = `${path}/${id || ''}`;
  }

  /** Zähler in der Navigation – offene Aufgaben und offene Rechnungen. */
  function updateBadges() {
    shell.setBadge('aufgaben', store.all('tasks').filter((t) => TASK_OPEN.includes(t.status)).length);
    shell.setBadge('rechnungen', store.all('invoices').filter((i) => INVOICE_GROUPS.outstanding.includes(i.status)).length);
  }

  /* ------------------------------------------------------- Ereignisse -- */

  const offRoute = router.on('route', (route) => draw(route));

  // Datenänderungen zeichnen die aktuelle Ansicht neu. Das ist bei diesen
  // Datenmengen schnell genug und hält alle Kennzahlen ohne Sonderlogik aktuell.
  const offChange = store.on('change', () => draw(router.current));

  function onKeydown(e) {
    const target = e.target;
    const typing = target instanceof HTMLElement
      && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    // Bei offenem Dialog oder offener Suche gehören die Tasten dorthin.
    if (typing || overlayRoot().querySelector('.modal-overlay, .gsearch-overlay')) return;

    if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      openSearch();
    }
  }
  document.addEventListener('keydown', onKeydown);

  /**
   * Überfällige Rechnungen einmal pro Stunde nachziehen und beim Zurückkehren
   * auf den Tab – auf dem iPad bleibt die App oft tagelang offen.
   */
  const overdueTimer = setInterval(() => {
    store.syncOverdueInvoices().catch((err) => console.warn('[bizdash] Fälligkeitsprüfung', err));
  }, 60 * 60 * 1000);

  function onVisible() {
    if (document.visibilityState === 'visible') {
      store.syncOverdueInvoices().catch((err) => console.warn('[bizdash] Fälligkeitsprüfung', err));
    }
  }
  document.addEventListener('visibilitychange', onVisible);

  // Schreibfehler (voller Speicher, Backend weg) dürfen nicht stumm bleiben.
  const onUnhandled = (event) => {
    const message = event.reason?.message || String(event.reason || '');
    if (message) {
      console.error('[bizdash] Nicht behandelter Fehler', event.reason);
      toast(message, 'danger');
    }
  };
  globalThis.addEventListener?.('unhandledrejection', onUnhandled);

  mount(container, shell.root);
  // Dialoge, Suche und Kurzmeldungen hängen sich innerhalb der Anwendung ein –
  // nur dort greifen Stylesheet und Farbvariablen (siehe ui/overlay.js).
  setOverlayRoot(container);
  router.start();
  if (!currentKey) draw(router.current);

  return {
    store,
    router,
    destroy() {
      offRoute();
      offChange();
      router.stop();
      clearInterval(overdueTimer);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('visibilitychange', onVisible);
      globalThis.removeEventListener?.('unhandledrejection', onUnhandled);
      setOverlayRoot(null);
      mount(container);
    },
  };
}

export { NAV_ITEMS };
