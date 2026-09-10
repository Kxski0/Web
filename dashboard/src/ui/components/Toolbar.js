/**
 * Filter- und Sortierleiste über Listen.
 *
 * Der Zustand liegt in der Ansicht, nicht hier: die Leiste meldet nur
 * Änderungen. Dadurch kann die Ansicht bei jeder Eingabe nur den Ergebnis-
 * bereich neu zeichnen und der Fokus bleibt im Suchfeld – auf dem iPad ist ein
 * Fokusverlust gleichbedeutend mit einer zugeklappten Tastatur.
 */
import { h, mount } from '../dom.js';
import { icon } from '../icons.js';
import { Button } from './basics.js';
import { debounce } from '../../core/util.js';

/**
 * @param {object} options
 * @param {object} options.state              aktueller Filterzustand
 * @param {(patch)=>void} options.onChange
 * @param {Array} [options.filters]           [{ name, label, options:[{value,label}], all }]
 * @param {Array} [options.sorts]             [{ value, label }]
 * @param {string} [options.searchPlaceholder]
 * @param {Node[]} [options.extra]
 */
export function Toolbar(options = {}) {
  const {
    state, onChange, filters = [], sorts = [], searchPlaceholder = 'Suchen …', extra = [],
    resultCount = null, totalCount = null,
  } = options;

  const emit = (patch) => onChange({ ...patch });
  const emitSearchDebounced = debounce((value) => emit({ search: value }), 180);

  const searchInput = h('input.input.toolbar-search-input', {
    type: 'search',
    inputmode: 'search',
    autocomplete: 'off',
    autocapitalize: 'off',
    'aria-label': searchPlaceholder,
    placeholder: searchPlaceholder,
    value: state.search || '',
    onInput: (e) => emitSearchDebounced(e.target.value),
    onSearch: (e) => emit({ search: e.target.value }),
  });

  const filterControls = filters.map((f) => h('label.toolbar-field', null,
    h('span.toolbar-field-label', null, f.label),
    h('select.input.input-select.toolbar-select', {
      value: state[f.name] ?? '',
      onChange: (e) => emit({ [f.name]: e.target.value }),
    },
    h('option', { value: '' }, f.all || 'Alle'),
    ...f.options.map((o) => h('option', { value: o.value }, o.label)))));

  const sortControl = sorts.length
    ? h('label.toolbar-field', null,
      h('span.toolbar-field-label', null, 'Sortierung'),
      h('select.input.input-select.toolbar-select', {
        value: `${state.sortField}:${state.sortDir}`,
        onChange: (e) => {
          const [field, dir] = e.target.value.split(':');
          emit({ sortField: field, sortDir: Number(dir) });
        },
      },
      ...sorts.flatMap((s) => [
        h('option', { value: `${s.value}:1` }, `${s.label} ↑`),
        h('option', { value: `${s.value}:-1` }, `${s.label} ↓`),
      ])))
    : null;

  const hasActiveFilter = Boolean(state.search) || filters.some((f) => state[f.name]);

  const reset = hasActiveFilter
    ? Button('Filter zurücksetzen', {
      variant: 'ghost', size: 'sm', iconName: 'close',
      onClick: () => emit({
        search: '',
        ...Object.fromEntries(filters.map((f) => [f.name, ''])),
      }),
    })
    : null;

  const count = resultCount !== null
    ? h('span.toolbar-count', null,
      totalCount !== null && resultCount !== totalCount
        ? `${resultCount} von ${totalCount}`
        : `${resultCount} ${resultCount === 1 ? 'Eintrag' : 'Einträge'}`)
    : null;

  return h('div.toolbar', null,
    h('div.toolbar-search', null,
      icon('search', { size: 18, class: 'icon toolbar-search-icon' }),
      searchInput),
    h('div.toolbar-controls', null,
      ...filterControls,
      sortControl,
      ...extra),
    h('div.toolbar-meta', null, count, reset));
}

/**
 * Segmentierte Umschaltung (Zeitraum, Ansichtsmodus).
 * Als Buttons statt Select: die Auswahl ist kurz und mit einem Tipp erreichbar.
 */
export function SegmentedControl(options = {}) {
  const { items = [], value, onChange, label } = options;
  const group = h('div.segmented', { role: 'group', 'aria-label': label || 'Auswahl' });
  for (const item of items) {
    group.appendChild(h('button', {
      type: 'button',
      class: `segmented-btn ${item.value === value ? 'is-active' : ''}`.trim(),
      'aria-pressed': item.value === value ? 'true' : 'false',
      onClick: () => onChange(item.value),
    }, item.label));
  }
  return group;
}

/** Container, dessen Inhalt eine Ansicht gezielt neu zeichnen kann. */
export function createRegion(className = 'region') {
  const el = h('div', { class: className });
  return {
    el,
    render(...children) {
      mount(el, ...children.filter(Boolean));
      return el;
    },
  };
}
