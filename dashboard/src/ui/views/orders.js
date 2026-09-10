/**
 * Aufträge.
 *
 * Filter und Sortierung decken die typischen Fragen ab, etwa
 * „Zeige mir alle Aufträge, die aktuell in Bearbeitung sind" – Statusfilter auf
 * „In Bearbeitung", der Rest bleibt stehen.
 */
import { h } from '../dom.js';
import { Button, Card, StatCard } from '../components/basics.js';
import { Table, rowActionButtons } from '../components/Table.js';
import { toast } from '../components/Modal.js';
import { openCreateDialog, openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, selectFilter, refFilter, moneyCell, dateCell, statusCell, refCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { orderCounts } from '../../domain/metrics.js';
import { ORDER_GROUPS, INVOICE_GROUPS, ORDER_STATUS, optionLabel } from '../../data/schema.js';
import { formatMoney } from '../../core/format.js';
import { sum, sortBy } from '../../core/util.js';

export function renderOrders(ctx) {
  const { store, navigate } = ctx;
  const counts = orderCounts(store);

  const summary = h('div.stat-row.stat-row-compact', null,
    StatCard({ label: 'Aktuelle Aufträge', value: counts.active, hint: 'Angenommen, in Bearbeitung, wartet auf Kunde', tone: 'progress' }),
    StatCard({ label: 'Offene Aufträge', value: counts.open, hint: 'Anfrage und Angebot', tone: 'warn' }),
    StatCard({ label: 'Abgeschlossen', value: counts.done, tone: 'success' }),
    StatCard({ label: 'Wert in Arbeit', value: counts.activeValue, format: 'money', hint: 'Summe der aktuellen Aufträge' }));

  return createListView({
    ctx,
    entityKey: 'orders',
    subtitle: `${counts.total} Aufträge · ${formatMoney(counts.activeValue + counts.openValue)} in Anbahnung und Arbeit`,
    above: summary,
    columns: [
      {
        key: 'title',
        label: 'Projektname',
        primary: true,
        sortable: true,
        render: (o) => h('span.cell-strong', null, o.title || '(ohne Titel)'),
      },
      {
        key: 'customerId',
        label: 'Kunde',
        sortable: true,
        value: (o) => store.titleOf('customers', o.customerId),
        render: (o) => refCell(store, 'customers', o.customerId, (id) => navigate('kunden', id)),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (o) => statusCell('orders', 'status', o.status),
      },
      {
        key: 'paymentStatus',
        label: 'Zahlung',
        sortable: true,
        hideOn: 'narrow',
        render: (o) => statusCell('orders', 'paymentStatus', o.paymentStatus),
      },
      {
        key: 'value',
        label: 'Auftragswert',
        align: 'right',
        sortable: true,
        value: (o) => Number(o.value) || 0,
        render: (o) => moneyCell(o.value),
      },
      {
        key: 'deadline',
        label: 'Deadline',
        sortable: true,
        render: (o) => (ORDER_GROUPS.done.includes(o.status) || ORDER_GROUPS.cancelled.includes(o.status)
          ? dateCell(o.deadline)
          : dateCell(o.deadline, { warnPast: true })),
      },
      {
        key: 'orderDate',
        label: 'Erstellt',
        sortable: true,
        hideOn: 'narrow',
        render: (o) => dateCell(o.orderDate),
      },
    ],
    filters: [
      selectFilter('orders', 'status'),
      selectFilter('orders', 'paymentStatus', 'Zahlung'),
      refFilter(store, 'orders', 'customerId'),
    ],
    sorts: [
      { value: 'orderDate', label: 'Erstellungsdatum' },
      { value: 'deadline', label: 'Deadline' },
      { value: 'value', label: 'Auftragswert' },
      { value: 'title', label: 'Projektname' },
      { value: 'customerId', label: 'Kunde' },
      { value: 'status', label: 'Status' },
    ],
    onRowClick: (o) => navigate('auftraege', o._id),
  });
}

/* ------------------------------------------------------------- Detail -- */

/**
 * Auftragsdetail mit den zugehörigen Rechnungen und einem Abgleich zwischen
 * Auftragswert und tatsächlich gestellten bzw. bezahlten Beträgen. Genau dieser
 * Abgleich zeigt, ob noch etwas zu berechnen ist.
 */
export function renderOrderDetail(ctx, id) {
  const { store, navigate } = ctx;
  const order = store.byId('orders', id);
  if (!order) return createDetailView({ ctx, entityKey: 'orders', id });

  const invoices = store.all('invoices').filter((i) => i.orderId === id);
  const invoiced = sum(invoices.filter((i) => i.status !== 'storniert'), (i) => Number(i.amount) || 0);
  const paid = sum(invoices.filter((i) => INVOICE_GROUPS.paid.includes(i.status)), (i) => Number(i.amount) || 0);
  const outstanding = sum(
    invoices.filter((i) => INVOICE_GROUPS.outstanding.includes(i.status)),
    (i) => Number(i.amount) || 0,
  );
  const value = Number(order.value) || 0;
  const notInvoiced = Math.max(0, value - invoiced);

  const stats = h('div.stat-row', null,
    StatCard({ label: 'Auftragswert', value, format: 'money' }),
    StatCard({ label: 'Berechnet', value: invoiced, format: 'money', hint: `${invoices.length} Rechnungen` }),
    StatCard({ label: 'Bezahlt', value: paid, format: 'money', tone: 'success' }),
    StatCard({
      label: 'Noch offen',
      value: outstanding,
      format: 'money',
      tone: outstanding > 0 ? 'warn' : 'neutral',
      hint: notInvoiced > 0 ? `${formatMoney(notInvoiced)} noch nicht berechnet` : null,
    }));

  const invoicesCard = Card({
    title: 'Rechnungen zu diesem Auftrag',
    actions: Button('Rechnung anlegen', {
      variant: 'secondary',
      size: 'sm',
      iconName: 'plus',
      onClick: () => openCreateDialog({
        store,
        entityKey: 'invoices',
        preset: { customerId: order.customerId, orderId: id, amount: notInvoiced || value },
      }),
    }),
    padded: invoices.length === 0,
    children: invoices.length
      ? Table({
        rows: sortBy(invoices, (i) => i.issueDate || i._createdAt, -1),
        onRowClick: (i) => navigate('rechnungen', i._id),
        columns: [
          { key: 'number', label: 'Nummer', primary: true, render: (i) => h('span.cell-strong', null, i.number) },
          { key: 'status', label: 'Status', render: (i) => statusCell('invoices', 'status', i.status) },
          { key: 'amount', label: 'Betrag', align: 'right', render: (i) => moneyCell(i.amount) },
          { key: 'dueDate', label: 'Fällig', render: (i) => dateCell(i.dueDate, { warnPast: true }) },
        ],
        rowActions: (i) => rowActionButtons({
          onEdit: () => openEditDialog({ store, entityKey: 'invoices', id: i._id }),
          onDelete: () => confirmDelete({ store, entityKey: 'invoices', id: i._id }),
        }),
      })
      : h('p.muted', null, 'Für diesen Auftrag wurde noch keine Rechnung erfasst.'),
  });

  const websites = store.all('websites').filter((w) => w.customerId === order.customerId);
  const websitesCard = websites.length
    ? Card({
      title: 'Websites des Kunden',
      children: h('ul.mini-list', null, ...websites.map((w) => h('li.mini-item', null,
        h('button.cell-link', { type: 'button', onClick: () => navigate('websites', w._id) }, w.title),
        statusCell('websites', 'status', w.status)))),
    })
    : null;

  const nextStatus = {
    anfrage: 'angebot',
    angebot: 'angenommen',
    angenommen: 'in_bearbeitung',
    in_bearbeitung: 'abgeschlossen',
    wartet_kunde: 'in_bearbeitung',
  }[order.status];

  const advance = nextStatus
    ? Button(`Auf „${optionLabel(ORDER_STATUS, nextStatus)}" setzen`, {
      variant: 'primary',
      iconName: 'check',
      onClick: async () => {
        const res = await store.patch('orders', id, { status: nextStatus });
        if (res.ok) toast(`Status auf „${optionLabel(ORDER_STATUS, nextStatus)}" gesetzt.`);
        else toast(res.errors?._ || 'Status konnte nicht geändert werden.', 'danger');
      },
    })
    : null;

  return createDetailView({
    ctx,
    entityKey: 'orders',
    id,
    subtitle: store.titleOf('customers', order.customerId),
    stats,
    headerExtras: [advance].filter(Boolean),
    sections: [invoicesCard],
    aside: [websitesCard].filter(Boolean),
  });
}
