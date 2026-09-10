/**
 * Website Inspiration.
 *
 * Referenzen mit Kategorie, Tags, Screenshot und den beiden Leitfragen
 * („Warum gefällt sie mir?", „Was übernehme ich?"). Filtern läuft über
 * Kategorie und Tags.
 *
 * Die Funktion „Website analysieren" ist vollständig vorbereitet, aber
 * optional – siehe domain/preview.js für die technischen Grenzen und
 * wix/backend/analyze.web.js für die serverseitige Umsetzung.
 */
import { h, mount } from '../dom.js';
import { icon } from '../icons.js';
import { Button, Card, LinkOut, TagList, Notice } from '../components/basics.js';
import { openModal, toast } from '../components/Modal.js';
import { openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, selectFilter, statusCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { PreviewTile } from './websites.js';
import { analyzeWebsite, analyzeAvailable, analysisTemplate, AnalyzeUnavailableError } from '../../domain/preview.js';
import { hostOf, normalizeUrl } from '../../core/util.js';
import { formatDate } from '../../core/format.js';

export function renderReferences(ctx) {
  const { store, navigate } = ctx;
  const all = store.all('references');

  // Tagfilter aus den tatsächlich vergebenen Tags aufbauen.
  const tagCounts = new Map();
  for (const r of all) {
    for (const t of r.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  }
  const tagOptions = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'de'))
    .map(([tag, count]) => ({ value: tag, label: `${tag} (${count})` }));

  return createListView({
    ctx,
    entityKey: 'references',
    title: 'Website Inspiration',
    subtitle: `${all.length} Referenzen · ${tagCounts.size} Tags`,
    searchPlaceholder: 'Name, URL, Notiz oder Tag suchen …',
    columns: [
      { key: 'name', label: 'Name', primary: true, sortable: true, render: (r) => h('span.cell-strong', null, r.name) },
      { key: 'category', label: 'Kategorie', sortable: true, render: (r) => statusCell('references', 'category', r.category) },
      { key: 'url', label: 'URL', render: (r) => LinkOut(r.url, hostOf(r.url)) },
      { key: 'tags', label: 'Tags', hideOn: 'narrow', render: (r) => TagList(r.tags) },
      { key: '_createdAt', label: 'Gespeichert', sortable: true, render: (r) => formatDate(r._createdAt) },
    ],
    filters: [
      selectFilter('references', 'category', 'Kategorie'),
      {
        name: 'tag',
        label: 'Tag',
        options: tagOptions,
        all: 'Alle Tags',
        test: (row, value) => (row.tags || []).includes(value),
      },
      {
        name: 'analysed',
        label: 'Analyse',
        options: [
          { value: 'yes', label: 'Mit Analyse' },
          { value: 'no', label: 'Ohne Analyse' },
        ],
        all: 'Egal',
        test: (row, value) => (value === 'yes' ? Boolean(row.analysis) : !row.analysis),
      },
    ],
    sorts: [
      { value: '_createdAt', label: 'Gespeichert am' },
      { value: 'name', label: 'Name' },
      { value: 'category', label: 'Kategorie' },
    ],
    onRowClick: (r) => navigate('inspiration', r._id),
    renderRows: (rows) => h('div.tile-grid', null, ...rows.map((r) => ReferenceTile(ctx, r))),
  });
}

function ReferenceTile(ctx, r) {
  const { store, navigate } = ctx;
  const url = normalizeUrl(r.url);
  return h('article.tile', null,
    h('button.tile-preview-btn', {
      type: 'button',
      'aria-label': `${r.name} öffnen`,
      onClick: () => navigate('inspiration', r._id),
    }, PreviewTile(store, r, { field: 'screenshot' })),
    h('div.tile-body', null,
      h('div.tile-head', null,
        h('button.tile-title', { type: 'button', onClick: () => navigate('inspiration', r._id) }, r.name),
        statusCell('references', 'category', r.category)),
      r.likeReason ? h('p.tile-text', null, r.likeReason) : null,
      r.tags?.length ? TagList(r.tags) : null,
      h('div.tile-actions', null,
        url
          ? h('a.btn.btn-secondary.btn-sm', { href: url, target: '_blank', rel: 'noopener noreferrer nofollow' },
            icon('external', { size: 16 }), h('span', null, 'Ansehen'))
          : null,
        r.analysis ? h('span.badge.tone-info', null, 'Analyse') : null,
        Button('Bearbeiten', {
          variant: 'ghost', size: 'sm', iconName: 'edit', iconOnly: true,
          onClick: () => openEditDialog({ store, entityKey: 'references', id: r._id }),
        }),
        Button('Löschen', {
          variant: 'ghost-danger', size: 'sm', iconName: 'trash', iconOnly: true,
          onClick: () => confirmDelete({ store, entityKey: 'references', id: r._id }),
        }))));
}

/* ------------------------------------------------------------- Detail -- */

export function renderReferenceDetail(ctx, id) {
  const { store } = ctx;
  const ref = store.byId('references', id);
  if (!ref) return createDetailView({ ctx, entityKey: 'references', id });

  const url = normalizeUrl(ref.url);
  const openBtn = url
    ? h('a.btn.btn-secondary', { href: url, target: '_blank', rel: 'noopener noreferrer nofollow' },
      icon('external', { size: 18 }), h('span', null, 'Website ansehen'))
    : null;

  const analyzeBtn = Button('Website analysieren', {
    variant: 'primary',
    iconName: 'sparkle',
    onClick: () => openAnalyzeDialog(ctx, id),
  });

  const previewCard = Card({
    title: 'Vorschau',
    padded: false,
    children: h('div.detail-preview', null, PreviewTile(store, ref, { field: 'screenshot', ratio: '16 / 9' })),
  });

  const analysisCard = Card({
    title: 'Analyse',
    subtitle: ref.analysis ? null : 'Noch keine Analyse gespeichert',
    actions: Button(ref.analysis ? 'Neu analysieren' : 'Analysieren', {
      variant: 'secondary', size: 'sm', iconName: 'sparkle',
      onClick: () => openAnalyzeDialog(ctx, id),
    }),
    children: ref.analysis
      ? h('pre.analysis-text', null, ref.analysis)
      : h('p.muted', null,
        'Hier landet die Analyse zu Aufbau, Hero, Navigation, Animationen, Layout, '
        + 'Typografie, CTA-Struktur und UX-Elementen.'),
  });

  return createDetailView({
    ctx,
    entityKey: 'references',
    id,
    subtitle: hostOf(ref.url),
    headerExtras: [openBtn, analyzeBtn].filter(Boolean),
    skipFields: ['screenshot', 'analysis'],
    sections: [analysisCard],
    aside: [previewCard],
  });
}

/* ------------------------------------------------------------ Analyse -- */

/**
 * Analyse-Dialog.
 *
 * Ist ein Dienst eingerichtet, wird er aufgerufen und das Ergebnis vor dem
 * Speichern angezeigt. Ist keiner eingerichtet, erklärt der Dialog genau, was
 * fehlt, und bietet die Vorlage zum Ausfüllen von Hand an – so bleibt der
 * Bereich in jedem Fall nutzbar.
 */
function openAnalyzeDialog(ctx, id) {
  const { store, bridge } = ctx;
  const ref = store.byId('references', id);
  if (!ref) return null;

  const available = analyzeAvailable({ settings: store.settings, bridge });
  const body = h('div.analyze-body');
  const textarea = h('textarea.input.input-area.analyze-text', {
    rows: 16,
    'aria-label': 'Analyse',
  }, ref.analysis || '');

  const saveBtn = Button('Analyse speichern', {
    variant: 'primary',
    onClick: async () => {
      const res = await store.update('references', id, { ...ref, analysis: textarea.value });
      if (res.ok) {
        toast('Analyse gespeichert.');
        modal.close();
      } else {
        toast(res.errors?._ || 'Speichern nicht möglich.', 'danger');
      }
    },
  });

  const runBtn = Button('Jetzt analysieren', {
    variant: 'secondary',
    iconName: 'refresh',
    onClick: async () => {
      runBtn.disabled = true;
      mount(status, Notice('Die Website wird analysiert – das kann einige Sekunden dauern.', 'info'));
      try {
        const text = await analyzeWebsite({ url: ref.url, settings: store.settings, bridge });
        textarea.value = text;
        mount(status, Notice('Analyse erhalten. Vor dem Speichern gern noch ergänzen.', 'success'));
      } catch (err) {
        mount(status, Notice(
          err instanceof AnalyzeUnavailableError
            ? err.message
            : `Analyse fehlgeschlagen: ${err.message}`,
          'danger',
        ));
      } finally {
        runBtn.disabled = false;
      }
    },
  });

  const status = h('div.analyze-status');

  const explain = available
    ? null
    : h('div.analyze-explain', null,
      Notice('Automatische Analyse ist nicht eingerichtet – die Vorlage unten funktioniert trotzdem.', 'warn'),
      h('p.modal-text', null,
        'Ein Browser kann fremde Websites weder auslesen (CORS) noch als Bild aufnehmen '
        + '(X-Frame-Options). Die Analyse muss deshalb serverseitig laufen. Zwei Wege:'),
      h('ul.explain-list', null,
        h('li', null, h('strong', null, 'In Wix: '),
          'das mitgelieferte Web-Modul ', h('code', null, 'backend/analyze.web.js'),
          ' veröffentlichen und den API-Schlüssel im Wix Secrets Manager hinterlegen.'),
        h('li', null, h('strong', null, 'Ohne Wix: '),
          'unter Einstellungen einen eigenen Endpunkt eintragen, der ',
          h('code', null, 'POST { url }'), ' entgegennimmt und ',
          h('code', null, '{ analysis: "…" }'), ' zurückgibt.')));

  mount(body,
    h('p.modal-text', null, `Referenz: ${ref.name} · ${hostOf(ref.url) || 'ohne URL'}`),
    explain,
    h('div.analyze-actions', null,
      available ? runBtn : null,
      Button('Vorlage einfügen', {
        variant: 'ghost',
        iconName: 'edit',
        onClick: () => {
          if (!textarea.value.trim()) textarea.value = analysisTemplate(ref);
          else textarea.value = `${textarea.value}\n\n${analysisTemplate(ref)}`;
          textarea.focus();
        },
      })),
    status,
    textarea);

  const modal = openModal({
    title: 'Website analysieren',
    size: 'lg',
    content: body,
    footer: [
      Button('Abbrechen', { variant: 'secondary', onClick: () => modal.close() }),
      saveBtn,
    ],
  });
  return modal;
}
