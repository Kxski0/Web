/**
 * Kleine, abhängigkeitsfreie Helfer.
 *
 * Alles hier ist bewusst synchron und ohne Seiteneffekte, damit es in jeder
 * Umgebung läuft: Browser, Wix Custom Element, Wix Velo Backend (Node).
 */

/** Kryptographisch zufällige ID, mit Fallback für alte WebViews. */
export function uid() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  if (c && typeof c.getRandomValues === 'function') {
    const b = c.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Flache Kopie mit entfernten `undefined`-Werten – hält gespeicherte Datensätze sauber. */
export function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

export function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function debounce(fn, wait = 200) {
  let t = null;
  const wrapped = (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn(...args);
    }, wait);
  };
  wrapped.cancel = () => {
    if (t) clearTimeout(t);
    t = null;
  };
  return wrapped;
}

export function sum(list, pick = (x) => x) {
  let total = 0;
  for (const item of list) {
    const n = Number(pick(item));
    if (Number.isFinite(n)) total += n;
  }
  return total;
}

export function groupBy(list, pick) {
  const map = new Map();
  for (const item of list) {
    const key = pick(item);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
}

/**
 * Sortiert eine Kopie der Liste.
 * `dir` ist 1 für aufsteigend, -1 für absteigend. Leere Werte landen immer
 * am Ende, unabhängig von der Richtung – sonst verdecken sie die echten Daten.
 */
export function sortBy(list, pick, dir = 1) {
  return [...list].sort((a, b) => {
    const av = pick(a);
    const bv = pick(b);
    const aEmpty = av === null || av === undefined || av === '';
    const bEmpty = bv === null || bv === undefined || bv === '';
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv), 'de', { numeric: true, sensitivity: 'base' }) * dir;
  });
}

/** Diakritika-unempfindliche Kleinschreibung für Suche und Vergleiche. */
export function fold(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');
}

/** Trennt eine Kommaliste in getrimmte, eindeutige Einträge. */
export function splitList(value) {
  if (Array.isArray(value)) value = value.join(',');
  return String(value ?? '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s, i, a) => a.indexOf(s) === i);
}

/**
 * Normalisiert eine Nutzereingabe zu einer absoluten http(s)-URL.
 * Gibt null zurück, wenn daraus keine gültige URL wird – aufrufende Stellen
 * dürfen niemals ungeprüft in ein href schreiben (javascript:-Schutz).
 */
export function normalizeUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  return url.toString();
}

export function hostOf(value) {
  const url = normalizeUrl(value);
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Erste Buchstaben für Avatar-/Platzhalterkacheln. */
export function initials(value) {
  const parts = String(value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '–';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
