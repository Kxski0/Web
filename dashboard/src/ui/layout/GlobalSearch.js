/**
 * Globale Suche als Overlay.
 *
 * Tippen filtert sofort über alle Entitäten; Enter bzw. Antippen springt zum
 * Datensatz. Auf/Ab funktioniert für Tastatur, ist aber nie Voraussetzung –
 * jede Zeile ist ein vollwertiges Touch-Ziel.
 */
import { h, mount } from '../dom.js';
import { overlayRoot, setScrollLock } from '../overlay.js';
import { icon } from '../icons.js';
import { EmptyState } from '../components/basics.js';
import { search } from '../../domain/search.js';
import { ENTITIES } from '../../data/schema.js';
import { debounce } from '../../core/util.js';

const ICONS = {
  customers: 'users',
  orders: 'briefcase',
  invoices: 'invoice',
  websites: 'globe',
  references: 'sparkle',
  projects: 'folder',
  tasks: 'checklist',
};

/**
 * @param {object} options
 * @param {object} options.store
 * @param {(entityKey:string, id:string)=>void} options.onPick
 */
export function openGlobalSearch(options) {
  const { store, onPick, initialQuery = '' } = options;

  const results = h('div.gsearch-results');
  const input = h('input.gsearch-input', {
    type: 'search',
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    'aria-label': 'Alles durchsuchen',
    placeholder: 'Kunde, Auftrag, Rechnung, Website, Projekt, Aufgabe …',
    value: initialQuery,
  });

  const panel = h('div.gsearch', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Suche' },
    h('div.gsearch-head', null,
      icon('search', { size: 20, class: 'icon gsearch-icon' }),
      input,
      h('button.gsearch-close', { type: 'button', 'aria-label': 'Suche schließen', onClick: () => close() },
        icon('close', { size: 18 }))),
    results);

  const overlay = h('div.gsearch-overlay', {
    onClick: (e) => {
      if (e.target === overlay) close();
    },
  }, panel);

  /** Flache Liste aller sichtbaren Treffer – für Tastaturnavigation. */
  let flat = [];
  let cursor = -1;

  function highlight() {
    const nodes = [...results.querySelectorAll('.gsearch-item')];
    nodes.forEach((n, i) => n.classList.toggle('is-active', i === cursor));
    if (cursor >= 0 && nodes[cursor]) nodes[cursor].scrollIntoView({ block: 'nearest' });
  }

  function pick(index) {
    const hit = flat[index];
    if (!hit) return;
    close();
    onPick(hit.key, hit.record._id);
  }

  function render(query) {
    flat = [];
    cursor = -1;

    if (!query.trim()) {
      mount(results, h('div.gsearch-hint', null,
        h('p', null, 'Tippen, um alle Bereiche gleichzeitig zu durchsuchen.'),
        h('p.muted', null, 'Gesucht wird in Namen, Nummern, Notizen, Tags und verknüpften Kunden.')));
      return;
    }

    const groups = search(store, query, { perGroup: 6 });
    if (!groups.length) {
      mount(results, EmptyState({
        iconName: 'search',
        title: 'Keine Treffer',
        text: `Für „${query}" wurde nichts gefunden.`,
      }));
      return;
    }

    const nodes = [];
    for (const group of groups) {
      nodes.push(h('p.gsearch-group', null,
        group.label,
        group.total > group.items.length ? h('span.muted', null, ` (${group.items.length} von ${group.total})`) : null));
      for (const item of group.items) {
        const index = flat.length;
        flat.push({ key: group.key, record: item.record });
        nodes.push(h('button.gsearch-item', {
          type: 'button',
          onClick: () => pick(index),
          onMouseEnter: () => { cursor = index; highlight(); },
        },
        icon(ICONS[group.key] || 'folder', { size: 18, class: 'icon gsearch-item-icon' }),
        h('span.gsearch-item-text', null,
          h('span.gsearch-item-title', null, item.title),
          item.subtitle ? h('span.gsearch-item-sub', null, item.subtitle) : null),
        h('span.gsearch-item-kind', null, ENTITIES[group.key].singular)));
      }
    }
    mount(results, ...nodes);
  }

  const renderDebounced = debounce((q) => render(q), 120);
  input.addEventListener('input', (e) => renderDebounced(e.target.value));

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!flat.length) return;
      cursor = e.key === 'ArrowDown'
        ? (cursor + 1) % flat.length
        : (cursor - 1 + flat.length) % flat.length;
      highlight();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      pick(cursor >= 0 ? cursor : 0);
    }
  }
  panel.addEventListener('keydown', onKeydown);

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    renderDebounced.cancel();
    overlay.remove();
    setScrollLock(false);
  }

  overlayRoot().appendChild(overlay);
  setScrollLock(true);
  render(initialQuery);
  input.focus();
  input.select();

  return { close };
}
