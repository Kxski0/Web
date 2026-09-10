/**
 * Alle Geschäftsberechnungen.
 *
 * Kein UI-Code – Ansichten rufen diese Funktionen auf und stellen das Ergebnis
 * nur noch dar. So gibt es genau eine Stelle, an der „Umsatz" definiert ist.
 *
 * Umsatzbasis (Einstellung `revenueBasis`):
 *   invoices – Summe der bezahlten Rechnungen, datiert auf das Zahlungsdatum.
 *              Das ist tatsächlich eingegangenes Geld und der Standard.
 *   orders   – Summe der abgeschlossenen Aufträge, datiert auf die Deadline
 *              bzw. das Erstellungsdatum. Sinnvoll, wenn nicht jeder Auftrag
 *              als Rechnung erfasst wird.
 */
import { ORDER_GROUPS, INVOICE_GROUPS, TASK_OPEN, ORDER_STATUS, optionLabel } from '../data/schema.js';
import { sum, groupBy, sortBy } from '../core/util.js';
import { asDay, inRange, monthKey, lastMonths, periodRange, daysUntil, today } from '../core/format.js';

/* ------------------------------------------------------------ Umsatz -- */

/**
 * Einheitliche Liste von Umsatzereignissen `{ day, amount, customerId, orderId, source }`.
 * Alles Weitere (Zeitraum, pro Kunde, pro Projekt, Verlauf) filtert nur noch.
 */
export function revenueEvents(store) {
  const basis = store.settings.revenueBasis === 'orders' ? 'orders' : 'invoices';

  if (basis === 'orders') {
    return store
      .all('orders')
      .filter((o) => ORDER_GROUPS.done.includes(o.status))
      .map((o) => ({
        day: asDay(o.deadline || o.orderDate || o._createdAt),
        amount: Number(o.value) || 0,
        customerId: o.customerId || '',
        orderId: o._id,
        source: 'order',
        id: o._id,
      }))
      .filter((e) => e.day);
  }

  return store
    .all('invoices')
    .filter((i) => INVOICE_GROUPS.paid.includes(i.status))
    .map((i) => ({
      day: asDay(i.paidDate || i.issueDate || i._createdAt),
      amount: Number(i.amount) || 0,
      customerId: i.customerId || '',
      orderId: i.orderId || '',
      source: 'invoice',
      id: i._id,
    }))
    .filter((e) => e.day);
}

export function revenueIn(store, range, events = revenueEvents(store)) {
  return sum(events.filter((e) => inRange(e.day, range)), (e) => e.amount);
}

export function revenueSummary(store) {
  const events = revenueEvents(store);
  return {
    basis: store.settings.revenueBasis === 'orders' ? 'orders' : 'invoices',
    month: revenueIn(store, periodRange('thisMonth'), events),
    lastMonth: revenueIn(store, periodRange('lastMonth'), events),
    year: revenueIn(store, periodRange('thisYear'), events),
    lastYear: revenueIn(store, periodRange('lastYear'), events),
    total: sum(events, (e) => e.amount),
  };
}

/** Monatsreihe für die Umsatzgrafik, immer lückenlos aufgefüllt. */
export function revenueSeries(store, months = 12, events = revenueEvents(store)) {
  const keys = lastMonths(months);
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const e of events) {
    const k = monthKey(e.day);
    if (totals.has(k)) totals.set(k, totals.get(k) + e.amount);
  }
  return keys.map((k) => ({ key: k, value: totals.get(k) }));
}

/* ---------------------------------------------------------- Rechnungen -- */

export function invoiceTotals(store) {
  const invoices = store.all('invoices');
  const pick = (list) => ({ count: list.length, amount: sum(list, (i) => Number(i.amount) || 0) });

  const open = invoices.filter((i) => i.status === 'offen');
  const overdue = invoices.filter((i) => i.status === 'ueberfaellig');
  const outstanding = invoices.filter((i) => INVOICE_GROUPS.outstanding.includes(i.status));
  const paid = invoices.filter((i) => INVOICE_GROUPS.paid.includes(i.status));
  const draft = invoices.filter((i) => i.status === 'entwurf');
  const cancelled = invoices.filter((i) => i.status === 'storniert');

  return {
    open: pick(open),
    overdue: pick(overdue),
    outstanding: pick(outstanding),
    paid: pick(paid),
    draft: pick(draft),
    cancelled: pick(cancelled),
    total: pick(invoices),
  };
}

/* ------------------------------------------------------------ Aufträge -- */

export function orderCounts(store) {
  const orders = store.all('orders');
  const inGroup = (g) => orders.filter((o) => ORDER_GROUPS[g].includes(o.status));
  return {
    active: inGroup('active').length,
    open: inGroup('open').length,
    done: inGroup('done').length,
    cancelled: inGroup('cancelled').length,
    total: orders.length,
    activeValue: sum(inGroup('active'), (o) => Number(o.value) || 0),
    openValue: sum(inGroup('open'), (o) => Number(o.value) || 0),
  };
}

/** Verteilung über alle sieben Status – Reihenfolge wie im Schema. */
export function ordersByStatus(store) {
  const orders = store.all('orders');
  const counts = groupBy(orders, (o) => o.status);
  return ORDER_STATUS.map((opt) => ({
    value: opt.value,
    label: opt.label,
    tone: opt.tone,
    count: (counts.get(opt.value) || []).length,
    amount: sum(counts.get(opt.value) || [], (o) => Number(o.value) || 0),
  }));
}

export function averageOrderValue(store) {
  const orders = store.all('orders').filter((o) => !ORDER_GROUPS.cancelled.includes(o.status) && Number(o.value) > 0);
  if (!orders.length) return 0;
  return sum(orders, (o) => Number(o.value)) / orders.length;
}

/* -------------------------------------------------------------- Kunden -- */

/**
 * Kennzahlen zu einem Kunden – genau das, was die Kundenseite zeigen muss:
 * Umsatz, Anzahl Aufträge, offene und bezahlte Rechnungen.
 */
export function customerStats(store, customerId, events = revenueEvents(store)) {
  const orders = store.all('orders').filter((o) => o.customerId === customerId);
  const invoices = store.all('invoices').filter((i) => i.customerId === customerId);
  const websites = store.all('websites').filter((w) => w.customerId === customerId);
  const projects = store.all('projects').filter((p) => p.customerId === customerId);

  const outstanding = invoices.filter((i) => INVOICE_GROUPS.outstanding.includes(i.status));
  const paid = invoices.filter((i) => INVOICE_GROUPS.paid.includes(i.status));

  return {
    revenue: sum(events.filter((e) => e.customerId === customerId), (e) => e.amount),
    orders,
    orderCount: orders.length,
    activeOrders: orders.filter((o) => ORDER_GROUPS.active.includes(o.status)).length,
    openOrders: orders.filter((o) => ORDER_GROUPS.open.includes(o.status)).length,
    doneOrders: orders.filter((o) => ORDER_GROUPS.done.includes(o.status)).length,
    orderValue: sum(orders.filter((o) => !ORDER_GROUPS.cancelled.includes(o.status)), (o) => Number(o.value) || 0),
    invoices,
    outstandingInvoices: outstanding,
    outstandingAmount: sum(outstanding, (i) => Number(i.amount) || 0),
    paidInvoices: paid,
    paidAmount: sum(paid, (i) => Number(i.amount) || 0),
    websites,
    projects,
  };
}

/** Umsatzrangliste aller Kunden, absteigend. */
export function revenueByCustomer(store, range = { from: '', to: '' }) {
  const events = revenueEvents(store).filter((e) => inRange(e.day, range));
  const byCustomer = groupBy(events, (e) => e.customerId);
  const rows = store.all('customers').map((c) => ({
    id: c._id,
    label: c.company || '(ohne Namen)',
    amount: sum(byCustomer.get(c._id) || [], (e) => e.amount),
  }));
  const orphan = sum(byCustomer.get('') || [], (e) => e.amount);
  if (orphan > 0) rows.push({ id: '', label: 'Ohne Kundenzuordnung', amount: orphan });
  return sortBy(rows.filter((r) => r.amount > 0), (r) => r.amount, -1);
}

/**
 * Umsatz pro Projekt. Als „Projekt" zählt der Auftrag – dort hängt der
 * Projektname und darüber laufen die Rechnungen.
 */
export function revenueByOrder(store, range = { from: '', to: '' }) {
  const events = revenueEvents(store).filter((e) => inRange(e.day, range));
  const byOrder = groupBy(events, (e) => e.orderId);
  const rows = store.all('orders').map((o) => ({
    id: o._id,
    label: o.title || '(ohne Titel)',
    customer: store.titleOf('customers', o.customerId),
    amount: sum(byOrder.get(o._id) || [], (e) => e.amount),
  }));
  const orphan = sum(byOrder.get('') || [], (e) => e.amount);
  if (orphan > 0) rows.push({ id: '', label: 'Ohne Auftragszuordnung', customer: '', amount: orphan });
  return sortBy(rows.filter((r) => r.amount > 0), (r) => r.amount, -1);
}

/* ------------------------------------------------------------ Aufgaben -- */

export function openTasks(store) {
  const tasks = store.all('tasks').filter((t) => TASK_OPEN.includes(t.status));
  const rank = { dringend: 0, hoch: 1, normal: 2, niedrig: 3 };
  return [...tasks].sort((a, b) => {
    const pa = rank[a.priority] ?? 2;
    const pb = rank[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    const da = a.deadline || '9999-12-31';
    const db = b.deadline || '9999-12-31';
    return da.localeCompare(db);
  });
}

/** Anstehende und überfällige Termine aus Aufträgen, Projekten und Aufgaben. */
export function upcomingDeadlines(store, { days = 30, limit = 8 } = {}) {
  const items = [];
  const push = (entityKey, record, dateField, label) => {
    const day = asDay(record[dateField]);
    if (!day) return;
    const left = daysUntil(day);
    if (left === null || left > days) return;
    items.push({ entityKey, id: record._id, title: label, day, daysLeft: left });
  };

  for (const o of store.all('orders')) {
    if (ORDER_GROUPS.done.includes(o.status) || ORDER_GROUPS.cancelled.includes(o.status)) continue;
    push('orders', o, 'deadline', o.title);
  }
  for (const p of store.all('projects')) {
    if (['fertig', 'archiviert'].includes(p.status)) continue;
    push('projects', p, 'deadline', p.title);
  }
  for (const t of store.all('tasks')) {
    if (t.status === 'erledigt') continue;
    push('tasks', t, 'deadline', t.title);
  }
  for (const i of store.all('invoices')) {
    if (!INVOICE_GROUPS.outstanding.includes(i.status)) continue;
    push('invoices', i, 'dueDate', `Rechnung ${i.number}`);
  }

  return items.sort((a, b) => a.day.localeCompare(b.day)).slice(0, limit);
}

/* ----------------------------------------------------------- Dashboard -- */

/** Die neun Kennzahlen der Startseite in einem Durchlauf. */
export function dashboardMetrics(store) {
  const orders = orderCounts(store);
  const invoices = invoiceTotals(store);
  const revenue = revenueSummary(store);
  return { orders, invoices, revenue, today: today() };
}

/** Zuletzt geänderte Datensätze einer Entität. */
export function recent(store, key, limit = 5, dateField = '_createdAt') {
  return sortBy(store.all(key), (r) => r[dateField] || r._createdAt || '', -1).slice(0, limit);
}

/** Zuletzt abgeschlossene Aufträge – nach dem Zeitpunkt der letzten Änderung. */
export function recentlyCompletedOrders(store, limit = 5) {
  return sortBy(
    store.all('orders').filter((o) => ORDER_GROUPS.done.includes(o.status)),
    (o) => o._updatedAt || o._createdAt || '',
    -1,
  ).slice(0, limit);
}

export { optionLabel };
