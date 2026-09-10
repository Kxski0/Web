/**
 * Vorschaubilder und Website-Analyse.
 *
 * Beides braucht Zugriff auf fremde Websites. Was der Browser dabei kann und
 * was nicht, ist klar abgegrenzt:
 *
 *  - Ein Screenshot einer fremden Seite lässt sich im Browser NICHT erzeugen.
 *    `<iframe>` wird von den meisten Seiten per `X-Frame-Options` bzw.
 *    `frame-ancestors` blockiert, und selbst ein sichtbarer iframe ließe sich
 *    wegen der Same-Origin-Policy nicht auslesen. Ein Vorschaubild kann daher
 *    nur von einem externen Screenshot-Dienst kommen – oder man lädt selbst
 *    eines hoch (das kann das Formular).
 *
 *  - Das HTML einer fremden Seite lässt sich per `fetch` ebenfalls nicht lesen
 *    (CORS). Die Analyse muss deshalb serverseitig laufen.
 *
 * Beide Funktionen sind optional und standardmäßig AUS. Die Anwendung
 * funktioniert vollständig ohne sie; fehlt die Konfiguration, erklärt die UI
 * genau, was fehlt, statt einen Fehler zu zeigen.
 */
import { normalizeUrl, hostOf } from '../core/util.js';

/**
 * Liefert die Bildquelle für eine Website oder Referenz.
 * Reihenfolge: eigenes Bild > konfigurierter Dienst > keins.
 */
export function previewUrlFor(settings, record, field = 'thumbnail') {
  const own = String(record?.[field] || '').trim();
  if (own) return own;

  const target = normalizeUrl(record?.url);
  if (!target) return '';
  if (settings.previewProvider !== 'custom') return '';

  const template = String(settings.previewTemplate || '').trim();
  if (!template) return '';
  const built = template
    .replace(/\{encoded\}/g, encodeURIComponent(target))
    .replace(/\{url\}/g, target)
    .replace(/\{host\}/g, hostOf(target));
  return normalizeUrl(built) || '';
}

/* --------------------------------------------------- Website-Analyse -- */

/**
 * Vorlage für eine Analyse von Hand.
 * Das ist der Weg, der immer funktioniert – ohne Dienst, ohne Schlüssel.
 */
export function analysisTemplate(record) {
  const host = hostOf(record?.url) || 'die Website';
  return [
    `Analyse: ${host}`,
    `Datum: ${new Date().toLocaleDateString('de-DE')}`,
    '',
    'Aufbau / Seitenstruktur:',
    '- ',
    '',
    'Hero Section:',
    '- ',
    '',
    'Navigation:',
    '- ',
    '',
    'Animationen:',
    '- ',
    '',
    'Layout und Raster:',
    '- ',
    '',
    'Typografie:',
    '- ',
    '',
    'CTA-Struktur:',
    '- ',
    '',
    'Auffällige UX-Elemente:',
    '- ',
    '',
    'Interessante Interaktionen:',
    '- ',
    '',
    'Was möchte ich übernehmen:',
    '- ',
  ].join('\n');
}

export class AnalyzeUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnalyzeUnavailableError';
  }
}

/**
 * Startet eine Analyse.
 *
 * Zwei Wege, in dieser Reihenfolge:
 *  1. Läuft die App in Wix, geht der Aufruf über die Velo-Brücke an das
 *     Backend-Web-Modul `analyzeSite`. Der API-Schlüssel liegt dort im Wix
 *     Secrets Manager und erreicht das Frontend nie.
 *  2. Steht in den Einstellungen ein eigener Endpunkt, wird dieser per POST
 *     aufgerufen. Erwartet wird JSON `{ analysis: "..." }` oder reiner Text.
 *
 * Ist keines von beidem eingerichtet, wird eine AnalyzeUnavailableError
 * geworfen – die Oberfläche bietet dann die Vorlage von Hand an.
 */
export async function analyzeWebsite({ url, settings, bridge, signal }) {
  const target = normalizeUrl(url);
  if (!target) throw new Error('Bitte zuerst eine gültige URL hinterlegen.');

  if (bridge && typeof bridge.call === 'function') {
    const result = await bridge.call('analyze', { url: target });
    const text = typeof result === 'string' ? result : result?.analysis;
    if (!text) throw new Error('Das Backend hat keine Analyse zurückgegeben.');
    return String(text);
  }

  const endpoint = normalizeUrl(settings?.analyzeEndpoint);
  if (!endpoint) {
    throw new AnalyzeUnavailableError(
      'Für die automatische Analyse ist kein Dienst hinterlegt.',
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: target }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Der Analysedienst antwortete mit Status ${response.status}.`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const text = typeof data === 'string' ? data : data.analysis || data.text || data.result;
    if (!text) throw new Error('Die Antwort des Dienstes enthielt keine Analyse.');
    return String(text);
  }
  return (await response.text()).slice(0, 20000);
}

/** Ist die automatische Analyse überhaupt eingerichtet? */
export function analyzeAvailable({ settings, bridge }) {
  if (bridge && typeof bridge.call === 'function') return true;
  return Boolean(normalizeUrl(settings?.analyzeEndpoint));
}
