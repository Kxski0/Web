/**
 * Dashboard-Widgets.
 *
 * Jedes Widget ist ein Eintrag in dieser Registrierung mit `id`, Titel, Größe
 * und einer `render(ctx)`-Funktion. Das Dashboard zeichnet nur, was in den
 * Einstellungen aktiviert ist – hinzufügen, entfernen und umsortieren passiert
 * in der Widget-Verwaltung, ohne Codeänderung.
 */
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { Button, Card, StatusBadge, EmptyState } from '../components/basics.js';
import { RevenueChart, BarList, SplitBar } from '../components/Chart.js';
import { statusCell } from './listView.js';
import {
  revenueSeries, ordersByStatus, invoiceTotals, revenueByCustomer,
  openTasks, upcomingDeadlines, recent, recentlyCompletedOrders,
} from '../../domain/metrics.js';
import { formatMoney, formatDate, formatRelative, daysUntil } from '../../core/format.js';
import { hostOf, sum } from '../../core/util.js';
import { INVOICE_GROUPS } from '../../data/schema.js';

/** Kompakte Zeile: Titel links, Zusatz rechts, ganze Zeile antippbar. */
function listRow(label, meta, onClick, extra = null) {
  const content = [
    h('span.row-label', null, label),
    extra,
    meta ? h('span.row-meta', null, meta) : null,
  ].filter(Boolean);
  return h('li.mini-row', null,
    onClick
      ? h('button.mini-row-btn', { type: 'button', onClick }, ...content)
      : h('div.mini-row-btn', null, ...content));
}

function moreButton(label, onClick) {
  return Button(label, { variant: 'ghost', size: 'sm', iconName: 'chevronRight', onClick });
}

export const WIDGETS = [
  {
    id: 'revenueChart',
    title: 'Umsatzentwicklung',
    size: 'wide',
    render: (ctx) => {
      const series = revenueSeries(ctx.store, 12);
      const total = sum(series, (s) => s.value);
      return Card({
        title: 'Umsatzentwicklung',
        subtitle: `Letzte 12 Monate · ${formatMoney(total)} gesamt`,
        actions: moreButton('Finanzen', () => ctx.navigate('finanzen')),
        children: total > 0
          ? RevenueChart(series)
          : EmptyState({
            iconName: 'euro',
            title: 'Noch kein Umsatz erfasst',
            text: ctx.store.settings.revenueBasis === 'orders'
              ? 'Sobald ein Auftrag auf „Abgeschlossen" steht, erscheint er hier.'
              : 'Sobald eine Rechnung auf „Bezahlt" steht, erscheint sie hier.',
          }),
      });
    },
  },

  {
    id: 'ordersByStatus',
    title: 'Aufträge nach Status',
    size: 'normal',
    render: (ctx) => {
      const rows = ordersByStatus(ctx.store).filter((r) => r.count > 0);
      return Card({
        title: 'Aufträge nach Status',
        subtitle: `${ctx.store.all('orders').length} Aufträge insgesamt`,
        actions: moreButton('Aufträge', () => ctx.navigate('auftraege')),
        children: rows.length
          ? BarList(rows.map((r) => ({
            label: r.label,
            value: r.count,
            tone: r.tone,
            meta: formatMoney(r.amount),
          })), {
            onClick: (row) => {
              // Auftragsliste oeffnen und direkt auf diesen Status filtern.
              const match = rows.find((r) => r.label === row.label);
              if (!match) return;
              ctx.setViewState('orders', { status: match.value });
              ctx.navigate('auftraege');
            },
          })
          : EmptyState({ iconName: 'briefcase', title: 'Noch keine Aufträge' }),
      });
    },
  },

  {
    id: 'invoices',
    title: 'Offene Rechnungen',
    size: 'normal',
    render: (ctx) => {
      const totals = invoiceTotals(ctx.store);
      const openInvoices = ctx.store.all('invoices')
        .filter((i) => INVOICE_GROUPS.outstanding.includes(i.status))
        .sort((a, b) => String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999')))
        .slice(0, 5);

      return Card({
        title: 'Offene Rechnungen',
        subtitle: `${formatMoney(totals.outstanding.amount)} ausstehend`,
        actions: moreButton('Alle', () => ctx.navigate('rechnungen')),
        children: [
          SplitBar([
            { label: 'Bezahlt', value: totals.paid.amount, tone: 'success' },
            { label: 'Offen', value: totals.open.amount, tone: 'warn' },
            { label: 'Überfällig', value: totals.overdue.amount, tone: 'danger' },
          ]),
          openInvoices.length
            ? h('ul.mini-list', null, ...openInvoices.map((i) => {
              const left = daysUntil(i.dueDate);
              return listRow(
                `${i.number} · ${ctx.store.titleOf('customers', i.customerId) || 'ohne Kunde'}`,
                formatMoney(i.amount),
                () => ctx.navigate('rechnungen', i._id),
                left !== null && left < 0
                  ? StatusBadge(`${Math.abs(left)} T. überfällig`, 'danger')
                  : left !== null && left <= 7 ? StatusBadge(`in ${left} T.`, 'warn') : null,
              );
            }))
            : h('p.muted.card-note', null, 'Keine offenen Rechnungen. '),
        ],
      });
    },
  },

  {
    id: 'tasks',
    title: 'Wichtigste Aufgaben',
    size: 'normal',
    render: (ctx) => {
      const tasks = openTasks(ctx.store).slice(0, 6);
      return Card({
        title: 'Wichtigste offene Aufgaben',
        subtitle: `${openTasks(ctx.store).length} offen`,
        actions: moreButton('Aufgaben', () => ctx.navigate('aufgaben')),
        children: tasks.length
          ? h('ul.mini-list', null, ...tasks.map((t) => h('li.mini-row', null,
            h('div.mini-row-btn', null,
              h('button.task-check', {
                type: 'button',
                'aria-label': `„${t.title}" als erledigt markieren`,
                title: 'Als erledigt markieren',
                onClick: () => ctx.store.patch('tasks', t._id, { status: 'erledigt' }),
              }, icon('check', { size: 14 })),
              h('button.row-label.row-label-btn', {
                type: 'button',
                onClick: () => ctx.navigate('aufgaben', t._id),
              }, t.title),
              statusCell('tasks', 'priority', t.priority),
              t.deadline ? h('span.row-meta', null, formatDate(t.deadline)) : null))))
          : EmptyState({ iconName: 'check', title: 'Nichts offen', text: 'Alle Aufgaben sind erledigt.' }),
      });
    },
  },

  {
    id: 'deadlines',
    title: 'Nächste Termine',
    size: 'normal',
    render: (ctx) => {
      const items = upcomingDeadlines(ctx.store, { days: 45, limit: 7 });
      const routes = { orders: 'auftraege', projects: 'projekte', tasks: 'aufgaben', invoices: 'rechnungen' };
      const labels = { orders: 'Auftrag', projects: 'Projekt', tasks: 'Aufgabe', invoices: 'Rechnung' };
      return Card({
        title: 'Nächste Termine',
        subtitle: 'Nächste 45 Tage',
        children: items.length
          ? h('ul.mini-list', null, ...items.map((it) => listRow(
            it.title,
            it.daysLeft < 0 ? `${Math.abs(it.daysLeft)} T. überfällig` : `${formatDate(it.day)}`,
            () => ctx.navigate(routes[it.entityKey], it.id),
            StatusBadge(labels[it.entityKey], it.daysLeft < 0 ? 'danger' : it.daysLeft <= 7 ? 'warn' : 'neutral'),
          )))
          : EmptyState({ iconName: 'calendar', title: 'Keine Termine', text: 'In den nächsten 45 Tagen steht nichts an.' }),
      });
    },
  },

  {
    id: 'activity',
    title: 'Letzte Aktivitäten',
    size: 'normal',
    render: (ctx) => {
      const rows = ctx.store.activity().slice(0, 8);
      return Card({
        title: 'Letzte Aktivitäten',
        actions: moreButton('Verlauf', () => ctx.navigate('aktivitaet')),
        children: rows.length
          ? h('ul.activity-list', null, ...rows.map((a) => h('li.activity-item', null,
            h('span', { class: `activity-dot action-${a.action}`, 'aria-hidden': 'true' }),
            h('span.activity-text', null, a.text),
            h('span.activity-time', null, formatRelative(a.at)))))
          : h('p.muted.card-note', null, 'Noch keine Aktivitäten aufgezeichnet.'),
      });
    },
  },

  {
    id: 'recentCustomers',
    title: 'Zuletzt hinzugefügte Kunden',
    size: 'normal',
    render: (ctx) => {
      const rows = recent(ctx.store, 'customers', 5);
      return Card({
        title: 'Zuletzt hinzugefügte Kunden',
        actions: moreButton('Kunden', () => ctx.navigate('kunden')),
        children: rows.length
          ? h('ul.mini-list', null, ...rows.map((c) => listRow(
            c.company,
            formatRelative(c._createdAt),
            () => ctx.navigate('kunden', c._id),
          )))
          : h('p.muted.card-note', null, 'Noch keine Kunden erfasst.'),
      });
    },
  },

  {
    id: 'recentCompleted',
    title: 'Zuletzt abgeschlossene Aufträge',
    size: 'normal',
    render: (ctx) => {
      const rows = recentlyCompletedOrders(ctx.store, 5);
      return Card({
        title: 'Zuletzt abgeschlossene Aufträge',
        actions: moreButton('Aufträge', () => ctx.navigate('auftraege')),
        children: rows.length
          ? h('ul.mini-list', null, ...rows.map((o) => listRow(
            o.title,
            formatMoney(o.value),
            () => ctx.navigate('auftraege', o._id),
            h('span.row-sub', null, ctx.store.titleOf('customers', o.customerId)),
          )))
          : h('p.muted.card-note', null, 'Noch kein Auftrag abgeschlossen.'),
      });
    },
  },

  {
    id: 'recentInvoices',
    title: 'Zuletzt erstellte Rechnungen',
    size: 'normal',
    render: (ctx) => {
      const rows = recent(ctx.store, 'invoices', 5);
      return Card({
        title: 'Zuletzt erstellte Rechnungen',
        actions: moreButton('Rechnungen', () => ctx.navigate('rechnungen')),
        children: rows.length
          ? h('ul.mini-list', null, ...rows.map((i) => listRow(
            `${i.number} · ${formatMoney(i.amount)}`,
            formatDate(i.issueDate),
            () => ctx.navigate('rechnungen', i._id),
            statusCell('invoices', 'status', i.status),
          )))
          : h('p.muted.card-note', null, 'Noch keine Rechnungen erfasst.'),
      });
    },
  },

  {
    id: 'topCustomers',
    title: 'Umsatz pro Kunde',
    size: 'normal',
    render: (ctx) => {
      const rows = revenueByCustomer(ctx.store).slice(0, 6);
      return Card({
        title: 'Umsatz pro Kunde',
        subtitle: 'Gesamtzeitraum',
        actions: moreButton('Finanzen', () => ctx.navigate('finanzen')),
        children: BarList(
          rows.map((r) => ({ label: r.label, value: r.amount, tone: 'success' })),
          { format: 'money', emptyText: 'Noch kein Umsatz erfasst.', onClick: (row) => {
            const hit = rows.find((r) => r.label === row.label);
            if (hit && hit.id) ctx.navigate('kunden', hit.id);
          } },
        ),
      });
    },
  },

  {
    id: 'websites',
    title: 'Meine Websites',
    size: 'normal',
    render: (ctx) => {
      const rows = recent(ctx.store, 'websites', 5, 'launchDate');
      return Card({
        title: 'Meine Websites',
        subtitle: `${ctx.store.all('websites').filter((w) => w.status === 'live').length} live`,
        actions: moreButton('Alle', () => ctx.navigate('websites')),
        children: rows.length
          ? h('ul.mini-list', null, ...rows.map((w) => listRow(
            w.title,
            hostOf(w.url),
            () => ctx.navigate('websites', w._id),
            statusCell('websites', 'status', w.status),
          )))
          : h('p.muted.card-note', null, 'Noch keine Websites erfasst.'),
      });
    },
  },

  {
    id: 'inspiration',
    title: 'Inspiration',
    size: 'normal',
    render: (ctx) => {
      const rows = recent(ctx.store, 'references', 5);
      return Card({
        title: 'Zuletzt gespeicherte Inspiration',
        actions: moreButton('Alle', () => ctx.navigate('inspiration')),
        children: rows.length
          ? h('ul.mini-list', null, ...rows.map((r) => listRow(
            r.name,
            hostOf(r.url),
            () => ctx.navigate('inspiration', r._id),
            statusCell('references', 'category', r.category),
          )))
          : h('p.muted.card-note', null, 'Noch keine Referenzen gespeichert.'),
      });
    },
  },
];

/** Standardbelegung des Dashboards – bewusst kompakt statt „alles an". */
export const DEFAULT_WIDGETS = [
  'revenueChart', 'invoices', 'ordersByStatus', 'tasks',
  'deadlines', 'activity', 'recentCustomers', 'recentCompleted', 'recentInvoices',
];

export function widgetById(id) {
  return WIDGETS.find((w) => w.id === id) || null;
}

/** Aktive Widget-IDs aus den Einstellungen, um unbekannte IDs bereinigt. */
export function activeWidgets(settings) {
  const configured = Array.isArray(settings.widgets) ? settings.widgets : DEFAULT_WIDGETS;
  return configured.filter((id) => widgetById(id));
}
