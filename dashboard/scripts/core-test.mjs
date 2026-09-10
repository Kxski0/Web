/**
 * Prüft die Datenschicht ohne Browser: Store, Validierung, Beziehungen,
 * Umsatzberechnung, Auto-Überfällig, Suche, Export/Import.
 *
 * Aufruf: node dashboard/scripts/core-test.mjs
 */
import assert from 'node:assert/strict';

import { createLocalAdapter } from '../src/data/adapters/local.js';
import { createStore } from '../src/data/store.js';
import { buildDemoData } from '../src/data/demo.js';
import { search } from '../src/domain/search.js';
import {
  dashboardMetrics,
  revenueSummary,
  invoiceTotals,
  orderCounts,
  customerStats,
  revenueByCustomer,
  revenueByOrder,
  revenueSeries,
  averageOrderValue,
  openTasks,
  upcomingDeadlines,
} from '../src/domain/metrics.js';
import { toDayString } from '../src/core/format.js';

let passed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failures.push({ name, err });
  }
}

/** Frischer Store auf reinem Speicher – kein localStorage in Node. */
async function freshStore() {
  const map = new Map();
  const storage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
  const adapter = createLocalAdapter({ storage });
  const store = createStore(adapter);
  await store.load();
  return store;
}

function day(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toDayString(d);
}

await test('Store startet leer und ohne Demodaten', async () => {
  const store = await freshStore();
  assert.equal(store.all('customers').length, 0);
  assert.equal(store.all('invoices').length, 0);
  assert.equal(store.activity().length, 0);
});

await test('Pflichtfelder werden abgelehnt', async () => {
  const store = await freshStore();
  const res = await store.create('customers', { company: '' });
  assert.equal(res.ok, false);
  assert.ok(res.errors.company);
  assert.equal(store.all('customers').length, 0);
});

await test('Kunde anlegen, ändern, Aktivität protokollieren', async () => {
  const store = await freshStore();
  const created = await store.create('customers', { company: 'Testfirma', email: 'a@b.de' });
  assert.equal(created.ok, true);
  assert.ok(created.record._id);
  assert.equal(store.all('customers').length, 1);

  const updated = await store.update('customers', created.record._id, { city: 'Hamburg' });
  assert.equal(updated.ok, true);
  assert.equal(store.byId('customers', created.record._id).city, 'Hamburg');

  const log = store.activity();
  assert.equal(log.length, 2);
  assert.match(log[0].text, /geändert/);
  assert.match(log[1].text, /angelegt/);
});

await test('Ungültige E-Mail und negativer Betrag werden gemeldet', async () => {
  const store = await freshStore();
  const bad = await store.create('customers', { company: 'X', email: 'keine-mail' });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.email);

  const c = await store.create('customers', { company: 'Y' });
  const inv = await store.create('invoices', { number: 'R1', customerId: c.record._id, amount: '-50' });
  assert.equal(inv.ok, false);
  assert.ok(inv.errors.amount);
});

await test('Rechnungsnummer ist eindeutig', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Y' });
  await store.create('invoices', { number: '2026-1', customerId: c.record._id, amount: 100 });
  const dupe = await store.create('invoices', { number: '2026-1', customerId: c.record._id, amount: 200 });
  assert.equal(dupe.ok, false);
  assert.ok(dupe.errors.number);
});

await test('Referenz auf gelöschten Kunden wird geprüft', async () => {
  const store = await freshStore();
  const res = await store.create('orders', { title: 'A', customerId: 'gibt-es-nicht' });
  assert.equal(res.ok, false);
  assert.ok(res.errors.customerId);
});

await test('Kunde mit Aufträgen wird nicht ungefragt gelöscht', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Z' });
  await store.create('orders', { title: 'Auftrag', customerId: c.record._id, value: 100 });

  const blocked = await store.remove('customers', c.record._id);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.blockers[0].count, 1);
  assert.equal(store.all('customers').length, 1);

  const forced = await store.remove('customers', c.record._id, { cascade: true });
  assert.equal(forced.ok, true);
  assert.equal(store.all('customers').length, 0);
  // Auftrag bleibt erhalten, nur die Verknüpfung ist gelöst.
  assert.equal(store.all('orders').length, 1);
  assert.equal(store.all('orders')[0].customerId, '');
});

await test('Beträge in deutscher Schreibweise werden übernommen', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Q' });
  const o = await store.create('orders', { title: 'T', customerId: c.record._id, value: '1.250,50 €' });
  assert.equal(o.record.value, 1250.5);
});

await test('Deadline vor Erstellungsdatum wird abgelehnt', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Q' });
  const o = await store.create('orders', {
    title: 'T', customerId: c.record._id, orderDate: day(0), deadline: day(-5),
  });
  assert.equal(o.ok, false);
  assert.ok(o.errors.deadline);
});

await test('Überfällige Rechnung wird automatisch markiert', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Q' });
  const inv = await store.create('invoices', {
    number: 'R-9', customerId: c.record._id, amount: 1200,
    status: 'offen', issueDate: day(-30), dueDate: day(-3),
  });
  assert.equal(inv.record.status, 'ueberfaellig');

  // Frist verschoben -> zurück auf offen.
  const moved = await store.update('invoices', inv.record._id, { dueDate: day(10) });
  assert.equal(moved.record.status, 'offen');
});

await test('Status "Bezahlt" setzt das Zahlungsdatum', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Q' });
  const inv = await store.create('invoices', {
    number: 'R-10', customerId: c.record._id, amount: 500, status: 'offen', dueDate: day(10),
  });
  const paid = await store.update('invoices', inv.record._id, { status: 'bezahlt' });
  assert.equal(paid.record.paidDate, day(0));

  const back = await store.update('invoices', inv.record._id, { status: 'offen' });
  assert.equal(back.record.paidDate, '');
});

await test('Dashboard rechnet das Beispiel aus der Anforderung korrekt', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'Beispiel' });
  const cid = c.record._id;
  await store.create('invoices', {
    number: 'R1', customerId: cid, amount: 500, status: 'bezahlt', issueDate: day(-20), paidDate: day(-18),
  });
  await store.create('invoices', {
    number: 'R2', customerId: cid, amount: 800, status: 'offen', issueDate: day(-10), dueDate: day(10),
  });
  await store.create('invoices', {
    number: 'R3', customerId: cid, amount: 1200, status: 'offen', issueDate: day(-40), dueDate: day(-5),
  });

  const totals = invoiceTotals(store);
  assert.equal(totals.outstanding.amount, 2000, 'Offen = 800 + 1200');
  assert.equal(totals.paid.amount, 500, 'Bezahlt = 500');
  assert.equal(totals.overdue.count, 1);
  assert.equal(totals.open.count, 1);

  const rev = revenueSummary(store);
  assert.equal(rev.total, 500, 'Umsatz zaehlt nur bezahlte Rechnungen');
});

await test('Auftragskennzahlen partitionieren alle Status', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'P' });
  const cid = c.record._id;
  const mk = (status) => store.create('orders', { title: status, customerId: cid, value: 100, status });
  for (const s of ['anfrage', 'angebot', 'angenommen', 'in_bearbeitung', 'wartet_kunde', 'abgeschlossen', 'storniert']) {
    await mk(s);
  }
  const counts = orderCounts(store);
  assert.equal(counts.open, 2);
  assert.equal(counts.active, 3);
  assert.equal(counts.done, 1);
  assert.equal(counts.cancelled, 1);
  assert.equal(counts.open + counts.active + counts.done + counts.cancelled, counts.total);
});

await test('Umsatzbasis "orders" liefert abgeschlossene Auftragswerte', async () => {
  const store = await freshStore();
  await store.saveSettings({ revenueBasis: 'orders' });
  const c = await store.create('customers', { company: 'P' });
  await store.create('orders', {
    title: 'Fertig', customerId: c.record._id, value: 3000, status: 'abgeschlossen',
    orderDate: day(-30), deadline: day(-2),
  });
  await store.create('orders', {
    title: 'Laeuft', customerId: c.record._id, value: 9999, status: 'in_bearbeitung', orderDate: day(-10),
  });
  assert.equal(revenueSummary(store).total, 3000);
});

await test('Kundenkennzahlen: Umsatz, Aufträge, offene und bezahlte Rechnungen', async () => {
  const store = await freshStore();
  const a = (await store.create('customers', { company: 'A' })).record;
  const b = (await store.create('customers', { company: 'B' })).record;
  const oa = (await store.create('orders', { title: 'OA', customerId: a._id, value: 1000, status: 'abgeschlossen' })).record;
  await store.create('orders', { title: 'OB', customerId: b._id, value: 500, status: 'in_bearbeitung' });
  await store.create('invoices', {
    number: 'A1', customerId: a._id, orderId: oa._id, amount: 1000, status: 'bezahlt', issueDate: day(-5), paidDate: day(-4),
  });
  await store.create('invoices', {
    number: 'A2', customerId: a._id, orderId: oa._id, amount: 300, status: 'offen', issueDate: day(-2), dueDate: day(20),
  });

  const stats = customerStats(store, a._id);
  assert.equal(stats.revenue, 1000);
  assert.equal(stats.orderCount, 1);
  assert.equal(stats.outstandingAmount, 300);
  assert.equal(stats.paidAmount, 1000);
  assert.equal(stats.outstandingInvoices.length, 1);
  assert.equal(stats.paidInvoices.length, 1);

  const ranking = revenueByCustomer(store);
  assert.equal(ranking[0].label, 'A');
  assert.equal(ranking[0].amount, 1000);

  const perOrder = revenueByOrder(store);
  assert.equal(perOrder[0].label, 'OA');
  assert.equal(perOrder[0].amount, 1000);
});

await test('Umsatzreihe ist lückenlos und aktuell', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'S' });
  await store.create('invoices', {
    number: 'S1', customerId: c.record._id, amount: 700, status: 'bezahlt', issueDate: day(0), paidDate: day(0),
  });
  const series = revenueSeries(store, 12);
  assert.equal(series.length, 12);
  assert.equal(series[11].value, 700);
  assert.equal(series[0].value, 0);
});

await test('Durchschnittlicher Auftragswert ignoriert stornierte Aufträge', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'S' });
  const cid = c.record._id;
  await store.create('orders', { title: 'A', customerId: cid, value: 1000, status: 'abgeschlossen' });
  await store.create('orders', { title: 'B', customerId: cid, value: 3000, status: 'in_bearbeitung' });
  await store.create('orders', { title: 'C', customerId: cid, value: 99999, status: 'storniert' });
  assert.equal(averageOrderValue(store), 2000);
});

await test('Offene Aufgaben werden nach Priorität und Termin sortiert', async () => {
  const store = await freshStore();
  await store.create('tasks', { title: 'Normal spät', priority: 'normal', deadline: day(30) });
  await store.create('tasks', { title: 'Dringend', priority: 'dringend', deadline: day(20) });
  await store.create('tasks', { title: 'Normal früh', priority: 'normal', deadline: day(1) });
  await store.create('tasks', { title: 'Erledigt', priority: 'dringend', status: 'erledigt' });

  const open = openTasks(store);
  assert.equal(open.length, 3);
  assert.equal(open[0].title, 'Dringend');
  assert.equal(open[1].title, 'Normal früh');
});

await test('Termine sammeln Aufträge, Projekte, Aufgaben und Rechnungen', async () => {
  const store = await freshStore();
  const c = await store.create('customers', { company: 'D' });
  await store.create('orders', { title: 'Auftrag', customerId: c.record._id, status: 'in_bearbeitung', deadline: day(3) });
  await store.create('projects', { title: 'Projekt', status: 'in_arbeit', deadline: day(5) });
  await store.create('tasks', { title: 'Aufgabe', deadline: day(1) });
  await store.create('invoices', {
    number: 'D1', customerId: c.record._id, amount: 100, status: 'offen', issueDate: day(-1), dueDate: day(2),
  });
  const list = upcomingDeadlines(store, { days: 30 });
  assert.equal(list.length, 4);
  assert.equal(list[0].title, 'Aufgabe');
  assert.deepEqual([...list].map((i) => i.day), [...list].map((i) => i.day).sort());
});

await test('Globale Suche findet Kunde und dessen verknüpfte Datensätze', async () => {
  const store = await freshStore();
  const c = (await store.create('customers', {
    company: 'Nordlicht Bau GmbH', contact: 'Max Müller', email: 'max@nordlicht.de',
  })).record;
  const o = (await store.create('orders', { title: 'Relaunch', customerId: c._id, value: 100 })).record;
  await store.create('invoices', {
    number: 'N-1', customerId: c._id, orderId: o._id, amount: 100, status: 'entwurf', issueDate: day(0),
  });
  await store.create('websites', { title: 'nordlicht.de', customerId: c._id, url: 'https://nordlicht.de' });

  const groups = search(store, 'Max Müller');
  const keys = groups.map((g) => g.key);
  assert.ok(keys.includes('customers'));
  assert.ok(keys.includes('orders'), 'Auftrag über den Kundennamen gefunden');
  assert.ok(keys.includes('invoices'));
  assert.ok(keys.includes('websites'));

  // Diakritika- und Groß-/Kleinschreibungsunabhängig.
  assert.ok(search(store, 'mueller').length > 0 || search(store, 'muller').length > 0);
  assert.equal(search(store, '   ').length, 0);
});

await test('Export und Import erhalten Daten und Beziehungen', async () => {
  const store = await freshStore();
  const c = (await store.create('customers', { company: 'Export AG' })).record;
  await store.create('orders', { title: 'O', customerId: c._id, value: 42 });

  const dump = store.exportAll();
  const other = await freshStore();
  await other.importAll(JSON.parse(JSON.stringify(dump)));

  assert.equal(other.all('customers').length, 1);
  assert.equal(other.all('orders').length, 1);
  assert.equal(other.all('orders')[0].customerId, c._id, 'Beziehung überlebt den Import');
  assert.equal(other.all('orders')[0].value, 42);

  await assert.rejects(() => other.importAll({ nonsense: true }));
});

await test('Demodaten sind in sich stimmig', async () => {
  const store = await freshStore();
  await store.loadDataset(buildDemoData());

  const customerIds = new Set(store.all('customers').map((c) => c._id));
  for (const o of store.all('orders')) assert.ok(customerIds.has(o.customerId), 'Auftrag zeigt auf echten Kunden');
  for (const i of store.all('invoices')) assert.ok(customerIds.has(i.customerId), 'Rechnung zeigt auf echten Kunden');

  const orderIds = new Set(store.all('orders').map((o) => o._id));
  for (const i of store.all('invoices')) {
    if (i.orderId) assert.ok(orderIds.has(i.orderId), 'Rechnung zeigt auf echten Auftrag');
  }

  await store.syncOverdueInvoices();
  const totals = invoiceTotals(store);
  assert.ok(totals.overdue.count >= 1, 'Mindestens eine Rechnung ist überfällig');
  assert.ok(totals.paid.amount > 0);

  const m = dashboardMetrics(store);
  assert.ok(m.revenue.total > 0);
  assert.ok(m.orders.total > 0);
  assert.equal(
    m.invoices.outstanding.amount,
    m.invoices.open.amount + m.invoices.overdue.amount,
    'Ausstehend = offen + überfällig',
  );
});

await test('Zurücksetzen leert alle Kollektionen', async () => {
  const store = await freshStore();
  await store.loadDataset(buildDemoData());
  await store.resetAll();
  assert.equal(store.all('customers').length, 0);
  assert.equal(store.all('invoices').length, 0);
});

/* ------------------------------------------------------------- Ausgabe -- */

if (failures.length) {
  for (const f of failures) {
    console.error(`\n✗ ${f.name}`);
    console.error(`  ${f.err?.message || f.err}`);
  }
  console.error(`\n${passed} bestanden, ${failures.length} fehlgeschlagen`);
  process.exit(1);
}
console.log(`✓ ${passed} Kern-Tests bestanden`);
