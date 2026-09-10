/**
 * Kunden – Liste und Detailseite.
 *
 * Die Detailseite beantwortet die vier Fragen aus der Anforderung direkt oben:
 * Umsatz mit diesem Kunden, Anzahl Aufträge, offene Rechnungen, bezahlte
 * Rechnungen. Darunter stehen die verknüpften Datensätze.
 */
import { h, externalLink } from '../dom.js';
import { icon } from '../icons.js';
import { Button, Card, StatCard, EmptyState, LinkOut } from '../components/basics.js';
import { Table, rowActionButtons } from '../components/Table.js';
import { SplitBar } from '../components/Chart.js';
import { openCreateDialog, openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, moneyCell, dateCell, statusCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { customerStats, revenueEvents } from '../../domain/metrics.js';
import { formatMoney } from '../../core/format.js';
import { sortBy } from '../../core/util.js';

/* -------------------------------------------------------------- Liste -- */

export function renderCustomers(ctx) {
  const { store, navigate } = ctx;
  const events = revenueEvents(store);
  const statsById = new Map(store.all('customers').map((c) => [c._id, customerStats(store, c._id, events)]));

  return createListView({
    ctx,
    entityKey: 'customers',
    subtitle: `${store.all('customers').length} Kunden`,
    columns: [
      {
        key: 'company',
        label: 'Firmenname',
        primary: true,
        sortable: true,
        render: (c) => h('span.cell-strong', null, c.company || '(ohne Namen)'),
      },
      { key: 'contact', label: 'Ansprechpartner', sortable: true },
      {
        key: 'email',
        label: 'Kontakt',
        hideOn: 'narrow',
        render: (c) => h('div.cell-stack', null,
          c.email ? externalLink(`mailto:${c.email}`, c.email, { class: 'cell-link' }) : null,
          c.phone ? externalLink(`tel:${String(c.phone).replace(/\s+/g, '')}`, c.phone, { class: 'cell-link' }) : null,
          !c.email && !c.phone ? h('span.muted', null, '—') : null),
      },
      { key: 'city', label: 'Ort', sortable: true, hideOn: 'narrow' },
      {
        key: 'orders',
        label: 'Aufträge',
        align: 'right',
        sortable: true,
        value: (c) => statsById.get(c._id)?.orderCount || 0,
        render: (c) => h('span.num', null, String(statsById.get(c._id)?.orderCount || 0)),
      },
      {
        key: 'revenue',
        label: 'Umsatz',
        align: 'right',
        sortable: true,
        value: (c) => statsById.get(c._id)?.revenue || 0,
        render: (c) => moneyCell(statsById.get(c._id)?.revenue || 0),
      },
      {
        key: 'outstanding',
        label: 'Offen',
        align: 'right',
        sortable: true,
        value: (c) => statsById.get(c._id)?.outstandingAmount || 0,
        render: (c) => {
          const amount = statsById.get(c._id)?.outstandingAmount || 0;
          return amount > 0
            ? h('span.num.tone-warn', null, formatMoney(amount))
            : h('span.muted', null, '—');
        },
      },
    ],
    sorts: [
      { value: 'company', label: 'Firmenname' },
      { value: 'revenue', label: 'Umsatz' },
      { value: 'outstanding', label: 'Offener Betrag' },
      { value: 'orders', label: 'Anzahl Aufträge' },
      { value: 'city', label: 'Ort' },
    ],
    onRowClick: (c) => navigate('kunden', c._id),
  });
}

/* ------------------------------------------------------------- Detail -- */

export function renderCustomerDetail(ctx, id) {
  const { store, navigate } = ctx;
  const customer = store.byId('customers', id);
  if (!customer) return createDetailView({ ctx, entityKey: 'customers', id });

  const s = customerStats(store, id);

  const stats = h('div.stat-row', null,
    StatCard({ label: 'Umsatz mit diesem Kunden', value: s.revenue, format: 'money', tone: 'success', hint: revenueHint(store) }),
    StatCard({ label: 'Aufträge', value: s.orderCount, hint: `${s.activeOrders} aktuell · ${s.doneOrders} abgeschlossen` }),
    StatCard({ label: 'Offene Rechnungen', value: s.outstandingAmount, format: 'money', tone: s.outstandingAmount > 0 ? 'warn' : 'neutral', hint: `${s.outstandingInvoices.length} Belege` }),
    StatCard({ label: 'Bezahlte Rechnungen', value: s.paidAmount, format: 'money', tone: 'success', hint: `${s.paidInvoices.length} Belege` }));

  const paymentSplit = (s.paidAmount + s.outstandingAmount) > 0
    ? Card({
      title: 'Zahlungsstand',
      children: SplitBar([
        { label: 'Bezahlt', value: s.paidAmount, tone: 'success' },
        { label: 'Offen', value: s.outstandingAmount, tone: 'warn' },
      ], { label: 'Verhältnis bezahlt zu offen' }),
    })
    : null;

  /* Verknüpfte Aufträge */
  const ordersCard = Card({
    title: 'Aufträge',
    subtitle: s.orderCount ? `${s.orderCount} Aufträge · ${formatMoney(s.orderValue)} Auftragswert` : null,
    actions: Button('Auftrag anlegen', {
      variant: 'secondary', size: 'sm', iconName: 'plus',
      onClick: () => openCreateDialog({ store, entityKey: 'orders', preset: { customerId: id } }),
    }),
    padded: false,
    children: s.orders.length
      ? Table({
        rows: sortBy(s.orders, (o) => o.orderDate || o._createdAt, -1),
        onRowClick: (o) => navigate('auftraege', o._id),
        columns: [
          { key: 'title', label: 'Projektname', primary: true, render: (o) => h('span.cell-strong', null, o.title) },
          { key: 'status', label: 'Status', render: (o) => statusCell('orders', 'status', o.status) },
          { key: 'value', label: 'Wert', align: 'right', render: (o) => moneyCell(o.value) },
          { key: 'deadline', label: 'Deadline', render: (o) => dateCell(o.deadline, { warnPast: true }) },
        ],
        rowActions: (o) => rowActionButtons({
          onEdit: () => openEditDialog({ store, entityKey: 'orders', id: o._id }),
          onDelete: () => confirmDelete({ store, entityKey: 'orders', id: o._id }),
        }),
      })
      : EmptyState({ iconName: 'briefcase', title: 'Noch keine Aufträge', text: 'Für diesen Kunden ist noch nichts erfasst.' }),
  });

  /* Rechnungen: offen und bezahlt getrennt, wie in der Anforderung */
  const invoiceTable = (rows, emptyText) => (rows.length
    ? Table({
      rows: sortBy(rows, (i) => i.issueDate || i._createdAt, -1),
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
    : h('p.muted.card-note', null, emptyText));

  const invoicesCard = Card({
    title: 'Rechnungen',
    subtitle: `${formatMoney(s.outstandingAmount)} offen · ${formatMoney(s.paidAmount)} bezahlt`,
    actions: Button('Rechnung anlegen', {
      variant: 'secondary', size: 'sm', iconName: 'plus',
      onClick: () => openCreateDialog({ store, entityKey: 'invoices', preset: { customerId: id } }),
    }),
    children: [
      h('h3.subhead', null, 'Noch offen'),
      invoiceTable(s.outstandingInvoices, 'Keine offenen Rechnungen.'),
      h('h3.subhead', null, 'Bereits bezahlt'),
      invoiceTable(s.paidInvoices, 'Noch keine bezahlten Rechnungen.'),
    ],
  });

  /* Rechte Spalte: Kontakt, Websites, Projekte */
  const contactCard = Card({
    title: 'Kontakt',
    children: h('ul.contact-list', null,
      customer.contact ? h('li', null, icon('users', { size: 16 }), h('span', null, customer.contact)) : null,
      customer.email
        ? h('li', null, icon('mail', { size: 16 }), externalLink(`mailto:${customer.email}`, customer.email, { class: 'cell-link' }))
        : null,
      customer.phone
        ? h('li', null, icon('phone', { size: 16 }), externalLink(`tel:${String(customer.phone).replace(/\s+/g, '')}`, customer.phone, { class: 'cell-link' }))
        : null,
      customer.website ? h('li', null, icon('globe', { size: 16 }), LinkOut(customer.website)) : null,
      (customer.street || customer.city)
        ? h('li', null, icon('folder', { size: 16 }),
          h('span', null, [customer.street, [customer.zip, customer.city].filter(Boolean).join(' '), customer.country].filter(Boolean).join(', ')))
        : null,
    ),
  });

  const websitesCard = s.websites.length
    ? Card({
      title: 'Websites',
      children: h('ul.mini-list', null, ...s.websites.map((w) => h('li.mini-item', null,
        h('button.cell-link', { type: 'button', onClick: () => navigate('websites', w._id) }, w.title),
        statusCell('websites', 'status', w.status)))),
    })
    : null;

  const projectsCard = s.projects.length
    ? Card({
      title: 'Projekte',
      children: h('ul.mini-list', null, ...s.projects.map((p) => h('li.mini-item', null,
        h('button.cell-link', { type: 'button', onClick: () => navigate('projekte', p._id) }, p.title),
        statusCell('projects', 'status', p.status)))),
    })
    : null;

  return createDetailView({
    ctx,
    entityKey: 'customers',
    id,
    subtitle: [customer.contact, customer.city].filter(Boolean).join(' · '),
    stats,
    skipFields: ['company', 'contact', 'email', 'phone', 'website', 'street', 'zip', 'city', 'country'],
    sections: [paymentSplit, ordersCard, invoicesCard].filter(Boolean),
    aside: [contactCard, websitesCard, projectsCard].filter(Boolean),
  });
}

function revenueHint(store) {
  return store.settings.revenueBasis === 'orders'
    ? 'Summe abgeschlossener Aufträge'
    : 'Summe bezahlter Rechnungen';
}
