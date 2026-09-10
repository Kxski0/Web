/**
 * Rechnungen und Zahlungen.
 *
 * Der Kopf zeigt sofort, wie viel Geld offen ist und wie viel eingegangen –
 * das ist die zentrale Frage aus der Anforderung. Überfällige Rechnungen werden
 * beim Laden automatisch markiert (siehe store.syncOverdueInvoices).
 */
import { h } from '../dom.js';
import { Button, Card, StatCard } from '../components/basics.js';
import { SplitBar } from '../components/Chart.js';
import { createListView, selectFilter, refFilter, moneyCell, dateCell, statusCell, refCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { invoiceTotals } from '../../domain/metrics.js';
import { INVOICE_GROUPS } from '../../data/schema.js';
import { formatMoney, daysUntil } from '../../core/format.js';
import { toast } from '../components/Modal.js';

export function renderInvoices(ctx) {
  const { store, navigate } = ctx;
  const totals = invoiceTotals(store);

  const summary = h('div.stat-row', null,
    StatCard({
      label: 'Ausstehender Betrag',
      value: totals.outstanding.amount,
      format: 'money',
      tone: totals.outstanding.amount > 0 ? 'warn' : 'success',
      hint: `${totals.open.count} offen · ${totals.overdue.count} überfällig`,
    }),
    StatCard({
      label: 'Davon überfällig',
      value: totals.overdue.amount,
      format: 'money',
      tone: totals.overdue.amount > 0 ? 'danger' : 'neutral',
      hint: `${totals.overdue.count} Belege`,
    }),
    StatCard({
      label: 'Bereits bezahlt',
      value: totals.paid.amount,
      format: 'money',
      tone: 'success',
      hint: `${totals.paid.count} Belege`,
    }),
    StatCard({
      label: 'Entwürfe',
      value: totals.draft.amount,
      format: 'money',
      hint: `${totals.draft.count} noch nicht versendet`,
    }));

  const split = (totals.paid.amount + totals.outstanding.amount) > 0
    ? Card({
      title: 'Zahlungsstand gesamt',
      children: SplitBar([
        { label: 'Bezahlt', value: totals.paid.amount, tone: 'success' },
        { label: 'Offen', value: totals.open.amount, tone: 'warn' },
        { label: 'Überfällig', value: totals.overdue.amount, tone: 'danger' },
      ], { label: 'Zahlungsstand' }),
    })
    : null;

  return createListView({
    ctx,
    entityKey: 'invoices',
    subtitle: `${formatMoney(totals.outstanding.amount)} offen · ${formatMoney(totals.paid.amount)} bezahlt`,
    above: h('div', null, summary, split),
    columns: [
      {
        key: 'number',
        label: 'Nummer',
        primary: true,
        sortable: true,
        render: (i) => h('span.cell-strong', null, i.number),
      },
      {
        key: 'customerId',
        label: 'Kunde',
        sortable: true,
        value: (i) => store.titleOf('customers', i.customerId),
        render: (i) => refCell(store, 'customers', i.customerId, (id) => navigate('kunden', id)),
      },
      {
        key: 'orderId',
        label: 'Auftrag',
        sortable: true,
        hideOn: 'narrow',
        value: (i) => store.titleOf('orders', i.orderId),
        render: (i) => refCell(store, 'orders', i.orderId, (id) => navigate('auftraege', id)),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (i) => statusCell('invoices', 'status', i.status),
      },
      {
        key: 'amount',
        label: 'Betrag',
        align: 'right',
        sortable: true,
        value: (i) => Number(i.amount) || 0,
        render: (i) => moneyCell(i.amount),
      },
      {
        key: 'issueDate',
        label: 'Rechnungsdatum',
        sortable: true,
        hideOn: 'narrow',
        render: (i) => dateCell(i.issueDate),
      },
      {
        key: 'dueDate',
        label: 'Fällig',
        sortable: true,
        render: (i) => (INVOICE_GROUPS.outstanding.includes(i.status)
          ? dateCell(i.dueDate, { warnPast: true })
          : dateCell(i.dueDate)),
      },
    ],
    filters: [
      selectFilter('invoices', 'status'),
      refFilter(store, 'invoices', 'customerId'),
      {
        name: 'bucket',
        label: 'Zeitraum',
        options: [
          { value: 'outstanding', label: 'Nur offene' },
          { value: 'overdue', label: 'Nur überfällige' },
          { value: 'paid', label: 'Nur bezahlte' },
          { value: 'thisYear', label: 'Dieses Jahr' },
        ],
        test: (row, value) => {
          if (value === 'outstanding') return INVOICE_GROUPS.outstanding.includes(row.status);
          if (value === 'overdue') return row.status === 'ueberfaellig';
          if (value === 'paid') return INVOICE_GROUPS.paid.includes(row.status);
          if (value === 'thisYear') return String(row.issueDate || '').startsWith(String(new Date().getFullYear()));
          return true;
        },
      },
    ],
    sorts: [
      { value: 'issueDate', label: 'Rechnungsdatum' },
      { value: 'dueDate', label: 'Fälligkeit' },
      { value: 'amount', label: 'Betrag' },
      { value: 'number', label: 'Nummer' },
      { value: 'status', label: 'Status' },
      { value: 'customerId', label: 'Kunde' },
    ],
    onRowClick: (i) => navigate('rechnungen', i._id),
  });
}

/* ------------------------------------------------------------- Detail -- */

export function renderInvoiceDetail(ctx, id) {
  const { store, navigate } = ctx;
  const invoice = store.byId('invoices', id);
  if (!invoice) return createDetailView({ ctx, entityKey: 'invoices', id });

  const left = daysUntil(invoice.dueDate);
  const isOutstanding = INVOICE_GROUPS.outstanding.includes(invoice.status);

  const markPaid = isOutstanding
    ? Button('Als bezahlt markieren', {
      variant: 'primary',
      iconName: 'check',
      onClick: async () => {
        const res = await store.patch('invoices', id, { status: 'bezahlt' });
        if (res.ok) toast(`Rechnung ${invoice.number} als bezahlt markiert.`);
        else toast(res.errors?._ || 'Konnte nicht gespeichert werden.', 'danger');
      },
    })
    : null;

  const reopen = invoice.status === 'bezahlt'
    ? Button('Zahlung zurücknehmen', {
      variant: 'ghost',
      iconName: 'refresh',
      onClick: async () => {
        const res = await store.patch('invoices', id, { status: 'offen' });
        if (res.ok) toast('Rechnung wieder als offen geführt.');
      },
    })
    : null;

  const stats = h('div.stat-row', null,
    StatCard({ label: 'Betrag', value: invoice.amount, format: 'money' }),
    StatCard({
      label: 'Status',
      value: '',
      format: 'raw',
      hint: isOutstanding && left !== null
        ? (left < 0 ? `${Math.abs(left)} Tage überfällig` : `fällig in ${left} Tagen`)
        : null,
    }),
    StatCard({ label: 'Kunde', value: store.titleOf('customers', invoice.customerId) || '—', format: 'raw' }));
  // Statuskachel bekommt die Badge statt einer Zahl.
  const statusSlot = stats.children[1].querySelector('.stat-value');
  if (statusSlot) {
    statusSlot.textContent = '';
    statusSlot.appendChild(statusCell('invoices', 'status', invoice.status));
  }

  const orderCard = invoice.orderId && store.byId('orders', invoice.orderId)
    ? Card({
      title: 'Zugehöriger Auftrag',
      children: h('div.mini-item', null,
        h('button.cell-link', {
          type: 'button',
          onClick: () => navigate('auftraege', invoice.orderId),
        }, store.titleOf('orders', invoice.orderId)),
        statusCell('orders', 'status', store.byId('orders', invoice.orderId).status)),
    })
    : null;

  return createDetailView({
    ctx,
    entityKey: 'invoices',
    id,
    subtitle: store.titleOf('customers', invoice.customerId),
    stats,
    headerExtras: [markPaid, reopen].filter(Boolean),
    aside: [orderCard].filter(Boolean),
  });
}
