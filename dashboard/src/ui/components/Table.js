/**
 * Tabelle mit zwei Darstellungen aus einer Definition.
 *
 * Auf breiten Bildschirmen eine echte `<table>`, unterhalb von ~900px (iPad
 * hochkant, Smartphone) dieselben Daten als Kartenliste. Das ist der einzige
 * Weg, auf dem Tabellen auf dem iPad wirklich benutzbar bleiben – horizontales
 * Scrollen in einer 8-spaltigen Tabelle ist es nicht.
 *
 * Spaltendefinition:
 *   { key, label, render(row) -> Node|string, value(row) -> sortierbarer Wert,
 *     align, width, hideOn: 'narrow', primary: true }
 */
import { h, delegate } from '../dom.js';
import { icon } from '../icons.js';
import { Button, EmptyState } from './basics.js';
import { sortBy } from '../../core/util.js';

/** Sortiert Zeilen anhand einer Spaltendefinition. */
export function sortRows(rows, columns, sort) {
  if (!sort || !sort.field) return rows;
  const col = columns.find((c) => c.key === sort.field);
  const pick = col && col.value ? col.value : (r) => r[sort.field];
  return sortBy(rows, pick, sort.dir === -1 ? -1 : 1);
}

/**
 * @param {object} options
 * @param {Array} options.rows
 * @param {Array} options.columns
 * @param {(row)=>void} [options.onRowClick]
 * @param {(row)=>Array<Node>} [options.rowActions] Immer sichtbar – keine Hover-Aktionen.
 * @param {{field:string,dir:number}} [options.sort]
 * @param {(sort)=>void} [options.onSort]
 */
export function Table(options = {}) {
  const {
    rows = [], columns = [], onRowClick, rowActions, sort, onSort,
    empty, rowKey = (r) => r._id, caption,
  } = options;

  if (!rows.length) {
    return empty || EmptyState({ title: 'Keine Einträge', text: 'Für die aktuelle Auswahl gibt es nichts anzuzeigen.' });
  }

  const wrap = h('div.table-wrap');

  /* ------------------------------------------------------------ Tabelle -- */

  const thead = h('thead', null,
    h('tr', null,
      ...columns.map((col) => {
        const active = sort && sort.field === col.key;
        const cls = ['th', col.align ? `align-${col.align}` : null, col.hideOn === 'narrow' ? 'hide-narrow' : null]
          .filter(Boolean).join(' ');
        if (!col.sortable || !onSort) {
          return h('th', { class: cls, scope: 'col', style: col.width ? { width: col.width } : null }, col.label);
        }
        return h('th', { class: `${cls} th-sortable`, scope: 'col', 'aria-sort': active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none' },
          h('button.th-btn', {
            type: 'button',
            onClick: () => onSort({ field: col.key, dir: active && sort.dir === 1 ? -1 : 1 }),
          },
          h('span', null, col.label),
          icon(active && sort.dir === -1 ? 'chevronDown' : 'chevronRight', {
            size: 14,
            class: `icon sort-icon ${active ? 'is-active' : ''}`,
          })));
      }),
      rowActions ? h('th', { class: 'th align-right', scope: 'col' }, h('span.sr-only', null, 'Aktionen')) : null));

  const tbody = h('tbody');
  for (const row of rows) {
    const tr = h('tr', {
      class: onRowClick ? 'row-clickable' : null,
      dataset: { id: rowKey(row) },
      tabindex: onRowClick ? '0' : null,
      role: onRowClick ? 'link' : null,
    });
    for (const col of columns) {
      const content = col.render ? col.render(row) : row[col.key];
      const cls = ['td', col.align ? `align-${col.align}` : null, col.hideOn === 'narrow' ? 'hide-narrow' : null,
        col.primary ? 'td-primary' : null].filter(Boolean).join(' ');
      tr.appendChild(h('td', { class: cls }, content ?? '—'));
    }
    if (rowActions) {
      tr.appendChild(h('td', { class: 'td align-right td-actions' },
        h('div.row-actions', null, ...rowActions(row))));
    }
    tbody.appendChild(tr);
  }

  const table = h('table.table', null, caption ? h('caption.sr-only', null, caption) : null, thead, tbody);
  wrap.appendChild(h('div.table-scroll', null, table));

  /* -------------------------------------------------------- Kartenliste -- */

  const cards = h('div.card-rows');
  for (const row of rows) {
    const primary = columns.find((c) => c.primary) || columns[0];
    const rest = columns.filter((c) => c !== primary && c.hideOn !== 'card');

    const head = h('div.card-row-head', null,
      h('div.card-row-title', null, primary.render ? primary.render(row) : row[primary.key]),
      rowActions ? h('div.row-actions', null, ...rowActions(row)) : null);

    const body = h('dl.card-row-body', null,
      ...rest.map((col) => h('div.card-row-item', null,
        h('dt', null, col.label),
        h('dd', null, col.render ? col.render(row) : (row[col.key] ?? '—')))));

    cards.appendChild(h('article', {
      class: `card-row ${onRowClick ? 'is-clickable' : ''}`.trim(),
      dataset: { id: rowKey(row) },
      tabindex: onRowClick ? '0' : null,
    }, head, body));
  }
  wrap.appendChild(cards);

  /* -------------------------------------------------------------- Klick -- */

  if (onRowClick) {
    const byId = new Map(rows.map((r) => [String(rowKey(r)), r]));
    const activate = (e, el) => {
      // Klicks auf Aktionen oder Links dürfen nicht die Zeile öffnen.
      if (e.target.closest('.row-actions, a, button.tag-btn')) return;
      const row = byId.get(el.dataset.id);
      if (row) onRowClick(row);
    };
    delegate(wrap, 'tr[data-id], article.card-row[data-id]', 'click', activate);
    delegate(wrap, 'tr[data-id], article.card-row[data-id]', 'keydown', (e, el) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(e, el);
      }
    });
  }

  return wrap;
}

/** Standardaktionen einer Zeile – als Icon-Buttons, dauerhaft sichtbar. */
export function rowActionButtons({ onEdit, onDelete, extra = [] }) {
  const list = [...extra];
  if (onEdit) list.push(Button('Bearbeiten', { iconName: 'edit', iconOnly: true, size: 'sm', variant: 'ghost', onClick: onEdit }));
  if (onDelete) list.push(Button('Löschen', { iconName: 'trash', iconOnly: true, size: 'sm', variant: 'ghost-danger', onClick: onDelete }));
  return list;
}
