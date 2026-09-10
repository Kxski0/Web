/**
 * Velo Web-Modul: Website-Analyse.
 *
 * Diese Datei gehört in Wix nach `backend/analyze.web.js`.
 *
 * Warum serverseitig
 * ------------------
 * Ein Browser kann fremde Websites nicht auslesen: `fetch` scheitert an CORS,
 * `<iframe>` an `X-Frame-Options` / `frame-ancestors`, und selbst ein
 * dargestellter iframe wäre wegen der Same-Origin-Policy nicht auswertbar.
 * Serverseitig gibt es diese Beschränkungen nicht.
 *
 * Was hier passiert
 * -----------------
 * 1. Die Seite wird geholt und ihr HTML strukturell ausgewertet: Überschriften,
 *    Navigation, Hero-Bereich, CTA-Elemente, eingebundene Schriften, Hinweise
 *    auf Animationsbibliotheken, Bild- und Abschnittsanzahl.
 *    Das ist eine reine Struktur-Zusammenfassung für den Eigenbedarf – es
 *    werden keine fremden Inhalte gespeichert oder weiterverwendet.
 * 2. Ist ein Schlüssel für einen Textdienst hinterlegt, wird die
 *    Zusammenfassung zusätzlich in Fließtext gebracht. Ohne Schlüssel bleibt es
 *    bei der strukturellen Auswertung – die Funktion arbeitet also auch ohne
 *    jeden externen Dienst.
 *
 * Der API-Schlüssel wird über den Wix Secrets Manager gelesen und verlässt den
 * Server nie.
 */
import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

/** Name des optionalen Geheimnisses im Wix Secrets Manager. */
const SUMMARY_SECRET = 'BIZDASH_SUMMARY_API_KEY';
const SUMMARY_ENDPOINT_SECRET = 'BIZDASH_SUMMARY_ENDPOINT';

const MAX_HTML = 900_000;
const TIMEOUT_MS = 15_000;

/** Nur öffentliche http(s)-Ziele – kein Zugriff auf interne Adressen (SSRF). */
function assertSafeUrl(raw) {
  let url;
  try {
    url = new URL(String(raw));
  } catch {
    throw new Error('Keine gültige Adresse.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Nur http- und https-Adressen sind erlaubt.');
  }
  const host = url.hostname.toLowerCase();
  const blocked = host === 'localhost'
    || host === '::1'
    || host.endsWith('.local')
    || host.endsWith('.internal')
    || /^127\./.test(host)
    || /^10\./.test(host)
    || /^192\.168\./.test(host)
    || /^169\.254\./.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) throw new Error('Interne Adressen können nicht analysiert werden.');
  return url.toString();
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchAll(html, regex, group = 1) {
  const out = [];
  let m = regex.exec(html);
  while (m) {
    if (m[group]) out.push(m[group]);
    m = regex.exec(html);
  }
  return out;
}

/** Strukturelle Auswertung des HTML – ohne fremde Inhalte zu übernehmen. */
function inspect(html, url) {
  const head = html.slice(0, 60_000);

  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1] || '').trim();
  const description = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i.exec(head)?.[1] || '';

  const h1 = matchAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(textOf).filter(Boolean);
  const h2 = matchAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map(textOf).filter(Boolean);
  const h3Count = (html.match(/<h3[\b >]/gi) || []).length;

  const navBlocks = matchAll(html, /<nav[^>]*>([\s\S]*?)<\/nav>/gi);
  const navLinks = navBlocks
    .flatMap((block) => matchAll(block, /<a[^>]*>([\s\S]*?)<\/a>/gi))
    .map(textOf)
    .filter((t) => t && t.length < 40);

  const sections = (html.match(/<section[\b >]/gi) || []).length;
  const images = (html.match(/<img[\b >]/gi) || []).length;
  const videos = (html.match(/<video[\b >]/gi) || []).length;
  const forms = (html.match(/<form[\b >]/gi) || []).length;
  const buttons = (html.match(/<button[\b >]/gi) || []).length;

  // Typische CTA-Formulierungen im sichtbaren Text der Buttons und Links.
  const ctaCandidates = [
    ...matchAll(html, /<a[^>]*class=["'][^"']*(btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, 2),
    ...matchAll(html, /<button[^>]*>([\s\S]*?)<\/button>/gi),
  ].map(textOf).filter((t) => t && t.length < 40);

  const fonts = [
    ...new Set([
      ...matchAll(head, /fonts\.googleapis\.com\/css2?\?family=([^"'&]+)/gi).map((f) => decodeURIComponent(f).replace(/\+/g, ' ')),
      ...matchAll(html, /@font-face[\s\S]{0,200}?font-family:\s*["']?([^"';]+)/gi),
      ...matchAll(html, /font-family:\s*["']?([A-Za-z][A-Za-z0-9 -]{2,30})/gi),
    ]),
  ].slice(0, 8);

  const libraries = [
    ['GSAP', /gsap|greensock/i],
    ['Framer Motion', /framer-motion/i],
    ['Lenis / Smooth Scroll', /lenis|locomotive-scroll|smooth-scrollbar/i],
    ['AOS', /aos\.(js|css)|data-aos=/i],
    ['Lottie', /lottie/i],
    ['Three.js / WebGL', /three\.(min\.)?js|<canvas[^>]+webgl|THREE\./i],
    ['Swiper', /swiper/i],
    ['Tailwind', /tailwind/i],
    ['React', /__NEXT_DATA__|react(-dom)?(\.production)?\.min\.js|data-reactroot/i],
    ['Vue', /vue(\.runtime)?(\.min)?\.js|data-v-[0-9a-f]{8}/i],
    ['Next.js', /\/_next\//i],
    ['Wix', /static\.parastorage\.com|wix-code|X-Wix-/i],
    ['Webflow', /webflow/i],
    ['WordPress', /wp-content|wp-includes/i],
    ['Shopify', /cdn\.shopify\.com/i],
  ].filter(([, re]) => re.test(html)).map(([name]) => name);

  const cssAnimation = /@keyframes|animation:|transition:|transform:\s*translate|scroll-behavior:\s*smooth/i.test(html);
  const scrollHints = /IntersectionObserver|data-scroll|scroll-trigger|ScrollTrigger|sticky/i.test(html);

  const viewport = /<meta[^>]+name=["']viewport["']/i.test(head);
  const heroText = textOf(html.slice(0, 20_000)).slice(0, 400);

  return {
    url,
    title,
    description,
    h1,
    h2: h2.slice(0, 12),
    h3Count,
    navLinks: [...new Set(navLinks)].slice(0, 15),
    sections,
    images,
    videos,
    forms,
    buttons,
    ctas: [...new Set(ctaCandidates)].slice(0, 10),
    fonts,
    libraries,
    cssAnimation,
    scrollHints,
    viewport,
    heroText,
  };
}

/** Formt die Auswertung in die gewohnte Gliederung. */
function toReport(info) {
  const line = (label, value) => `- ${label}: ${value || '—'}`;
  const list = (items) => (items.length ? items.map((i) => `  - ${i}`).join('\n') : '  - —');

  return [
    `Analyse: ${info.url}`,
    `Datum: ${new Date().toLocaleDateString('de-DE')}`,
    '',
    'Aufbau / Seitenstruktur:',
    line('Seitentitel', info.title),
    line('Beschreibung', info.description),
    line('Abschnitte (<section>)', String(info.sections)),
    line('Überschriften', `${info.h1.length}x H1, ${info.h2.length}x H2, ${info.h3Count}x H3`),
    line('Medien', `${info.images} Bilder, ${info.videos} Videos`),
    line('Formulare', String(info.forms)),
    '',
    'Hero Section:',
    line('H1', info.h1[0] || '—'),
    `- Einstiegstext (gekürzt): ${info.heroText.slice(0, 220)}…`,
    '',
    'Navigation:',
    line('Einträge', String(info.navLinks.length)),
    list(info.navLinks),
    '',
    'Animationen:',
    line('Bibliotheken', info.libraries.join(', ')),
    line('CSS-Animationen erkennbar', info.cssAnimation ? 'ja' : 'nein'),
    line('Scroll-gesteuerte Effekte erkennbar', info.scrollHints ? 'ja' : 'nein'),
    '',
    'Layout und Raster:',
    line('Abschnitte', String(info.sections)),
    line('Responsive (Viewport-Meta)', info.viewport ? 'ja' : 'nein'),
    '',
    'Typografie:',
    line('Erkannte Schriften', info.fonts.join(', ')),
    '',
    'CTA-Struktur:',
    line('Anzahl Buttons', String(info.buttons)),
    'Beschriftungen:',
    list(info.ctas),
    '',
    'Auffällige UX-Elemente:',
    line('Technik-Stack', info.libraries.join(', ')),
    '',
    'Interessante Interaktionen:',
    '- (nach eigenem Besuch ergänzen)',
    '',
    'Was möchte ich übernehmen:',
    '- ',
  ].join('\n');
}

/**
 * Optionaler zweiter Schritt: Zusammenfassung in Fließtext.
 * Nur aktiv, wenn im Secrets Manager sowohl Endpunkt als auch Schlüssel liegen.
 * Der Endpunkt bekommt die STRUKTURDATEN, nicht das fremde HTML.
 */
async function summarize(info, report) {
  let apiKey;
  let endpoint;
  try {
    apiKey = await getSecret(SUMMARY_SECRET);
    endpoint = await getSecret(SUMMARY_ENDPOINT_SECRET);
  } catch {
    return null; // Kein Geheimnis hinterlegt – das ist der Normalfall.
  }
  if (!apiKey || !endpoint) return null;

  const response = await fetch(endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ structure: info, report }),
  });
  if (!response.ok) return null;

  const data = await response.json().catch(() => null);
  const text = data?.analysis || data?.text || data?.result;
  return typeof text === 'string' && text.trim() ? text : null;
}

/**
 * Analysiert eine URL und gibt den Bericht als Text zurück.
 * Gespeichert wird er im Frontend am jeweiligen Referenzprojekt.
 */
export const analyzeSite = webMethod(Permissions.Admin, async (rawUrl) => {
  const url = assertSafeUrl(rawUrl);

  const response = await fetch(url, {
    method: 'get',
    headers: {
      // Ehrliche Kennzeichnung statt Tarnung als Browser.
      'User-Agent': 'BizDashboard/1.0 (persoenliche Referenzsammlung)',
      Accept: 'text/html,application/xhtml+xml',
    },
    timeout: TIMEOUT_MS,
  });

  if (!response.ok) {
    throw new Error(`Die Seite antwortete mit Status ${response.status}.`);
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('html')) {
    throw new Error('Unter dieser Adresse liegt kein HTML-Dokument.');
  }

  const html = (await response.text()).slice(0, MAX_HTML);
  const info = inspect(html, url);
  const report = toReport(info);

  const summarized = await summarize(info, report).catch(() => null);
  return summarized ? `${summarized}\n\n---\n\n${report}` : report;
});
