/**
 * Fabrik für Listenansichten.
 *
 * Aufträge, Kunden, Rechnungen, Projekte, Aufgaben und Websites teilen sich
 * dieselbe Mechanik: Suchen, Filtern, Sortieren, Anlegen, Bearbeiten, Löschen.
 * Diese Datei enthält diese Mechanik einmal; die einzelnen Ansichten liefern
 * nur noch Spalten und Filter.
 */
import { h } from '../dom.js';
import { Button, PageHeader, EmptyState, StatusBadge } from '../components/basics.js';
import { Table, sortRows, rowActionButtons } from '../components/Table.js';
import { Toolbar, createRegion } from '../components/Toolbar.js';
import { openCreateDialog, openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { entity, optionLabel, optionTone } from '../../data/schema.js';
import { fold } from '../../core/util.js';
import { formatMoney, formatDate, daysUntil } from '../../core/format.js';

/* ------------------------------------------------------- Zellenrenderer -- */

export function moneyCell(value) {
  if (value === null || value === undefined || value === '') return h('span.muted', null, '—');
  return h('span.num', null, formatMoney(value));
}

export function dateCell(value, { warnPast = false } = {}) {
  if (!value) return h('span.muted', null, '—');
  const left = daysUntil(value);
  if (!warnPast || left === null) return h('span', null, formatDate(value));
  const tone = left < 0 ? 'danger' : left <= 7 ? 'warn' : '';
  return h('span', { class: tone ? `date-flag tone-${tone}` : null, title: left < 0 ? `${Math.abs(left)} Tage überfällig` : `noch ${left} Tage` },
    formatDate(value));
}

export function statusCell(entityKey, fieldName, value) {
  const f = entity(entityKey).fields.find((x) => x.name === fieldName);
  return StatusBadge(optionLabel(f?.options, value), optionTone(f?.options, value));
}

export function refCell(store, refKey, id, onOpen) {
  if (!id) return h('span.muted', null, '—');
  const record = store.byId(refKey, id);
  if (!record) return h('span.muted', null, 'entfernt');
  const label = store.titleOf(refKey, record);
  if (!onOpen) return h('span', null, label);
  return h('button.cell-link', { type: 'button', onClick: () => onOpen(id) }, label);
}

/* ----------------------------------------------------------- Textsuche -- */

/** Durchsucht die im Schema hinterlegten Felder plus verknüpfte Titel. */
function matchesSearch(store, entityKey, record, needle) {
  if (!needle) return true;
  const def = entity(entityKey);
  const parts = [];
  for (const name of def.searchFields) {
    const v = record[name];
    if (Array.isArray(v)) parts.push(v.join(' '));
    else if (v) parts.push(String(v));
  }
  for (const f of def.fields) {
    if (f.type === 'ref' && record[f.name]) parts.push(store.titleOf(f.ref, record[f.name]));
  }
  return fold(parts.join(' ')).includes(needle);
}

/**
 * @param {object} options
 * @param {object} options.ctx           { store, navigate, refresh }
 * @param {string} options.entityKey
 * @param {(row)=>Array} options.columns
 * @param {Array} [options.filters]      [{ name, label, options, test(row, value) }]
 * @param {Array} [options.sorts]
 * @param {(row)=>void} [options.onRowClick]
 * @param {Node|Node[]} [options.above]  Inhalt zwischen Kopf und Toolbar
 * @param {(rows)=>Node} [options.renderRows] Eigene Darstellung statt Tabelle
 */
export function createListView(options) {
  const {
    ctx, entityKey, columns, filters = [], sorts = [], onRowClick,
    title, subtitle, above = null, searchPlaceholder, renderRows = null,
    headerActions = [], createPreset = {}, emptyState = null, baseRows = null,
  } = options;

  const { store } = ctx;
  const def = entity(entityKey);
  const state = ctx.getViewState(entityKey, {
    search: '',
    sortField: def.defaultSort.field,
    sortDir: def.defaultSort.dir,
    ...Object.fromEntries(filters.map((f) => [f.name, ''])),
  });

  const region = createRegion('list-region');
  const toolbarRegion = createRegion('toolbar-region');

  function currentRows() {
    const source = baseRows ? baseRows() : store.all(entityKey);
    const needle = fold(state.search || '');
    let rows = source.filter((row) => matchesSearch(store, entityKey, row, needle));
    for (const f of filters) {
      const value = state[f.name];
      if (!value) continue;
      rows = rows.filter((row) => (f.test ? f.test(row, value) : row[f.name] === value));
    }
    return sortRows(rows, columns, { field: state.sortField, dir: state.sortDir });
  }

  function refreshRows() {
    const rows = currentRows();
    const total = (baseRows ? baseRows() : store.all(entityKey)).length;

    toolbarRegion.render(Toolbar({
      state,
      filters,
      sorts,
      searchPlaceholder: searchPlaceholder || `${def.label} durchsuchen …`,
      resultCount: rows.length,
      totalCount: total,
      onChange: (patch) => {
        Object.assign(state, patch);
        refreshRows();
      },
    }));

    if (!rows.length) {
      const hasFilter = Boolean(state.search) || filters.some((f) => state[f.name]);
      region.render(hasFilter
        ? EmptyState({
          iconName: 'filter',
          title: 'Keine Treffer',
          text: 'Für die aktuelle Filterauswahl gibt es keine Einträge.',
          action: Button('Filter zurücksetzen', {
            variant: 'secondary',
            onClick: () => {
              Object.assign(state, { search: '', ...Object.fromEntries(filters.map((f) => [f.name, ''])) });
              refreshRows();
            },
          }),
        })
        : (emptyState || EmptyState({
          title: `Noch keine ${def.label}`,
          text: `Legen Sie den ersten Eintrag an – die Kennzahlen im Dashboard aktualisieren sich automatisch.`,
          action: Button(`${def.singular} anlegen`, { variant: 'primary', iconName: 'plus', onClick: create }),
        })));
      return;
    }

    region.render(renderRows
      ? renderRows(rows)
      : Table({
        rows,
        columns,
        caption: def.label,
        onRowClick,
        sort: { field: state.sortField, dir: state.sortDir },
        onSort: (sort) => {
          state.sortField = sort.field;
          state.sortDir = sort.dir;
          refreshRows();
        },
        rowActions: (row) => rowActionButtons({
          onEdit: () => openEditDialog({ store, entityKey, id: row._id }),
          onDelete: () => confirmDelete({ store, entityKey, id: row._id }),
        }),
      }));
  }

  function create() {
    openCreateDialog({ store, entityKey, preset: createPreset });
  }

  refreshRows();

  return h('div.view', null,
    PageHeader({
      title: title || def.label,
      subtitle,
      actions: [
        ...headerActions,
        Button(`${def.singular} anlegen`, { variant: 'primary', iconName: 'plus', onClick: create }),
      ],
    }),
    above,
    toolbarRegion.el,
    region.el);
}

/** Filterdefinition aus einer Schema-Auswahlliste. */
export function selectFilter(entityKey, fieldName, label) {
  const f = entity(entityKey).fields.find((x) => x.name === fieldName);
  return {
    name: fieldName,
    label: label || f.label,
    options: f.options.map((o) => ({ value: o.value, label: o.label })),
  };
}

/** Filter über eine Referenz (z. B. „nur dieser Kunde"). */
export function refFilter(store, entityKey, fieldName, label) {
  const f = entity(entityKey).fields.find((x) => x.name === fieldName);
  return {
    name: fieldName,
    label: label || f.label,
    options: store.all(f.ref)
      .map((r) => ({ value: r._id, label: store.titleOf(f.ref, r) }))
      .sort((a, b) => a.label.localeCompare(b.label, 'de')),
  };
}
