/**
 * Rahmen der Anwendung: Sidebar, Kopfleiste, Inhaltsbereich.
 *
 * Ab 1024px steht die Sidebar dauerhaft (iPad quer, Desktop). Darunter fährt
 * sie als Overlay ein und schließt nach jeder Auswahl wieder – so bleibt auf
 * dem iPad hochkant die volle Breite für Inhalte.
 */
import { h, mount } from '../dom.js';
import { icon } from '../icons.js';
import { Button } from '../components/basics.js';

export const NAV_ITEMS = [
  { path: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
  { path: 'auftraege', label: 'Aufträge', iconName: 'briefcase' },
  { path: 'kunden', label: 'Kunden', iconName: 'users' },
  { path: 'rechnungen', label: 'Rechnungen', iconName: 'invoice' },
  { path: 'projekte', label: 'Projekte', iconName: 'folder' },
  { path: 'aufgaben', label: 'Aufgaben', iconName: 'checklist' },
  { path: 'websites', label: 'Meine Websites', iconName: 'globe' },
  { path: 'inspiration', label: 'Inspiration', iconName: 'sparkle' },
  { path: 'finanzen', label: 'Finanzen', iconName: 'euro' },
  { path: 'aktivitaet', label: 'Aktivität', iconName: 'activity' },
  { path: 'einstellungen', label: 'Einstellungen', iconName: 'settings' },
];

/**
 * @param {object} options
 * @param {(path:string)=>void} options.onNavigate
 * @param {()=>void} options.onSearch
 * @param {string} options.storageLabel Anzeige, wo die Daten liegen
 */
export function createShell(options) {
  const { onNavigate, onSearch, storageLabel = '', title = 'Business Dashboard' } = options;

  const content = h('main.content', { id: 'content', tabindex: '-1' });
  const navList = h('nav.nav', { 'aria-label': 'Hauptnavigation' });
  const navButtons = new Map();

  for (const item of NAV_ITEMS) {
    const btn = h('button.nav-item', {
      type: 'button',
      dataset: { path: item.path },
      onClick: () => {
        onNavigate(item.path);
        closeSidebar();
      },
    },
    icon(item.iconName, { size: 20, class: 'icon nav-icon' }),
    h('span.nav-label', null, item.label),
    h('span.nav-count', { hidden: true }));
    navButtons.set(item.path, btn);
    navList.appendChild(btn);
  }

  const sidebar = h('aside.sidebar', { id: 'sidebar' },
    h('div.sidebar-head', null,
      h('span.brand', null,
        h('span.brand-mark', { 'aria-hidden': 'true' }, 'BD'),
        h('span.brand-text', null, title)),
      Button('Menü schließen', {
        iconName: 'close', iconOnly: true, variant: 'ghost', onClick: () => closeSidebar(),
      })),
    navList,
    h('div.sidebar-foot', null,
      h('span.storage-dot', { 'aria-hidden': 'true' }),
      h('span.storage-label', null, storageLabel)));

  const scrim = h('div.scrim', { hidden: true, onClick: () => closeSidebar() });

  const menuBtn = Button('Menü öffnen', {
    iconName: 'menu', iconOnly: true, variant: 'ghost',
    onClick: () => (isSidebarOpen() ? closeSidebar() : openSidebar()),
  });
  menuBtn.setAttribute('aria-controls', 'sidebar');
  menuBtn.setAttribute('aria-expanded', 'false');

  const searchBtn = h('button.topbar-search', { type: 'button', onClick: onSearch },
    icon('search', { size: 18 }),
    h('span.topbar-search-text', null, 'Alles durchsuchen'),
    h('kbd.topbar-search-key', { 'aria-hidden': 'true' }, '/'));

  const topbarTitle = h('span.topbar-title');

  const topbar = h('header.topbar', null,
    menuBtn,
    topbarTitle,
    searchBtn);

  const root = h('div.app', null,
    h('a.skip-link', { href: '#content' }, 'Zum Inhalt springen'),
    sidebar,
    scrim,
    h('div.main', null, topbar, content));

  /*
   * Die Zustandsklasse sitzt am Wurzelknoten der Anwendung, nicht am `body`:
   * im Wix Custom Element liegt die App in einem Shadow DOM, und ein Selektor
   * wie `body.sidebar-open .sidebar` kann diese Grenze nicht überschreiten.
   */
  function isSidebarOpen() {
    return root.classList.contains('sidebar-open');
  }

  function openSidebar() {
    root.classList.add('sidebar-open');
    scrim.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    sidebar.querySelector('.nav-item')?.focus({ preventScroll: true });
  }

  function closeSidebar() {
    root.classList.remove('sidebar-open');
    scrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSidebarOpen()) closeSidebar();
  });

  return {
    root,
    content,
    closeSidebar,

    /** Aktiven Navigationspunkt markieren und Kopfzeile beschriften. */
    setActive(path, label) {
      for (const [key, btn] of navButtons) {
        const active = key === path;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-current', active ? 'page' : 'false');
      }
      topbarTitle.textContent = label || '';
    },

    /** Zähler an einem Navigationspunkt (z. B. offene Aufgaben). */
    setBadge(path, value) {
      const btn = navButtons.get(path);
      if (!btn) return;
      const badge = btn.querySelector('.nav-count');
      if (!value) {
        badge.hidden = true;
        badge.textContent = '';
        return;
      }
      badge.hidden = false;
      badge.textContent = String(value);
    },

    setStorageLabel(text, tone = 'ok') {
      const label = sidebar.querySelector('.storage-label');
      const dot = sidebar.querySelector('.storage-dot');
      if (label) label.textContent = text;
      if (dot) dot.className = `storage-dot tone-${tone}`;
    },

    /**
     * Zeichnet den Inhaltsbereich neu.
     *
     * `resetScroll` nur beim echten Ansichtswechsel: gescrollt wird das
     * Dokument, sonst landet man nach einem Wechsel mitten in der neuen Seite.
     * Beim Neuzeichnen nach einer Datenänderung (Aufgabe abhaken, Rechnung
     * bezahlt setzen) bleibt die Position dagegen stehen – sonst springt die
     * Liste unter dem Finger weg.
     */
    render(node, { resetScroll = false } = {}) {
      mount(content, node);
      if (resetScroll) {
        content.scrollTop = 0;
        globalThis.scrollTo?.(0, 0);
        document.scrollingElement?.scrollTo?.(0, 0);
      }
      return content;
    },
  };
}
