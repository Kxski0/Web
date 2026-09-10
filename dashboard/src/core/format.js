/**
 * Formatierung und Datumsrechnung – durchgehend de-DE und EUR.
 *
 * Datumswerte werden im gesamten Projekt als ISO-Tagesstring `YYYY-MM-DD`
 * gespeichert. Das ist genau das Format, das `<input type="date">` liefert und
 * erwartet, es sortiert lexikographisch korrekt und hat keine Zeitzonenfallen.
 * Zeitstempel (createdAt/updatedAt, Aktivitäten) sind volle ISO-Strings.
 */

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

const money0 = new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0,
});
const money2 = new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const num = new Intl.NumberFormat('de-DE');

/**
 * Beträge. Cent werden gezeigt, sobald welche vorhanden sind, sonst weggelassen.
 *
 * Bewusst ohne "kompakte" Variante, die auf ganze Euro rundet: ein Auftragswert
 * von 8.400,50 € erschien so auf der Kachel als 8.401 €, während die Tabelle
 * daneben den exakten Wert zeigte. Zwei verschiedene Zahlen für denselben
 * Betrag sind schlimmer als zwei Nachkommastellen.
 */
export function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return money2.format(0);
  return Number.isInteger(n) ? money0.format(n) : money2.format(n);
}

export function formatNumber(value) {
  const n = Number(value);
  return num.format(Number.isFinite(n) ? n : 0);
}

export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0 %';
  return `${num.format(Math.round(n * 10) / 10)} %`;
}

/**
 * Liest deutsche wie englische Zahleneingaben: "1.250,50", "1250.5", "1 250 €".
 * Gibt null zurück, wenn nichts Sinnvolles übrig bleibt.
 */
export function parseMoney(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  let s = String(input ?? '').trim();
  if (!s) return null;
  s = s.replace(/[^\d,.-]/g, '');
  if (!s || s === '-') return null;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > -1 && lastComma > lastDot) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (lastComma > -1) {
    s = s.replace(/,/g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/* ---------------------------------------------------------------- Datum -- */

/** Heutiger Tag als `YYYY-MM-DD` in lokaler Zeit (nicht UTC – sonst Datumssprünge). */
export function today() {
  return toDayString(new Date());
}

export function toDayString(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Wandelt `YYYY-MM-DD` in ein lokales Date um (Mitternacht). */
function fromDayString(day) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day ?? '').slice(0, 10));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Akzeptiert Tagesstring oder vollen ISO-Zeitstempel und liefert den Tagesstring. */
export function asDay(value) {
  if (!value) return '';
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return toDayString(new Date(s));
}

export function formatDate(value) {
  const day = asDay(value);
  const d = fromDayString(day);
  if (!d) return '—';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** "vor 3 Tagen" – für den Aktivitätsfeed. */
export function formatRelative(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  if (days < 7) return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  return formatDate(d);
}

/** Ganze Tage von heute bis zum Zieltag; negativ heißt überfällig. */
export function daysUntil(day) {
  const target = fromDayString(asDay(day));
  if (!target) return null;
  const now = fromDayString(today());
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function monthKey(value) {
  const day = asDay(value);
  return day ? day.slice(0, 7) : '';
}

export function monthLabel(key, { short = false } = {}) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(key ?? ''));
  if (!m) return '—';
  const names = short ? MONTHS_SHORT : MONTHS;
  return `${names[Number(m[2]) - 1]} ${m[1]}`;
}

/** Letzte n Monatsschlüssel inklusive des aktuellen, aufsteigend. */
export function lastMonths(n, from = new Date()) {
  const out = [];
  const d = new Date(from.getFullYear(), from.getMonth(), 1);
  for (let i = n - 1; i >= 0; i -= 1) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

/**
 * Zeiträume für die Finanzansicht. Liefert immer `{ from, to }` als
 * Tagesstrings; `from`/`to` sind inklusiv, leere Strings heißen "unbegrenzt".
 */
export const PERIODS = [
  { id: 'thisMonth', label: 'Dieser Monat' },
  { id: 'lastMonth', label: 'Letzter Monat' },
  { id: 'thisYear', label: 'Dieses Jahr' },
  { id: 'lastYear', label: 'Letztes Jahr' },
  { id: 'all', label: 'Gesamt' },
  { id: 'custom', label: 'Benutzerdefiniert' },
];

export function periodRange(id, custom = {}) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = (yy, mm) => toDayString(new Date(yy, mm, 1));
  const last = (yy, mm) => toDayString(new Date(yy, mm + 1, 0));
  switch (id) {
    case 'thisMonth': return { from: first(y, m), to: last(y, m) };
    case 'lastMonth': return { from: first(y, m - 1), to: last(y, m - 1) };
    case 'thisYear': return { from: `${y}-01-01`, to: `${y}-12-31` };
    case 'lastYear': return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
    case 'custom': return { from: asDay(custom.from) || '', to: asDay(custom.to) || '' };
    default: return { from: '', to: '' };
  }
}

/** Liegt ein Tagesstring im (inklusiven) Zeitraum? Leere Grenzen sind offen. */
export function inRange(day, range) {
  const d = asDay(day);
  if (!d) return false;
  if (range.from && d < range.from) return false;
  if (range.to && d > range.to) return false;
  return true;
}
