/**
 * Startseite.
 *
 * Oben die neun Kennzahlen aus der Anforderung, darunter die konfigurierbaren
 * Widgets. Alle Werte kommen aus `domain/metrics.js` – hier wird nichts
 * gerechnet, nur dargestellt.
 */
import { h, mount } from '../dom.js';
import { Button, StatCard, PageHeader, Notice } from '../components/basics.js';
import { openModal, toast } from '../components/Modal.js';
import { openCreateDialog } from '../components/recordDialog.js';
import { WIDGETS, activeWidgets, widgetById, DEFAULT_WIDGETS } from './widgets.js';
import { dashboardMetrics } from '../../domain/metrics.js';
import { formatMoney, monthLabel, monthKey } from '../../core/format.js';

export function renderDashboard(ctx) {
  const { store, navigate } = ctx;
  const m = dashboardMetrics(store);
  const basisHint = store.settings.revenueBasis === 'orders'
    ? 'Basis: abgeschlossene Aufträge'
    : 'Basis: bezahlte Rechnungen';

  /* ------------------------------------------------------- Kennzahlen -- */

  const stats = h('div.stat-row.stat-row-9', null,
    StatCard({
      label: 'Aktuelle Aufträge',
      value: m.orders.active,
      hint: 'Angenommen · In Bearbeitung · Wartet auf Kunde',
      tone: 'progress',
      iconName: 'briefcase',
      onClick: () => navigate('auftraege'),
    }),
    StatCard({
      label: 'Offene Aufträge',
      value: m.orders.open,
      hint: 'Anfrage · Angebot',
      tone: 'warn',
      iconName: 'briefcase',
      onClick: () => navigate('auftraege'),
    }),
    StatCard({
      label: 'Abgeschlossene Aufträge',
      value: m.orders.done,
      tone: 'success',
      iconName: 'check',
      onClick: () => navigate('auftraege'),
    }),
    StatCard({
      label: 'Umsatz dieses Monats',
      value: m.revenue.month,
      format: 'money',
      hint: monthLabel(monthKey(m.today)),
      tone: 'success',
      iconName: 'euro',
      delta: deltaFor(m.revenue.month, m.revenue.lastMonth, 'Vormonat'),
      onClick: () => navigate('finanzen'),
    }),
    StatCard({
      label: 'Umsatz dieses Jahres',
      value: m.revenue.year,
      format: 'money',
      hint: String(new Date().getFullYear()),
      tone: 'success',
      iconName: 'euro',
      delta: deltaFor(m.revenue.year, m.revenue.lastYear, 'Vorjahr'),
      onClick: () => navigate('finanzen'),
    }),
    StatCard({
      label: 'Gesamtumsatz',
      value: m.revenue.total,
      format: 'money',
      hint: basisHint,
      tone: 'success',
      iconName: 'euro',
      onClick: () => navigate('finanzen'),
    }),
    StatCard({
      label: 'Offene Rechnungen',
      value: m.invoices.outstanding.count,
      hint: `${m.invoices.open.count} offen · ${m.invoices.overdue.count} überfällig`,
      tone: m.invoices.overdue.count > 0 ? 'danger' : 'warn',
      iconName: 'invoice',
      onClick: () => navigate('rechnungen'),
    }),
    StatCard({
      label: 'Bereits bezahlte Rechnungen',
      value: m.invoices.paid.count,
      hint: formatMoney(m.invoices.paid.amount),
      tone: 'success',
      iconName: 'check',
      onClick: () => navigate('rechnungen'),
    }),
    StatCard({
      label: 'Ausstehender Betrag',
      value: m.invoices.outstanding.amount,
      format: 'money',
      hint: m.invoices.overdue.amount > 0
        ? `davon ${formatMoney(m.invoices.overdue.amount)} überfällig`
        : 'nichts überfällig',
      tone: m.invoices.outstanding.amount > 0 ? 'warn' : 'success',
      iconName: 'euro',
      onClick: () => navigate('rechnungen'),
    }));

  /* ----------------------------------------------------------- Widgets -- */

  const grid = h('div.widget-grid');
  const ids = activeWidgets(store.settings);
  for (const id of ids) {
    const widget = widgetById(id);
    if (!widget) continue;
    try {
      grid.appendChild(h('div', { class: `widget widget-${widget.size || 'normal'}` }, widget.render(ctx)));
    } catch (err) {
      // Ein defektes Widget darf nie das ganze Dashboard leeren.
      console.error(`[bizdash] Widget "${id}" konnte nicht gezeichnet werden`, err);
      grid.appendChild(h('div.widget', null,
        Notice(`Widget „${widget.title}" konnte nicht geladen werden.`, 'danger')));
    }
  }

  const emptyHint = store.all('customers').length === 0 && store.all('orders').length === 0
    ? Notice(
      'Noch keine Daten vorhanden. Legen Sie einen Kunden an oder laden Sie in den Einstellungen Demodaten, um die Ansichten zu sehen.',
      'info',
      Button('Zu den Einstellungen', { variant: 'ghost', size: 'sm', onClick: () => navigate('einstellungen') }),
    )
    : null;

  return h('div.view', null,
    PageHeader({
      title: store.settings.companyName || 'Dashboard',
      subtitle: `Stand ${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`,
      actions: [
        Button('Widgets', { variant: 'secondary', iconName: 'grid', onClick: () => openWidgetManager(ctx) }),
        Button('Neu', { variant: 'primary', iconName: 'plus', onClick: () => openQuickCreate(ctx) }),
      ],
    }),
    emptyHint,
    stats,
    grid);
}

/** Veränderung gegenüber der Vorperiode – nur wenn es einen Vergleich gibt. */
function deltaFor(current, previous, label) {
  if (!previous) return null;
  const diff = current - previous;
  if (diff === 0) return { direction: 'flat', text: `unverändert zum ${label}` };
  const pct = Math.round((diff / previous) * 100);
  return {
    direction: diff > 0 ? 'up' : 'down',
    text: `${diff > 0 ? '+' : ''}${pct} % zum ${label}`,
  };
}

/* --------------------------------------------------- Schnell anlegen -- */

function openQuickCreate(ctx) {
  const items = [
    { key: 'orders', label: 'Auftrag', iconName: 'briefcase' },
    { key: 'customers', label: 'Kunde', iconName: 'users' },
    { key: 'invoices', label: 'Rechnung', iconName: 'invoice' },
    { key: 'tasks', label: 'Aufgabe', iconName: 'checklist' },
    { key: 'projects', label: 'Projekt', iconName: 'folder' },
    { key: 'websites', label: 'Website', iconName: 'globe' },
    { key: 'references', label: 'Inspiration', iconName: 'sparkle' },
  ];

  const modal = openModal({
    title: 'Neu anlegen',
    content: h('div.quick-grid', null, ...items.map((item) => h('button.quick-item', {
      type: 'button',
      onClick: () => {
        modal.close();
        openCreateDialog({ store: ctx.store, entityKey: item.key });
      },
    }, item.label))),
  });
}

/* ------------------------------------------------- Widget-Verwaltung -- */

/**
 * Widgets an- und abwählen sowie umsortieren.
 * Auf/Ab statt Drag & Drop: Ziehen ist auf einem Touchscreen im scrollenden
 * Dialog unzuverlässig, zwei Buttons sind es nicht.
 */
function openWidgetManager(ctx) {
  const { store } = ctx;
  let selection = [...activeWidgets(store.settings)];

  const list = h('ul.widget-manager');

  function draw() {
    const ordered = [
      ...selection.map((id) => ({ widget: widgetById(id), on: true })),
      ...WIDGETS.filter((w) => !selection.includes(w.id)).map((widget) => ({ widget, on: false })),
    ].filter((row) => row.widget);

    mount(list, ...ordered.map(({ widget, on }, index) => h('li.widget-manager-row', null,
      h('label.widget-manager-label', null,
        h('input', {
          type: 'checkbox',
          checked: on,
          class: 'checkbox',
          onChange: (e) => {
            selection = e.target.checked
              ? [...selection, widget.id]
              : selection.filter((id) => id !== widget.id);
            draw();
          },
        }),
        h('span', null, widget.title)),
      on
        ? h('span.widget-manager-actions', null,
          Button('Nach oben', {
            iconName: 'chevronRight', iconOnly: true, size: 'sm', variant: 'ghost',
            disabled: index === 0,
            onClick: () => {
              const i = selection.indexOf(widget.id);
              if (i > 0) {
                [selection[i - 1], selection[i]] = [selection[i], selection[i - 1]];
                draw();
              }
            },
          }),
          Button('Nach unten', {
            iconName: 'chevronDown', iconOnly: true, size: 'sm', variant: 'ghost',
            disabled: index >= selection.length - 1,
            onClick: () => {
              const i = selection.indexOf(widget.id);
              if (i > -1 && i < selection.length - 1) {
                [selection[i + 1], selection[i]] = [selection[i], selection[i + 1]];
                draw();
              }
            },
          }))
        : null)));
  }
  draw();

  const modal = openModal({
    title: 'Dashboard-Widgets',
    size: 'lg',
    content: [
      h('p.modal-text', null, 'Aktive Widgets stehen oben in der gewählten Reihenfolge. Die Auswahl wird gespeichert.'),
      list,
    ],
    footer: [
      Button('Standard wiederherstellen', {
        variant: 'ghost',
        onClick: () => {
          selection = [...DEFAULT_WIDGETS];
          draw();
        },
      }),
      Button('Abbrechen', { variant: 'secondary', onClick: () => modal.close() }),
      Button('Speichern', {
        variant: 'primary',
        onClick: async () => {
          await store.saveSettings({ widgets: selection });
          modal.close();
          toast('Widget-Auswahl gespeichert.');
        },
      }),
    ],
  });
  return modal;
}
