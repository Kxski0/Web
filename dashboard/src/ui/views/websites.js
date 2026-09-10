/**
 * Meine Websites.
 *
 * Kachelansicht mit Vorschaubild, weil hier das visuelle Wiedererkennen zählt.
 * Die URL ist immer anklickbar und öffnet in einem neuen Tab.
 */
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { Button, Card, StatCard, LinkOut, TagList } from '../components/basics.js';
import { openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, selectFilter, refFilter, dateCell, statusCell, refCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { previewUrlFor } from '../../domain/preview.js';
import { WEBSITE_STATUS, optionLabel, optionTone } from '../../data/schema.js';
import { formatDate } from '../../core/format.js';
import { hostOf, initials, normalizeUrl } from '../../core/util.js';

/**
 * Vorschaukachel.
 * Ohne konfigurierten Dienst und ohne eigenes Bild erscheint eine Kachel mit
 * den Initialen – das ist ehrlicher als ein kaputtes Bild-Symbol.
 */
export function PreviewTile(store, record, { field = 'thumbnail', ratio = '16 / 10' } = {}) {
  const src = previewUrlFor(store.settings, record, field);
  const label = record.title || record.name || '';
  const tile = h('div.preview', { style: { 'aspect-ratio': ratio } });

  if (src) {
    const img = h('img.preview-img', { src, alt: '', loading: 'lazy', decoding: 'async' });
    img.addEventListener('error', () => {
      img.remove();
      tile.appendChild(fallback());
    });
    tile.appendChild(img);
  } else {
    tile.appendChild(fallback());
  }

  function fallback() {
    return h('div.preview-fallback', null,
      h('span.preview-initials', null, initials(label || hostOf(record.url))),
      h('span.preview-host', null, hostOf(record.url) || 'ohne URL'));
  }
  return tile;
}

export function renderWebsites(ctx) {
  const { store, navigate } = ctx;
  const all = store.all('websites');
  const countBy = (status) => all.filter((w) => w.status === status).length;

  const summary = h('div.stat-row.stat-row-compact', null,
    ...WEBSITE_STATUS.map((s) => StatCard({
      label: optionLabel(WEBSITE_STATUS, s.value),
      value: countBy(s.value),
      tone: optionTone(WEBSITE_STATUS, s.value),
    })));

  return createListView({
    ctx,
    entityKey: 'websites',
    subtitle: `${all.length} Websites`,
    above: summary,
    searchPlaceholder: 'Website, Kunde oder Technologie suchen …',
    columns: [
      { key: 'title', label: 'Projektname', primary: true, sortable: true, render: (w) => h('span.cell-strong', null, w.title) },
      {
        key: 'customerId',
        label: 'Kunde',
        sortable: true,
        value: (w) => store.titleOf('customers', w.customerId),
        render: (w) => refCell(store, 'customers', w.customerId, (id) => navigate('kunden', id)),
      },
      { key: 'status', label: 'Status', sortable: true, render: (w) => statusCell('websites', 'status', w.status) },
      { key: 'url', label: 'URL', render: (w) => LinkOut(w.url, hostOf(w.url)) },
      { key: 'launchDate', label: 'Erstellt', sortable: true, render: (w) => dateCell(w.launchDate) },
      { key: 'tech', label: 'Technologien', hideOn: 'narrow', render: (w) => TagList(w.tech) },
    ],
    filters: [
      selectFilter('websites', 'status'),
      refFilter(store, 'websites', 'customerId'),
    ],
    sorts: [
      { value: 'launchDate', label: 'Erstellungsdatum' },
      { value: 'title', label: 'Projektname' },
      { value: 'status', label: 'Status' },
      { value: 'customerId', label: 'Kunde' },
    ],
    onRowClick: (w) => navigate('websites', w._id),
    renderRows: (rows) => h('div.tile-grid', null, ...rows.map((w) => WebsiteTile(ctx, w))),
  });
}

function WebsiteTile(ctx, w) {
  const { store, navigate } = ctx;
  const url = normalizeUrl(w.url);
  return h('article.tile', null,
    h('button.tile-preview-btn', {
      type: 'button',
      'aria-label': `${w.title} öffnen`,
      onClick: () => navigate('websites', w._id),
    }, PreviewTile(store, w)),
    h('div.tile-body', null,
      h('div.tile-head', null,
        h('button.tile-title', { type: 'button', onClick: () => navigate('websites', w._id) }, w.title),
        statusCell('websites', 'status', w.status)),
      h('p.tile-sub', null,
        [store.titleOf('customers', w.customerId), formatDate(w.launchDate)].filter(Boolean).join(' · ') || '—'),
      w.tech?.length ? TagList(w.tech) : null,
      h('div.tile-actions', null,
        url
          ? h('a.btn.btn-secondary.btn-sm', { href: url, target: '_blank', rel: 'noopener noreferrer' },
            icon('external', { size: 16 }), h('span', null, 'Website öffnen'))
          : null,
        Button('Bearbeiten', {
          variant: 'ghost', size: 'sm', iconName: 'edit', iconOnly: true,
          onClick: () => openEditDialog({ store, entityKey: 'websites', id: w._id }),
        }),
        Button('Löschen', {
          variant: 'ghost-danger', size: 'sm', iconName: 'trash', iconOnly: true,
          onClick: () => confirmDelete({ store, entityKey: 'websites', id: w._id }),
        }))));
}

/* ------------------------------------------------------------- Detail -- */

export function renderWebsiteDetail(ctx, id) {
  const { store, navigate } = ctx;
  const site = store.byId('websites', id);
  if (!site) return createDetailView({ ctx, entityKey: 'websites', id });

  const url = normalizeUrl(site.url);
  const openBtn = url
    ? h('a.btn.btn-primary', { href: url, target: '_blank', rel: 'noopener noreferrer' },
      icon('external', { size: 18 }), h('span', null, 'Website öffnen'))
    : null;

  const previewCard = Card({
    title: 'Vorschau',
    padded: false,
    children: h('div.detail-preview', null, PreviewTile(store, site, { ratio: '16 / 9' })),
  });

  const customerOrders = site.customerId
    ? store.all('orders').filter((o) => o.customerId === site.customerId)
    : [];
  const ordersCard = customerOrders.length
    ? Card({
      title: 'Aufträge des Kunden',
      children: h('ul.mini-list', null, ...customerOrders.map((o) => h('li.mini-item', null,
        h('button.cell-link', { type: 'button', onClick: () => navigate('auftraege', o._id) }, o.title),
        statusCell('orders', 'status', o.status)))),
    })
    : null;

  return createDetailView({
    ctx,
    entityKey: 'websites',
    id,
    subtitle: [store.titleOf('customers', site.customerId), hostOf(site.url)].filter(Boolean).join(' · '),
    headerExtras: [openBtn].filter(Boolean),
    skipFields: ['thumbnail'],
    aside: [previewCard, ordersCard].filter(Boolean),
  });
}
