/**
 * Generische Detailansicht.
 *
 * Zeigt alle Schema-Felder eines Datensatzes und darunter beliebige
 * Zusatzabschnitte (verknüpfte Rechnungen, Aufgaben, Kennzahlen). Die
 * Feldliste kommt aus dem Schema – neue Felder erscheinen automatisch.
 */
import { h } from '../dom.js';
import { icon } from '../icons.js';
import {
  Button, Card, PageHeader, DefList, DefItem, LinkOut, StatusBadge, TagList, EmptyState,
} from '../components/basics.js';
import { openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { entity, optionLabel, optionTone } from '../../data/schema.js';
import { formatMoney, formatDate, formatDateTime } from '../../core/format.js';

/** Einzelnes Feld in der passenden Darstellung. */
function renderFieldValue(store, entityKey, f, record, navigate) {
  const value = record[f.name];
  switch (f.type) {
    case 'money':
    case 'number':
      return value === null || value === undefined || value === ''
        ? h('span.muted', null, '—')
        : h('span.num', null, f.type === 'money' ? formatMoney(value) : String(value));
    case 'date':
      return value ? formatDate(value) : h('span.muted', null, '—');
    case 'select':
      return StatusBadge(optionLabel(f.options, value), optionTone(f.options, value));
    case 'url':
      return LinkOut(value);
    case 'tags': {
      const list = Array.isArray(value) ? value : [];
      // Links in Tag-Feldern (Projekt-Links) anklickbar machen.
      if (f.name === 'links') {
        return list.length
          ? h('div.tag-list', null, ...list.map((u) => LinkOut(u, u.replace(/^https?:\/\//, ''))))
          : h('span.muted', null, '—');
      }
      return TagList(list);
    }
    case 'ref': {
      if (!value) return h('span.muted', null, '—');
      const target = store.byId(f.ref, value);
      if (!target) return h('span.muted', null, 'entfernt');
      const label = store.titleOf(f.ref, target);
      if (!navigate) return h('span', null, label);
      return h('button.cell-link', {
        type: 'button',
        onClick: () => navigate(entity(f.ref).route, value),
      }, label);
    }
    case 'image':
      return value
        ? h('img.detail-image', { src: value, alt: '', loading: 'lazy' })
        : h('span.muted', null, '—');
    case 'files': {
      const list = Array.isArray(value) ? value : [];
      if (!list.length) return h('span.muted', null, '—');
      return h('ul.files-list', null, ...list.map((file) => h('li.files-item', null,
        icon('folder', { size: 16 }),
        h('a', { href: file.data, download: file.name, class: 'cell-link' }, file.name),
        h('span.muted', null, `${Math.round((file.size || 0) / 1024)} KB`))));
    }
    case 'textarea':
      return value
        ? h('p.detail-text', null, value)
        : h('span.muted', null, '—');
    default:
      return value ? h('span', null, String(value)) : h('span.muted', null, '—');
  }
}

/**
 * @param {object} options
 * @param {object} options.ctx
 * @param {string} options.entityKey
 * @param {string} options.id
 * @param {Node[]} [options.sections]  Zusatzabschnitte unter den Stammdaten
 * @param {Node[]} [options.aside]     Inhalt in der rechten Spalte
 * @param {string[]} [options.skipFields]
 */
export function createDetailView(options) {
  const {
    ctx, entityKey, id, sections = [], aside = [], skipFields = [], headerExtras = [],
    subtitle = null, stats = null,
  } = options;
  const { store, navigate } = ctx;
  const def = entity(entityKey);
  const record = store.byId(entityKey, id);

  if (!record) {
    return h('div.view', null,
      PageHeader({ title: `${def.singular} nicht gefunden` }),
      EmptyState({
        title: 'Dieser Datensatz existiert nicht mehr',
        text: 'Er wurde gelöscht oder der Link ist veraltet.',
        action: Button(`Zurück zu ${def.label}`, { variant: 'primary', onClick: () => navigate(def.route) }),
      }));
  }

  const fields = def.fields.filter((f) => !skipFields.includes(f.name));

  const master = Card({
    title: 'Stammdaten',
    children: DefList(fields.map((f) => DefItem(
      f.label,
      renderFieldValue(store, entityKey, f, record, navigate),
      { className: ['textarea', 'image', 'files'].includes(f.type) ? 'def-wide' : '' },
    ))),
  });

  const meta = h('p.detail-meta', null,
    `Angelegt ${formatDateTime(record._createdAt)}`,
    record._updatedAt && record._updatedAt !== record._createdAt
      ? ` · zuletzt geändert ${formatDateTime(record._updatedAt)}`
      : '');

  const back = h('button.back-link', {
    type: 'button',
    onClick: () => navigate(def.route),
  }, icon('arrowLeft', { size: 16 }), h('span', null, def.label));

  return h('div.view', null,
    PageHeader({
      back,
      title: store.titleOf(entityKey, record),
      subtitle,
      actions: [
        ...headerExtras,
        Button('Bearbeiten', { variant: 'secondary', iconName: 'edit', onClick: () => openEditDialog({ store, entityKey, id }) }),
        Button('Löschen', {
          variant: 'ghost-danger',
          iconName: 'trash',
          onClick: () => confirmDelete({ store, entityKey, id, onDeleted: () => navigate(def.route) }),
        }),
      ],
    }),
    stats,
    h('div.detail-grid', null,
      h('div.detail-main', null, master, ...sections, meta),
      aside.length ? h('div.detail-aside', null, ...aside) : null));
}
