/**
 * Diagramme als reines SVG.
 *
 * Keine Chart-Bibliothek: die drei benötigten Formen (Verlauf, Balken,
 * Fortschritt) sind mit wenigen Pfaden erledigt und starten ohne zusätzliches
 * Bundle. Alle Diagramme sind skalierbar (viewBox) und tragen eine Textfassung
 * für Screenreader.
 *
 * Auf Touch-Geräten gibt es keine Hover-Tooltips: jeder Wert ist entweder
 * direkt beschriftet oder über die Legende ablesbar.
 */
import { h, svg } from '../dom.js';
import { formatMoney, monthLabel } from '../../core/format.js';

const PAD = { top: 14, right: 8, bottom: 26, left: 8 };

/** „Schöne" Obergrenze, damit die Achse nicht bei 8.437 € endet. */
function niceMax(value) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = 10 ** exp;
  const steps = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
  for (const s of steps) {
    if (value <= s * base) return s * base;
  }
  return 10 * base;
}

/**
 * Umsatzverlauf als Flächendiagramm mit Monatsbalken darunter.
 * @param {{key:string,value:number}[]} series
 */
export function RevenueChart(series, options = {}) {
  const { height = 200, label = 'Umsatzentwicklung' } = options;
  const width = 640;
  const data = series.length ? series : [{ key: '', value: 0 }];
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((d, i) => ({
    x: PAD.left + i * stepX,
    y: PAD.top + innerH - (max ? (d.value / max) * innerH : 0),
    ...d,
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${points[0].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const gridLines = [0, 0.5, 1].map((f) => {
    const y = PAD.top + innerH * f;
    return svg('line', { x1: PAD.left, x2: width - PAD.right, y1: y, y2: y, class: 'chart-grid' });
  });

  // Beschriftet werden nur der erste, mittlere und letzte Monat – bei 12
  // Monaten auf iPad-Breite überlappen sonst die Labels.
  const labelIdx = new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]);

  const node = svg('svg.chart', {
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: 'none',
    role: 'img',
    'aria-label': `${label}: ${data.map((d) => `${monthLabel(d.key, { short: true })} ${formatMoney(d.value)}`).join(', ')}`,
  },
  ...gridLines,
  svg('path', { d: area, class: 'chart-area' }),
  svg('path', { d: line, class: 'chart-line' }),
  ...points.map((p) => svg('circle', { cx: p.x, cy: p.y, r: 3, class: 'chart-dot' })),
  ...points.map((p, i) => (labelIdx.has(i)
    ? svg('text', {
      x: Math.min(Math.max(p.x, 20), width - 20),
      y: height - 8,
      class: 'chart-axis',
      'text-anchor': i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle',
    }, monthLabel(p.key, { short: true }))
    : null)).filter(Boolean));

  const peak = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
  return h('figure.chart-figure', null,
    node,
    h('figcaption.chart-caption', null,
      `Höchster Monat: ${monthLabel(peak.key)} · ${formatMoney(peak.value)}`));
}

/**
 * Waagerechte Balken – für „Aufträge nach Status", Umsatz pro Kunde/Projekt.
 * @param {{label:string,value:number,tone?:string,meta?:string}[]} rows
 */
export function BarList(rows, options = {}) {
  const { format = 'number', onClick, emptyText = 'Keine Daten' } = options;
  const data = rows.filter((r) => r);
  if (!data.length) return h('p.muted', null, emptyText);

  const max = Math.max(...data.map((r) => Math.abs(r.value)), 1);
  const fmt = (v) => (format === 'money' ? formatMoney(v) : String(v));

  return h('ul.barlist', null, ...data.map((row) => {
    const pct = Math.max(row.value > 0 ? 2 : 0, (Math.abs(row.value) / max) * 100);
    const inner = [
      h('span.barlist-label', null, row.label),
      h('span.barlist-value', null, fmt(row.value)),
      h('span.barlist-track', { 'aria-hidden': 'true' },
        h('span', { class: `barlist-fill tone-${row.tone || 'info'}`, style: { width: `${pct}%` } })),
      row.meta ? h('span.barlist-meta', null, row.meta) : null,
    ].filter(Boolean);

    return h('li.barlist-row', null,
      onClick
        ? h('button.barlist-btn', { type: 'button', onClick: () => onClick(row) }, ...inner)
        : h('div.barlist-btn', null, ...inner));
  }));
}

/** Anteilsbalken – z. B. bezahlt vs. offen. */
export function SplitBar(segments, options = {}) {
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  const bar = h('div.splitbar', { role: 'img', 'aria-label': options.label || segments.map((s) => `${s.label}: ${formatMoney(s.value)}`).join(', ') });

  if (total <= 0) {
    bar.appendChild(h('span.splitbar-seg.tone-neutral', { style: { width: '100%' } }));
  } else {
    for (const s of segments) {
      const pct = (Math.max(0, s.value) / total) * 100;
      if (pct <= 0) continue;
      bar.appendChild(h('span', { class: `splitbar-seg tone-${s.tone || 'info'}`, style: { width: `${pct}%` }, title: `${s.label}: ${formatMoney(s.value)}` }));
    }
  }

  return h('div.splitbar-wrap', null,
    bar,
    h('ul.splitbar-legend', null, ...segments.map((s) => h('li.splitbar-legend-item', null,
      h('span', { class: `legend-dot tone-${s.tone || 'info'}`, 'aria-hidden': 'true' }),
      h('span.legend-label', null, s.label),
      h('span.legend-value', null, formatMoney(s.value))))));
}
