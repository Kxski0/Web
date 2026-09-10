/**
 * Finanzen.
 *
 * Alle Werte gelten für den gewählten Zeitraum. Umgeschaltet wird oben; der
 * benutzerdefinierte Zeitraum erscheint erst, wenn er gebraucht wird, damit die
 * Leiste auf dem iPad kurz bleibt.
 */
import { h } from '../dom.js';
import { Button, Card, StatCard, PageHeader, Notice } from '../components/basics.js';
import { SegmentedControl, createRegion } from '../components/Toolbar.js';
import { RevenueChart, BarList, SplitBar } from '../components/Chart.js';
import { Table } from '../components/Table.js';
import { moneyCell, dateCell, statusCell } from './listView.js';
import {
  revenueEvents, revenueIn, revenueSeries, revenueByCustomer, revenueByOrder,
  invoiceTotals, averageOrderValue, orderCounts,
} from '../../domain/metrics.js';
import { PERIODS, periodRange, formatMoney, formatDate, inRange, today } from '../../core/format.js';
import { sum } from '../../core/util.js';

export function renderFinance(ctx) {
  const { store, navigate } = ctx;
  const state = ctx.getViewState('finance', { period: 'thisYear', from: '', to: '' });

  const region = createRegion('finance-region');

  function currentRange() {
    return periodRange(state.period, { from: state.from, to: state.to });
  }

  function draw() {
    const range = currentRange();
    const events = revenueEvents(store);
    const inPeriod = events.filter((e) => inRange(e.day, range));
    const revenue = sum(inPeriod, (e) => e.amount);
    const totals = invoiceTotals(store);
    const orders = orderCounts(store);
    const basisNote = store.settings.revenueBasis === 'orders'
      ? 'Umsatz = Summe abgeschlossener Aufträge, datiert auf Deadline bzw. Erstellungsdatum.'
      : 'Umsatz = Summe bezahlter Rechnungen, datiert auf das Zahlungsdatum.';

    /* Zeitraumunabhängige Gesamtwerte für die Einordnung */
    const monthRevenue = revenueIn(store, periodRange('thisMonth'), events);
    const yearRevenue = revenueIn(store, periodRange('thisYear'), events);
    const totalRevenue = sum(events, (e) => e.amount);

    const stats = h('div.stat-row', null,
      StatCard({
        label: 'Umsatz im Zeitraum',
        value: revenue,
        format: 'money',
        tone: 'success',
        hint: rangeLabel(range),
      }),
      StatCard({ label: 'Umsatz Monat', value: monthRevenue, format: 'money' }),
      StatCard({ label: 'Umsatz Jahr', value: yearRevenue, format: 'money' }),
      StatCard({ label: 'Gesamtumsatz', value: totalRevenue, format: 'money' }),
      StatCard({
        label: 'Offene Forderungen',
        value: totals.outstanding.amount,
        format: 'money',
        tone: totals.outstanding.amount > 0 ? 'warn' : 'success',
        hint: `${totals.outstanding.count} Rechnungen`,
      }),
      StatCard({
        label: 'Bezahlte Rechnungen',
        value: totals.paid.amount,
        format: 'money',
        tone: 'success',
        hint: `${totals.paid.count} Rechnungen`,
      }),
      StatCard({
        label: 'Ø Auftragswert',
        value: averageOrderValue(store),
        format: 'money',
        hint: `${orders.total - orders.cancelled} gewertete Aufträge`,
      }),
      StatCard({
        label: 'Zahlungen im Zeitraum',
        value: inPeriod.length,
        hint: store.settings.revenueBasis === 'orders' ? 'abgeschlossene Aufträge' : 'bezahlte Rechnungen',
      }));

    const chartCard = Card({
      title: 'Umsatzentwicklung',
      subtitle: 'Letzte 12 Monate, unabhängig vom gewählten Zeitraum',
      children: totalRevenue > 0
        ? RevenueChart(revenueSeries(store, 12, events))
        : h('p.muted', null, 'Noch kein Umsatz erfasst.'),
    });

    const perCustomer = revenueByCustomer(store, range);
    const customerCard = Card({
      title: 'Umsatz pro Kunde',
      subtitle: rangeLabel(range),
      children: BarList(
        perCustomer.slice(0, 12).map((r) => ({ label: r.label, value: r.amount, tone: 'success' })),
        {
          format: 'money',
          emptyText: 'Im gewählten Zeitraum kein Umsatz.',
          onClick: (row) => {
            const hit = perCustomer.find((r) => r.label === row.label);
            if (hit?.id) navigate('kunden', hit.id);
          },
        },
      ),
    });

    const perOrder = revenueByOrder(store, range);
    const orderCard = Card({
      title: 'Umsatz pro Projekt',
      subtitle: 'Zugeordnet über den Auftrag',
      children: BarList(
        perOrder.slice(0, 12).map((r) => ({ label: r.label, value: r.amount, tone: 'info', meta: r.customer })),
        {
          format: 'money',
          emptyText: 'Im gewählten Zeitraum kein Umsatz.',
          onClick: (row) => {
            const hit = perOrder.find((r) => r.label === row.label);
            if (hit?.id) navigate('auftraege', hit.id);
          },
        },
      ),
    });

    const splitCard = Card({
      title: 'Forderungen',
      children: SplitBar([
        { label: 'Bezahlt', value: totals.paid.amount, tone: 'success' },
        { label: 'Offen', value: totals.open.amount, tone: 'warn' },
        { label: 'Überfällig', value: totals.overdue.amount, tone: 'danger' },
      ], { label: 'Verhältnis bezahlt zu offen' }),
    });

    /* Belegliste des Zeitraums – damit die Summe nachvollziehbar bleibt. */
    const rows = inPeriod
      .map((e) => {
        const record = e.source === 'invoice' ? store.byId('invoices', e.id) : store.byId('orders', e.id);
        return record ? { ...e, record } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.day.localeCompare(a.day));

    const detailCard = Card({
      title: 'Einzelposten im Zeitraum',
      subtitle: `${rows.length} Posten · ${formatMoney(revenue)}`,
      padded: false,
      children: rows.length
        ? Table({
          rows,
          rowKey: (r) => r.id,
          onRowClick: (r) => navigate(r.source === 'invoice' ? 'rechnungen' : 'auftraege', r.id),
          columns: [
            {
              key: 'label',
              label: 'Beleg',
              primary: true,
              render: (r) => h('span.cell-strong', null,
                r.source === 'invoice' ? `Rechnung ${r.record.number}` : r.record.title),
            },
            {
              key: 'customer',
              label: 'Kunde',
              render: (r) => h('span', null, store.titleOf('customers', r.customerId) || '—'),
            },
            {
              key: 'status',
              label: 'Status',
              hideOn: 'narrow',
              render: (r) => (r.source === 'invoice'
                ? statusCell('invoices', 'status', r.record.status)
                : statusCell('orders', 'status', r.record.status)),
            },
            { key: 'day', label: 'Datum', render: (r) => dateCell(r.day) },
            { key: 'amount', label: 'Betrag', align: 'right', render: (r) => moneyCell(r.amount) },
          ],
        })
        : h('p.muted.card-note', null, 'Für diesen Zeitraum sind keine Posten erfasst.'),
    });

    region.render(
      stats,
      Notice(basisNote, 'info', Button('Basis ändern', {
        variant: 'ghost', size: 'sm', onClick: () => navigate('einstellungen'),
      })),
      h('div.finance-grid', null, chartCard, splitCard, customerCard, orderCard),
      detailCard,
    );
  }

  /* --------------------------------------------------- Zeitraumleiste -- */

  /**
   * Die Leiste zeichnet sich selbst neu, damit die aktive Schaltflaeche mit
   * dem Zustand uebereinstimmt; der Inhalt darunter wird getrennt aktualisiert.
   */
  const barRegion = createRegion('period-bar');

  function drawBar() {
    const dateField = (label, key) => h('label.toolbar-field', null,
      h('span.toolbar-field-label', null, label),
      h('input.input', {
        type: 'date',
        value: state[key],
        onChange: (e) => {
          state[key] = e.target.value;
          draw();
        },
      }));

    barRegion.render(
      SegmentedControl({
        label: 'Zeitraum',
        value: state.period,
        items: PERIODS.map((p) => ({ value: p.id, label: p.label })),
        onChange: (id) => {
          state.period = id;
          // Benutzerdefiniert startet mit einem sinnvollen Vorschlag statt leer.
          if (id === 'custom' && !state.from) {
            state.from = `${new Date().getFullYear()}-01-01`;
            state.to = today();
          }
          drawBar();
          draw();
        },
      }),
      state.period === 'custom'
        ? h('div.period-custom', null, dateField('Von', 'from'), dateField('Bis', 'to'))
        : null,
    );
  }

  drawBar();
  draw();

  return h('div.view', null,
    PageHeader({
      title: 'Finanzen',
      subtitle: 'Umsatz, Forderungen und Auswertung nach Zeitraum',
    }),
    barRegion.el,
    region.el);
}

function rangeLabel(range) {
  if (!range.from && !range.to) return 'Gesamter Zeitraum';
  if (range.from && range.to) return `${formatDate(range.from)} – ${formatDate(range.to)}`;
  if (range.from) return `ab ${formatDate(range.from)}`;
  return `bis ${formatDate(range.to)}`;
}
