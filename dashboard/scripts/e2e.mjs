/**
 * End-to-End-Prüfung im echten Browser (Chromium via Playwright).
 *
 * Geprüft wird das, was die Anwendung ausmacht:
 *   - startet ohne Konsolenfehler
 *   - jede Ansicht lässt sich öffnen
 *   - Anlegen, Bearbeiten und Löschen funktionieren über die Oberfläche
 *   - Daten überleben einen Neustart (Persistenz)
 *   - Kennzahlen stimmen mit den erfassten Werten überein
 *   - Filter, Sortierung und globale Suche greifen
 *   - iPad- und Telefondarstellung ohne waagerechtes Scrollen
 *   - alle Links zeigen auf echte Ziele
 *
 * Aufruf: node dashboard/scripts/e2e.mjs [--headed] [--keep]
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const headed = process.argv.includes('--headed');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.map': 'application/json; charset=utf-8',
};

/** Statischer Server für dashboard/ – die App läuft dabei als echte Website. */
function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let filePath = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname === '/' || url.pathname === '') filePath = path.join(root, 'index.html');
    // Pfadausbruch verhindern.
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    if (!existsSync(filePath)) {
      res.writeHead(404).end('not found');
      return;
    }
    try {
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/* ------------------------------------------------------------- Runner -- */

const results = [];
let failed = 0;

/**
 * Schliesst einen offenen Dialog bzw. die globale Suche. Ohne das wuerde ein
 * einzelner Fehlschlag alle folgenden Schritte blockieren, weil das Overlay
 * jeden Klick abfaengt - und der Bericht waere unbrauchbar.
 */
async function dismissOverlays(page) {
  for (let i = 0; i < 4; i += 1) {
    const open = await page.locator('.modal-overlay, .gsearch-overlay').count();
    if (!open) return;
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay, .gsearch-overlay').forEach((el) => el.remove());
    document.body.style.overflow = '';
  });
}

async function check(name, fn) {
  try {
    await dismissOverlays(page);
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed += 1;
    results.push({ name, ok: false, error: err });
    console.log(`  ✗ ${name}`);
    console.log(`      ${String(err.message || err).split('\n')[0]}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Vereinheitlicht Leerzeichen - Intl nutzt vor "€" ein geschuetztes. */
function norm(value) {
  return String(value).replace(/[\u00a0\u202f\u2009]/g, ' ').replace(/\s+/g, ' ').trim();
}

function assertEqual(actual, expected, message) {
  if (norm(actual) !== norm(expected)) {
    throw new Error(`${message}\n      erwartet: ${expected}\n      erhalten: ${actual}`);
  }
}

/* ------------------------------------------------------------ Helfer -- */

/**
 * Öffnet einen Navigationspunkt.
 * Unterhalb von 1024px liegt die Sidebar ausserhalb des Bildschirms - dann wird
 * erst das Menue aufgeklappt, genau wie ein Nutzer es tun wuerde.
 */
async function goto(page, label) {
  await dismissOverlays(page);
  const item = page.locator(`.nav-item:has-text("${label}")`).first();
  await item.waitFor({ state: 'visible' });
  let box = await item.boundingBox();
  if (!box || box.x < 0) {
    // Nach einem Wechsel der Bildschirmgroesse zieht das Layout kurz nach.
    await page.waitForTimeout(300);
    box = await item.boundingBox();
  }
  if (!box || box.x < 0) {
    await page.locator('.topbar .btn-icon').first().click();
    await page.waitForTimeout(300);
  }
  await item.click();
  await page.waitForTimeout(220);
}

/** Füllt ein Formularfeld im offenen Dialog anhand seiner Beschriftung. */
async function fill(page, label, value) {
  const field = page.locator('.modal .field', { has: page.locator(`label:text-is("${label}")`) }).first();
  const control = field.locator('input, textarea, select').first();
  const tag = await control.evaluate((el) => el.tagName);
  if (tag === 'SELECT') await control.selectOption({ label: value });
  else await control.fill(value);
}

/** Wählt in einem Referenz-/Auswahlfeld über den sichtbaren Text. */
async function select(page, label, optionText) {
  const field = page.locator('.modal .field', { has: page.locator(`label:text-is("${label}")`) }).first();
  await field.locator('select').first().selectOption({ label: optionText });
}

async function submitDialog(page, buttonText = 'Speichern') {
  await page.locator(`.modal-foot .btn:has-text("${buttonText}")`).click();
  await page.waitForSelector('.modal', { state: 'detached', timeout: 5000 });
}

/**
 * Wartet, bis die Seitenueberschrift den erwarteten Text traegt.
 * Ohne das liest der Test die alte Ueberschrift, weil `.page-title` waehrend
 * des Neuzeichnens kurz noch mit dem vorigen Inhalt im DOM steht.
 */
async function waitForTitle(page, expected, message) {
  try {
    await page.locator(`.page-title:text-is("${expected}")`).waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    const actual = await page.locator('.page-title').first().innerText().catch(() => '(keine)');
    throw new Error(`${message}\n      erwartet: ${expected}\n      erhalten: ${actual}`);
  }
}

/** Kennzahl-Kachel über ihre Beschriftung auslesen. */
async function statValue(page, label) {
  return page.locator('.stat', { has: page.locator(`.stat-label:text-is("${label}")`) })
    .first().locator('.stat-value').innerText();
}

/* -------------------------------------------------------------- Lauf -- */

const { server, port } = await serve();
const base = `http://127.0.0.1:${port}`;
/**
 * In dieser Umgebung liegt Chromium unter einem festen Pfad. Ist der gesetzt
 * bzw. vorhanden, wird er genutzt; sonst greift Playwrights eigene Verwaltung.
 */
const executablePath = process.env.CHROMIUM_PATH
  || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const browser = await chromium.launch({
  headless: !headed,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

/** iPad Pro 11" quer – die Hauptzielgröße. */
const context = await browser.newContext({
  viewport: { width: 1194, height: 834 },
  deviceScaleFactor: 2,
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
  hasTouch: true,
});

// Kurze Standardwartezeit: ein fehlgeschlagener Schritt soll sofort auffallen
// und nicht 30 Sekunden lang den Lauf blockieren.
context.setDefaultTimeout(6000);

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

const page = await context.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));
page.on('requestfailed', (req) => failedRequests.push(`${req.url()} – ${req.failure()?.errorText}`));

console.log(`\nE2E gegen ${base}\n`);

await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
await page.waitForSelector('.app', { timeout: 10000 });

/* --- 1. Start --------------------------------------------------------- */

console.log('Start und Navigation');

await check('App startet und zeigt das Dashboard', async () => {
  await page.waitForSelector('.page-title');
  assert(await page.locator('.sidebar').isVisible(), 'Sidebar fehlt');
  assert(await page.locator('.stat').count() >= 9, 'Es fehlen Kennzahlkacheln');
});

await check('Startzustand ist leer – keine Mock-Daten', async () => {
  assertEqual(await statValue(page, 'Aktuelle Aufträge'), '0', 'Aufträge sollten leer starten');
  assert(await page.locator('.notice:has-text("Noch keine Daten")').isVisible(), 'Hinweis auf leeren Stand fehlt');
});

await check('Alle Navigationspunkte lassen sich öffnen', async () => {
  const labels = ['Aufträge', 'Kunden', 'Rechnungen', 'Projekte', 'Aufgaben',
    'Meine Websites', 'Inspiration', 'Finanzen', 'Aktivität', 'Einstellungen', 'Dashboard'];
  for (const label of labels) {
    await goto(page, label);
    const title = await page.locator('.page-title').innerText();
    assert(title.length > 0, `Ansicht "${label}" hat keinen Titel`);
    assert(await page.locator('.view').count() === 1, `Ansicht "${label}" wurde nicht gezeichnet`);
  }
});

/* --- 2. Kunden anlegen ------------------------------------------------ */

console.log('\nDatenerfassung');

await check('Kunde lässt sich über die Oberfläche anlegen', async () => {
  await goto(page, 'Kunden');
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Firmenname', 'Nordlicht Bau GmbH');
  await fill(page, 'Ansprechpartner', 'Max Müller');
  await fill(page, 'E-Mail', 'max@nordlicht.example');
  await fill(page, 'Telefonnummer', '+49 40 123456');
  await fill(page, 'Ort', 'Hamburg');
  await submitDialog(page, 'Anlegen');
  assert(await page.locator('.table td:has-text("Nordlicht Bau GmbH")').first().isVisible(), 'Kunde erscheint nicht in der Liste');
});

await check('Pflichtfeld wird geprüft, statt fehlerhaft zu speichern', async () => {
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Anlegen")').click();
  await page.waitForTimeout(200);
  assert(await page.locator('.modal').isVisible(), 'Dialog wurde trotz Fehler geschlossen');
  const error = await page.locator('.field-error:visible').first().innerText();
  assert(error.includes('erforderlich'), `Unerwartete Fehlermeldung: ${error}`);
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
});

await check('Ungültige E-Mail wird abgelehnt', async () => {
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Firmenname', 'Testfirma');
  await fill(page, 'E-Mail', 'keine-mail');
  await page.locator('.modal-foot .btn:has-text("Anlegen")').click();
  await page.waitForTimeout(200);
  assert(await page.locator('.modal').isVisible(), 'Dialog wurde trotz ungültiger E-Mail geschlossen');
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
});

await check('Zweiter Kunde für Vergleichswerte', async () => {
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Firmenname', 'Praxis Lehmann');
  await fill(page, 'Ansprechpartner', 'Anja Lehmann');
  await submitDialog(page, 'Anlegen');
  assertEqual(await page.locator('.table tbody tr').count(), 2, 'Es sollten zwei Kunden gelistet sein');
});

await check('Auftrag mit deutschem Betragsformat anlegen', async () => {
  await goto(page, 'Aufträge');
  await page.locator('.page-actions .btn:has-text("Auftrag anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Projektname', 'Website Relaunch');
  await select(page, 'Kunde', 'Nordlicht Bau GmbH');
  await fill(page, 'Auftragswert', '8.400,50');
  await select(page, 'Status', 'In Bearbeitung');
  await submitDialog(page, 'Anlegen');
  const cell = await page.locator('.table tbody tr').first().innerText();
  assert(cell.includes('8.400,50'), `Betrag falsch formatiert: ${cell}`);
});

await check('Zweiter Auftrag, abgeschlossen', async () => {
  await page.locator('.page-actions .btn:has-text("Auftrag anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Projektname', 'Praxisseite');
  await select(page, 'Kunde', 'Praxis Lehmann');
  await fill(page, 'Auftragswert', '5200');
  await select(page, 'Status', 'Abgeschlossen');
  await submitDialog(page, 'Anlegen');
  assertEqual(await page.locator('.table tbody tr').count(), 2, 'Es sollten zwei Aufträge gelistet sein');
});

/* --- 3. Rechnungen und Kennzahlen ------------------------------------- */

console.log('\nRechnungen und Berechnungen');

/**
 * Genau das Beispiel aus der Anforderung:
 *   500 bezahlt, 800 offen, 1200 überfällig  ->  Offen 2.000, Bezahlt 500.
 */
await check('Drei Rechnungen anlegen (Beispiel aus der Anforderung)', async () => {
  await goto(page, 'Rechnungen');
  const iso = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const create = async (number, customer, amount, status, issue, due) => {
    await page.locator('.page-actions .btn:has-text("Rechnung anlegen")').click();
    await page.waitForSelector('.modal');
    await fill(page, 'Rechnungsnummer', number);
    await select(page, 'Kunde', customer);
    await fill(page, 'Betrag', amount);
    await select(page, 'Status', status);
    if (issue) await fill(page, 'Rechnungsdatum', issue);
    if (due) await fill(page, 'Fälligkeitsdatum', due);
    await submitDialog(page, 'Anlegen');
    // Bleibt der Dialog stehen, hat die Validierung zugeschlagen - dann soll
    // die Meldung im Bericht stehen und nicht ein Folgefehler.
    const stuck = await page.locator('.field-error:visible').allInnerTexts();
    if (stuck.length) throw new Error(`Rechnung ${number} abgelehnt: ${stuck.join(' ')}`);
  };

  await create('2026-001', 'Nordlicht Bau GmbH', '500', 'Bezahlt', iso(-20), iso(-6));
  await create('2026-002', 'Nordlicht Bau GmbH', '800', 'Offen', iso(-3), iso(14));
  await create('2026-003', 'Praxis Lehmann', '1200', 'Offen', iso(-40), iso(-5));

  assertEqual(await page.locator('.table tbody tr').count(), 3, 'Es sollten drei Rechnungen gelistet sein');
});

await check('Überfällige Rechnung wird automatisch markiert', async () => {
  const row = page.locator('.table tbody tr', { has: page.locator('td:has-text("2026-003")') }).first();
  const text = await row.innerText();
  assert(text.includes('Überfällig'), `Rechnung 2026-003 sollte überfällig sein, ist aber: ${text}`);
});

await check('Rechnungsnummer bleibt eindeutig', async () => {
  await page.locator('.page-actions .btn:has-text("Rechnung anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Rechnungsnummer', '2026-001');
  await select(page, 'Kunde', 'Nordlicht Bau GmbH');
  await fill(page, 'Betrag', '10');
  await page.locator('.modal-foot .btn:has-text("Anlegen")').click();
  await page.waitForTimeout(200);
  assert(await page.locator('.modal').isVisible(), 'Doppelte Rechnungsnummer wurde akzeptiert');
  const err = await page.locator('.field-error:visible').first().innerText();
  assert(err.includes('bereits vergeben'), `Unerwartete Meldung: ${err}`);
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
});

await check('Dashboard rechnet Offen = 2.000 € und Bezahlt = 500 €', async () => {
  await goto(page, 'Dashboard');
  assertEqual(await statValue(page, 'Ausstehender Betrag'), '2.000 €', 'Ausstehender Betrag falsch');
  assertEqual(await statValue(page, 'Offene Rechnungen'), '2', 'Anzahl offener Rechnungen falsch');
  assertEqual(await statValue(page, 'Bereits bezahlte Rechnungen'), '1', 'Anzahl bezahlter Rechnungen falsch');
  assertEqual(await statValue(page, 'Gesamtumsatz'), '500 €', 'Gesamtumsatz falsch');
});

await check('Auftragskennzahlen stimmen', async () => {
  assertEqual(await statValue(page, 'Aktuelle Aufträge'), '1', 'Aktuelle Aufträge falsch');
  assertEqual(await statValue(page, 'Abgeschlossene Aufträge'), '1', 'Abgeschlossene Aufträge falsch');
  assertEqual(await statValue(page, 'Offene Aufträge'), '0', 'Offene Aufträge falsch');
});

await check('Umsatz dieses Monats entspricht der bezahlten Rechnung', async () => {
  assertEqual(await statValue(page, 'Umsatz dieses Monats'), '500 €', 'Monatsumsatz falsch');
  assertEqual(await statValue(page, 'Umsatz dieses Jahres'), '500 €', 'Jahresumsatz falsch');
});

/* --- 4. Beziehungen --------------------------------------------------- */

console.log('\nBeziehungen und Detailseiten');

await check('Kundenseite zeigt Umsatz, Aufträge und Rechnungen', async () => {
  await goto(page, 'Kunden');
  await page.locator('.table tbody tr', { has: page.locator('td:has-text("Nordlicht Bau GmbH")') }).first().click();
  await waitForTitle(page, 'Nordlicht Bau GmbH', 'Falsche Kundenseite');
  assertEqual(await statValue(page, 'Umsatz mit diesem Kunden'), '500 €', 'Kundenumsatz falsch');
  assertEqual(await statValue(page, 'Aufträge'), '1', 'Auftragsanzahl falsch');
  assertEqual(await statValue(page, 'Offene Rechnungen'), '800 €', 'Offener Betrag falsch');
  assertEqual(await statValue(page, 'Bezahlte Rechnungen'), '500 €', 'Bezahlter Betrag falsch');
  assert(await page.locator('.card:has(.card-title:text-is("Rechnungen")) .subhead:has-text("Noch offen")').isVisible(),
    'Abschnitt für offene Rechnungen fehlt');
  assert(await page.locator('.card:has(.card-title:text-is("Rechnungen")) .subhead:has-text("Bereits bezahlt")').isVisible(),
    'Abschnitt für bezahlte Rechnungen fehlt');
});

await check('Sprung vom Kunden zum Auftrag funktioniert', async () => {
  await page.locator('.card:has(.card-title:text-is("Aufträge")) tbody tr').first().click();
  await waitForTitle(page, 'Website Relaunch', 'Auftragsseite nicht geöffnet');
});

await check('Auftragsseite verknüpft Rechnungen und rechnet ab', async () => {
  assertEqual(await statValue(page, 'Auftragswert'), '8.400,50 €', 'Auftragswert falsch');
  assert(await page.locator('.card-title:text-is("Rechnungen zu diesem Auftrag")').isVisible(), 'Rechnungskarte fehlt');
});

await check('Zurück-Link führt zur Liste', async () => {
  await page.locator('.back-link').click();
  await waitForTitle(page, 'Aufträge', 'Zurück-Navigation fehlgeschlagen');
});

/* --- 5. Bearbeiten, Filter, Suche ------------------------------------- */

console.log('\nBearbeiten, Filter, Suche');

await check('Auftrag lässt sich bearbeiten', async () => {
  const row = page.locator('.table tbody tr', { has: page.locator('td:has-text("Website Relaunch")') }).first();
  await row.locator('.row-actions .btn').first().click();
  await page.waitForSelector('.modal');
  await fill(page, 'Projektname', 'Website Relaunch 2026');
  await submitDialog(page, 'Speichern');
  assert(await page.locator('td:has-text("Website Relaunch 2026")').first().isVisible(), 'Änderung nicht übernommen');
});

await check('Statusfilter zeigt nur Aufträge in Bearbeitung', async () => {
  const filter = page.locator('.toolbar-field', { has: page.locator('.toolbar-field-label:text-is("Status")') })
    .locator('select');
  await filter.selectOption({ label: 'In Bearbeitung' });
  await page.waitForTimeout(200);
  assertEqual(await page.locator('.table tbody tr').count(), 1, 'Filter liefert die falsche Anzahl');
  const text = await page.locator('.table tbody tr').first().innerText();
  assert(text.includes('Website Relaunch 2026'), `Falscher Auftrag gefiltert: ${text}`);
});

await check('Filter zurücksetzen stellt die volle Liste her', async () => {
  await page.locator('.toolbar .btn:has-text("Filter zurücksetzen")').click();
  await page.waitForTimeout(200);
  assertEqual(await page.locator('.table tbody tr').count(), 2, 'Zurücksetzen hat nicht gegriffen');
});

await check('Textsuche in der Liste greift', async () => {
  await page.locator('.toolbar-search-input').fill('Praxis');
  await page.waitForTimeout(350);
  assertEqual(await page.locator('.table tbody tr').count(), 1, 'Suche liefert die falsche Anzahl');
  await page.locator('.toolbar-search-input').fill('');
  await page.waitForTimeout(350);
});

await check('Sortierung nach Auftragswert funktioniert', async () => {
  await page.locator('.th-btn:has-text("Auftragswert")').click();
  await page.waitForTimeout(200);
  const first = await page.locator('.table tbody tr').first().innerText();
  assert(first.includes('5.200'), `Aufsteigend sollte 5.200 zuerst stehen, war: ${first}`);
  await page.locator('.th-btn:has-text("Auftragswert")').click();
  await page.waitForTimeout(200);
  const desc = await page.locator('.table tbody tr').first().innerText();
  assert(desc.includes('8.400'), `Absteigend sollte 8.400 zuerst stehen, war: ${desc}`);
});

await check('Globale Suche findet Kunde und verknüpfte Datensätze', async () => {
  await page.locator('.topbar-search').click();
  await page.waitForSelector('.gsearch');
  await page.locator('.gsearch-input').fill('Max Müller');
  await page.waitForTimeout(350);
  // Die Ueberschriften werden per CSS in Grossbuchstaben gesetzt.
  const groups = (await page.locator('.gsearch-group').allInnerTexts()).map((g) => g.toLowerCase());
  for (const expected of ['kunden', 'aufträge', 'rechnungen']) {
    assert(groups.some((g) => g.includes(expected)), `${expected} fehlt in den Treffern: ${groups}`);
  }
});

await check('Treffer in der globalen Suche öffnet den Datensatz', async () => {
  await page.locator('.topbar-search').click();
  await page.waitForSelector('.gsearch');
  await page.locator('.gsearch-input').fill('Nordlicht Bau');
  await page.waitForTimeout(350);
  await page.locator('.gsearch-item').first().click();
  await page.waitForTimeout(250);
  assert(await page.locator('.gsearch').count() === 0, 'Suche wurde nicht geschlossen');
  await waitForTitle(page, 'Nordlicht Bau GmbH', 'Falscher Datensatz geöffnet');
});

/* --- 6. Aufgaben, Projekte, Websites, Inspiration --------------------- */

console.log('\nWeitere Bereiche');

await check('Projekt anlegen', async () => {
  await goto(page, 'Projekte');
  await page.locator('.page-actions .btn:has-text("Projekt anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Projektname', 'Eigenes Portfolio');
  await select(page, 'Priorität', 'Hoch');
  await submitDialog(page, 'Anlegen');
  assert(await page.locator('td:has-text("Eigenes Portfolio")').first().isVisible(), 'Projekt fehlt in der Liste');
});

await check('Aufgabe anlegen und mit Projekt verknüpfen', async () => {
  await goto(page, 'Aufgaben');
  await page.locator('.page-actions .btn:has-text("Aufgabe anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Titel', 'Referenzen sammeln');
  await select(page, 'Projekt', 'Eigenes Portfolio');
  await select(page, 'Priorität', 'Dringend');
  await submitDialog(page, 'Anlegen');
  const row = await page.locator('.table tbody tr').first().innerText();
  assert(row.includes('Referenzen sammeln') && row.includes('Eigenes Portfolio'), `Verknüpfung fehlt: ${row}`);
});

await check('Aufgabe lässt sich mit einem Tipp abhaken', async () => {
  await page.locator('.table tbody .task-check').first().click();
  await page.waitForTimeout(250);
  assertEqual(await statValue(page, 'Erledigt'), '1', 'Aufgabe wurde nicht als erledigt gezählt');
});

await check('Board-Ansicht der Aufgaben funktioniert', async () => {
  await page.locator('.segmented-btn:has-text("Board")').click();
  await page.waitForTimeout(250);
  assertEqual(await page.locator('.board-col').count(), 3, 'Board sollte drei Spalten haben');
  await page.locator('.segmented-btn:has-text("Liste")').click();
  await page.waitForTimeout(200);
});

await check('Website anlegen; URL ist ein echter externer Link', async () => {
  await goto(page, 'Meine Websites');
  await page.locator('.page-actions .btn:has-text("Website anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Projektname', 'nordlicht-bau.example');
  await select(page, 'Kunde', 'Nordlicht Bau GmbH');
  await fill(page, 'URL', 'nordlicht-bau.example');
  await fill(page, 'Verwendete Technologien', 'Wix, Velo');
  await submitDialog(page, 'Anlegen');

  const link = page.locator('.tile a:has-text("Website öffnen")').first();
  assertEqual(await link.getAttribute('href'), 'https://nordlicht-bau.example/', 'URL wurde nicht normalisiert');
  assertEqual(await link.getAttribute('target'), '_blank', 'Link öffnet nicht in neuem Tab');
  assert((await link.getAttribute('rel')).includes('noopener'), 'rel=noopener fehlt');
});

await check('Referenz anlegen und Analysedialog öffnen', async () => {
  await goto(page, 'Inspiration');
  await page.locator('.page-actions .btn:has-text("Referenz anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Name', 'Stripe');
  await fill(page, 'URL', 'https://stripe.com');
  await select(page, 'Kategorie', 'SaaS');
  await fill(page, 'Tags', 'gradient, klar');
  await submitDialog(page, 'Anlegen');

  await page.locator('.tile-title:has-text("Stripe")').click();
  await page.waitForTimeout(200);
  await page.locator('.page-actions .btn:has-text("Website analysieren")').click();
  await page.waitForSelector('.modal');
  assert(await page.locator('.notice:has-text("nicht eingerichtet")').isVisible(),
    'Erklärung zur fehlenden Analysefunktion fehlt');

  await page.locator('.modal .btn:has-text("Vorlage einfügen")').click();
  const text = await page.locator('.analyze-text').inputValue();
  for (const heading of ['Hero Section', 'Navigation', 'Animationen', 'Typografie', 'CTA-Struktur']) {
    assert(text.includes(heading), `Vorlage ohne Abschnitt "${heading}"`);
  }
  await page.locator('.modal-foot .btn:has-text("Analyse speichern")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  assert(await page.locator('.analysis-text').isVisible(), 'Analyse wurde nicht gespeichert');
});

await check('Kategorie- und Tagfilter der Inspiration greifen', async () => {
  await goto(page, 'Inspiration');
  const tagFilter = page.locator('.toolbar-field', { has: page.locator('.toolbar-field-label:text-is("Tag")') })
    .locator('select');
  await tagFilter.selectOption({ index: 1 });
  await page.waitForTimeout(250);
  assertEqual(await page.locator('.tile').count(), 1, 'Tagfilter liefert die falsche Anzahl');
});

/* --- 7. Finanzen ------------------------------------------------------ */

console.log('\nFinanzen');

await check('Finanzansicht zeigt konsistente Werte', async () => {
  await goto(page, 'Finanzen');
  assertEqual(await statValue(page, 'Gesamtumsatz'), '500 €', 'Gesamtumsatz falsch');
  assertEqual(await statValue(page, 'Offene Forderungen'), '2.000 €', 'Offene Forderungen falsch');
  assertEqual(await statValue(page, 'Bezahlte Rechnungen'), '500 €', 'Bezahlte Rechnungen falsch');
});

await check('Durchschnittlicher Auftragswert stimmt', async () => {
  const avg = await statValue(page, 'Ø Auftragswert');
  assertEqual(avg, '6.800,25 €', 'Durchschnitt aus 8.400,50 und 5.200 falsch');
});

await check('Zeitraumfilter schalten um', async () => {
  await page.locator('.segmented-btn:has-text("Letztes Jahr")').click();
  await page.waitForTimeout(250);
  assertEqual(await statValue(page, 'Umsatz im Zeitraum'), '0 €', 'Letztes Jahr sollte leer sein');
  await page.locator('.segmented-btn:has-text("Dieses Jahr")').click();
  await page.waitForTimeout(250);
  assertEqual(await statValue(page, 'Umsatz im Zeitraum'), '500 €', 'Dieses Jahr falsch');
});

await check('Benutzerdefinierter Zeitraum blendet Datumsfelder ein', async () => {
  await page.locator('.segmented-btn:has-text("Benutzerdefiniert")').click();
  await page.waitForTimeout(250);
  assertEqual(await page.locator('.period-custom input[type="date"]').count(), 2, 'Datumsfelder fehlen');
  await page.locator('.segmented-btn:has-text("Gesamt")').click();
  await page.waitForTimeout(200);
});

await check('Umsatz pro Kunde und pro Projekt werden ausgewiesen', async () => {
  assert(await page.locator('.card-title:text-is("Umsatz pro Kunde")').isVisible(), 'Karte "Umsatz pro Kunde" fehlt');
  assert(await page.locator('.card-title:text-is("Umsatz pro Projekt")').isVisible(), 'Karte "Umsatz pro Projekt" fehlt');
  const barText = await page.locator('.card:has(.card-title:text-is("Umsatz pro Kunde")) .barlist-row').first().innerText();
  assert(barText.includes('Nordlicht'), `Umsatzrangliste falsch: ${barText}`);
});

/* --- 8. Aktivität und Widgets ---------------------------------------- */

console.log('\nAktivität und Widgets');

await check('Aktivitätsverlauf protokolliert die Änderungen', async () => {
  await goto(page, 'Aktivität');
  const items = await page.locator('.activity-item').count();
  assert(items >= 8, `Zu wenige Protokolleinträge: ${items}`);
  const text = await page.locator('.activity-text').allInnerTexts();
  assert(text.some((t) => t.includes('angelegt')), 'Kein "angelegt"-Eintrag');
  assert(text.some((t) => t.includes('geändert')), 'Kein "geändert"-Eintrag');
});

await check('Widget-Verwaltung speichert die Auswahl', async () => {
  await goto(page, 'Dashboard');
  const before = await page.locator('.widget').count();
  await page.locator('.page-actions .btn:has-text("Widgets")').click();
  await page.waitForSelector('.modal');
  await page.locator('.widget-manager-row input[type="checkbox"]:checked').first().click();
  await page.waitForTimeout(200);
  await page.locator('.modal-foot .btn:has-text("Speichern")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(250);
  assertEqual(await page.locator('.widget').count(), before - 1, 'Widget wurde nicht entfernt');
});

await check('Schnellanlage über "Neu" öffnet den passenden Dialog', async () => {
  await page.locator('.page-actions .btn:has-text("Neu")').click();
  await page.waitForSelector('.quick-grid');
  await page.locator('.quick-item:has-text("Kunde")').click();
  await page.waitForSelector('.modal-title:has-text("Kunde anlegen")');
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
});

/* --- 9. Persistenz ---------------------------------------------------- */

console.log('\nPersistenz und Löschen');

await check('Daten überleben einen vollständigen Neuladevorgang', async () => {
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.stat-value');
  assertEqual(await statValue(page, 'Ausstehender Betrag'), '2.000 €', 'Daten nach Neuladen verloren');
  await goto(page, 'Kunden');
  assertEqual(await page.locator('.table tbody tr').count(), 2, 'Kunden nach Neuladen verloren');
});

await check('Löschen eines verknüpften Kunden wird angekündigt', async () => {
  await goto(page, 'Kunden');
  const row = page.locator('.table tbody tr', { has: page.locator('td:has-text("Nordlicht Bau GmbH")') }).first();
  await row.locator('.row-actions .btn').last().click();
  await page.waitForSelector('.modal');
  assert(await page.locator('.confirm-details').isVisible(), 'Hinweis auf verknüpfte Datensätze fehlt');
  const details = await page.locator('.confirm-list').innerText();
  assert(details.includes('Aufträge') && details.includes('Rechnungen'), `Verknüpfungen unvollständig: ${details}`);
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  assertEqual(await page.locator('.table tbody tr').count(), 2, 'Kunde wurde trotz Abbruch gelöscht');
});

await check('Bestätigtes Löschen entfernt den Datensatz, erhält aber die Belege', async () => {
  await goto(page, 'Projekte');
  const row = page.locator('.table tbody tr', { has: page.locator('td:has-text("Eigenes Portfolio")') }).first();
  await row.locator('.row-actions .btn').last().click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Trotzdem löschen"), .modal-foot .btn:has-text("Löschen")').last().click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(250);
  assertEqual(await page.locator('.table tbody tr').count(), 0, 'Projekt wurde nicht gelöscht');

  await goto(page, 'Aufgaben');
  assertEqual(await page.locator('.table tbody tr').count(), 1, 'Aufgabe wurde mitgelöscht statt entkoppelt');
});

/* --- 10. Sicherung ---------------------------------------------------- */

console.log('\nSicherung und Einstellungen');

await check('Sicherung lässt sich herunterladen', async () => {
  await goto(page, 'Einstellungen');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 8000 }),
    page.locator('.btn:has-text("Sicherung herunterladen")').click(),
  ]);
  const name = download.suggestedFilename();
  assert(name.startsWith('dashboard-sicherung-') && name.endsWith('.json'), `Unerwarteter Dateiname: ${name}`);
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  assertEqual(data.format, 'bizdash', 'Falsches Sicherungsformat');
  assertEqual(data.collections.invoices.length, 3, 'Rechnungen fehlen in der Sicherung');
  assertEqual(data.collections.customers.length, 2, 'Kunden fehlen in der Sicherung');
});

await check('Umsatzbasis lässt sich umstellen und wirkt sofort', async () => {
  await page.locator('.radio-option:has-text("Abgeschlossene Aufträge") input').check();
  await page.waitForTimeout(300);
  await goto(page, 'Dashboard');
  assertEqual(await statValue(page, 'Gesamtumsatz'), '5.200 €', 'Umsatzbasis "Aufträge" rechnet falsch');

  await goto(page, 'Einstellungen');
  await page.locator('.radio-option:has-text("Bezahlte Rechnungen") input').check();
  await page.waitForTimeout(300);
  await goto(page, 'Dashboard');
  assertEqual(await statValue(page, 'Gesamtumsatz'), '500 €', 'Rückstellung der Umsatzbasis fehlgeschlagen');
});

await check('Demodaten laden und wieder entfernen', async () => {
  await goto(page, 'Einstellungen');
  await page.locator('.btn:has-text("Demodaten laden")').click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Demodaten laden")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(400);
  await goto(page, 'Kunden');
  assertEqual(await page.locator('.table tbody tr').count(), 4, 'Demodaten wurden nicht geladen');

  await goto(page, 'Dashboard');
  const revenue = await statValue(page, 'Gesamtumsatz');
  assert(revenue !== '0 €', 'Demodaten liefern keinen Umsatz');

  await goto(page, 'Einstellungen');
  await page.locator('.btn:has-text("Alle Daten löschen")').click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Alles löschen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(400);
  await goto(page, 'Kunden');
  assertEqual(await page.locator('.table tbody tr').count(), 0, 'Zurücksetzen unvollständig');
});

/* --- 11. Darstellung -------------------------------------------------- */

console.log('\nDarstellung');

await check('Demodaten für die Layoutprüfung', async () => {
  await goto(page, 'Einstellungen');
  await page.locator('.btn:has-text("Demodaten laden")').click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Demodaten laden")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(400);
});

const VIEWPORTS = [
  { name: 'iPad quer 1194x834', width: 1194, height: 834, sidebar: true, table: true },
  { name: 'iPad hochkant 834x1194', width: 834, height: 1194, sidebar: false, table: false },
  { name: 'iPad mini 744x1133', width: 744, height: 1133, sidebar: false, table: false },
  { name: 'iPhone 390x844', width: 390, height: 844, sidebar: false, table: false },
  { name: 'Desktop 1440x900', width: 1440, height: 900, sidebar: true, table: true },
];

for (const vp of VIEWPORTS) {
  await check(`Kein waagerechtes Scrollen: ${vp.name}`, async () => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(250);
    for (const label of ['Dashboard', 'Aufträge', 'Kunden', 'Rechnungen', 'Finanzen', 'Meine Websites', 'Aufgaben']) {
      await goto(page, label);
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        body: document.body.scrollWidth - document.body.clientWidth,
      }));
      assert(overflow.doc <= 1 && overflow.body <= 1,
        `${label}: ${overflow.doc}px Überhang (Dokument), ${overflow.body}px (Body)`);
    }
  });
}

await check('Sidebar verhält sich je nach Breite richtig', async () => {
  await page.setViewportSize({ width: 1194, height: 834 });
  await page.waitForTimeout(150);
  assert(await page.locator('.sidebar').isVisible(), 'Sidebar sollte auf dem iPad quer fest stehen');
  const x = await page.locator('.sidebar').boundingBox();
  assert(x.x >= 0, 'Sidebar ist ausgefahren, sollte aber stehen');

  await page.setViewportSize({ width: 834, height: 1194 });
  await page.waitForTimeout(200);
  const hidden = await page.locator('.sidebar').boundingBox();
  assert(hidden.x < 0, 'Sidebar sollte hochkant ausgeblendet sein');
});

await check('Menü öffnet und schließt per Tipp (kein Hover nötig)', async () => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.locator('.topbar .btn-icon').first().click();
  await page.waitForTimeout(300);
  const open = await page.locator('.sidebar').boundingBox();
  assertEqual(open.x, 0, 'Menü hat sich nicht geöffnet');

  await page.locator('.nav-item:has-text("Kunden")').click();
  await page.waitForTimeout(300);
  const closed = await page.locator('.sidebar').boundingBox();
  assert(closed.x < 0, 'Menü blieb nach der Auswahl offen');
});

await check('Tabellen werden schmal als Kartenliste dargestellt', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await goto(page, 'Rechnungen');
  await page.waitForTimeout(200);
  assert(await page.locator('.card-rows .card-row').first().isVisible(), 'Kartenliste fehlt auf dem Telefon');
  assert(!(await page.locator('.table-scroll').first().isVisible()), 'Tabelle sollte schmal ausgeblendet sein');
});

await check('Alle Bedienelemente sind mindestens 40px hoch', async () => {
  await page.setViewportSize({ width: 834, height: 1194 });
  const tooSmall = [];
  for (const label of ['Dashboard', 'Aufträge', 'Rechnungen', 'Aufgaben', 'Einstellungen']) {
    await goto(page, label);
    const found = await page.evaluate(() => {
      const bad = [];
      const nodes = document.querySelectorAll('button, a.btn, select.input, input.input, .nav-item, .segmented-btn');
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // Kleine Symbolschalter innerhalb von Zeilen sind bewusst 36px.
        if (r.height < 34) {
          bad.push(`${el.className || el.tagName} ${Math.round(r.height)}px`);
        }
      }
      return bad;
    });
    tooSmall.push(...found.map((f) => `${label}: ${f}`));
  }
  assert(tooSmall.length === 0, `Zu kleine Tippziele:\n      ${tooSmall.slice(0, 8).join('\n      ')}`);
});

await check('Eingabefelder haben 16px – iOS zoomt nicht hinein', async () => {
  await page.setViewportSize({ width: 834, height: 1194 });

  /** Sichtbare Felder einer Seite messen. Versteckte zaehlen nicht mit. */
  const measure = () => page.evaluate(() => [...document.querySelectorAll('input.input, textarea.input, select.input, .gsearch-input')]
    .filter((el) => el.getBoundingClientRect().height > 0)
    .map((el) => `${el.className.split(' ')[0]}:${parseFloat(getComputedStyle(el).fontSize)}`)
    .filter((entry) => parseFloat(entry.split(':')[1]) < 16));

  // In Listenansichten (Suchfeld, Filter).
  for (const label of ['Aufträge', 'Rechnungen', 'Einstellungen']) {
    await goto(page, label);
    const small = await measure();
    assert(small.length === 0, `${label}: Felder unter 16px: ${small.join(', ')}`);
  }

  // Im Dialog.
  await goto(page, 'Kunden');
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  const small = await measure();
  assert(small.length === 0, `Dialog: Felder unter 16px: ${small.join(', ')}`);
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });

  // In der globalen Suche.
  await page.locator('.topbar-search').click();
  await page.waitForSelector('.gsearch');
  const searchSmall = await measure();
  assert(searchSmall.length === 0, `Suche: Felder unter 16px: ${searchSmall.join(', ')}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
});

/* --- 12. Links und Konsole ------------------------------------------- */

console.log('\nLinks, Konsole, Sicherheit');

await check('Keine toten oder unsicheren Links', async () => {
  await page.setViewportSize({ width: 1194, height: 834 });
  await page.waitForTimeout(300);
  const problems = [];
  for (const label of ['Dashboard', 'Kunden', 'Meine Websites', 'Inspiration', 'Einstellungen']) {
    await goto(page, label);
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel') || '',
    })));
    for (const link of links) {
      if (!link.href || link.href === '#') problems.push(`${label}: leerer Link`);
      if (link.href.startsWith('javascript:')) problems.push(`${label}: javascript:-Link`);
      if (link.target === '_blank' && !link.rel.includes('noopener')) {
        problems.push(`${label}: ${link.href} ohne rel=noopener`);
      }
    }
  }
  assert(problems.length === 0, problems.join('\n      '));
});

await check('Gespeicherter Text wird nie als HTML ausgeführt', async () => {
  await goto(page, 'Kunden');
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  await fill(page, 'Firmenname', '<img src=x onerror="window.__xss=1">');
  await fill(page, 'Notizen', '<script>window.__xss=1</script>');
  await submitDialog(page, 'Anlegen');
  await page.waitForTimeout(300);

  const executed = await page.evaluate(() => Boolean(window.__xss));
  assert(!executed, 'Eingeschleustes HTML wurde ausgeführt');
  const injected = await page.evaluate(() => document.querySelectorAll('.content img[src="x"]').length);
  assertEqual(injected, 0, 'HTML aus Nutzereingabe wurde als Markup eingefügt');
  assert(await page.locator('td:has-text("onerror")').first().isVisible(), 'Der Text sollte sichtbar bleiben');
});

/*
 * Reine DOM-Pruefungen uebersehen Stilfehler. Diese Pruefung stellt sicher,
 * dass Overlays tatsaechlich gestaltet sind - ein Dialog ausserhalb des
 * `.bizdash`-Bereichs bekaeme weder Hintergrund noch Schrift, und im Wix
 * Shadow DOM ueberhaupt kein Stylesheet.
 */
await check('Dialoge, Suche und Meldungen sind wirklich gestaltet', async () => {
  await goto(page, 'Kunden');
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');

  const style = await page.evaluate(() => {
    const panel = document.querySelector('.modal');
    const overlay = document.querySelector('.modal-overlay');
    const cs = getComputedStyle(panel);
    return {
      inApp: Boolean(overlay.closest('.bizdash')),
      background: cs.backgroundColor,
      radius: cs.borderTopLeftRadius,
      fontFamily: cs.fontFamily,
      overlayBg: getComputedStyle(overlay).backgroundColor,
    };
  });

  assert(style.inApp, 'Der Dialog liegt ausserhalb des Anwendungsbereichs – die Stilvariablen greifen dort nicht.');
  assert(style.background !== 'rgba(0, 0, 0, 0)' && style.background !== 'transparent',
    `Der Dialog hat keinen Hintergrund (${style.background}).`);
  assert(parseFloat(style.radius) > 0, 'Der Dialog hat keine abgerundeten Ecken – Stylesheet greift nicht.');
  assert(!/^(serif|Times)/i.test(style.fontFamily), `Unerwartete Schrift im Dialog: ${style.fontFamily}`);
  assert(style.overlayBg !== 'rgba(0, 0, 0, 0)', 'Die Abdunklung hinter dem Dialog fehlt.');

  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });

  // Globale Suche ebenso.
  await page.locator('.topbar-search').click();
  await page.waitForSelector('.gsearch');
  const searchStyle = await page.evaluate(() => {
    const panel = document.querySelector('.gsearch');
    return {
      inApp: Boolean(panel.closest('.bizdash')),
      background: getComputedStyle(panel).backgroundColor,
    };
  });
  assert(searchStyle.inApp, 'Die Suche liegt ausserhalb des Anwendungsbereichs.');
  assert(searchStyle.background !== 'rgba(0, 0, 0, 0)', 'Die Suche hat keinen Hintergrund.');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
});

await check('Scrollsperre wird gesetzt und wieder aufgehoben', async () => {
  const before = await page.evaluate(() => document.body.style.overflow);
  await goto(page, 'Kunden');
  await page.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await page.waitForSelector('.modal');
  const locked = await page.evaluate(() => document.body.style.overflow);
  assertEqual(locked, 'hidden', 'Hinter dem Dialog wird nicht gesperrt');
  await page.locator('.modal-foot .btn:has-text("Abbrechen")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  const after = await page.evaluate(() => document.body.style.overflow);
  assertEqual(after, before, 'Die Scrollsperre wurde nicht zurueckgenommen');
});

await check('Keine Fehler in der Browser-Konsole', async () => {
  assert(pageErrors.length === 0, `Nicht abgefangene Fehler:\n      ${pageErrors.join('\n      ')}`);
  const relevant = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('manifest'));
  assert(relevant.length === 0, `Konsolenfehler:\n      ${relevant.join('\n      ')}`);
});

await check('Keine fehlgeschlagenen Netzwerkanfragen', async () => {
  const relevant = failedRequests.filter((r) => !r.includes('favicon'));
  assert(relevant.length === 0, `Fehlgeschlagen:\n      ${relevant.join('\n      ')}`);
});

await check('Die App lädt nichts von fremden Servern', async () => {
  const external = await page.evaluate(() => performance.getEntriesByType('resource')
    .map((e) => e.name)
    .filter((name) => !name.startsWith(location.origin) && !name.startsWith('data:') && !name.startsWith('blob:')));
  assert(external.length === 0, `Externe Ressourcen: ${external.join(', ')}`);
});

/* --- 13. Gebaute Fassung --------------------------------------------- */

await check('Gebaute Fassung (dist) startet ebenfalls', async () => {
  const distPage = await context.newPage();
  const distErrors = [];
  distPage.on('pageerror', (err) => distErrors.push(String(err)));
  distPage.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) distErrors.push(msg.text());
  });
  await distPage.goto(`${base}/dist/index.html`, { waitUntil: 'networkidle' });
  await distPage.waitForSelector('.stat-value', { timeout: 10000 });
  assert(await distPage.locator('.stat').count() >= 9, 'Gebaute Fassung zeigt keine Kennzahlen');
  assert(distErrors.length === 0, `Fehler in der gebauten Fassung: ${distErrors.join(', ')}`);
  await distPage.close();
});

await check('Wix Custom Element registriert sich und startet', async () => {
  const elementPage = await context.newPage();
  const elementErrors = [];
  elementPage.on('pageerror', (err) => elementErrors.push(String(err)));

  await elementPage.setContent(`<!doctype html><html lang="de"><head><meta charset="utf-8"></head>
    <body style="margin:0"><bizdash-app standalone="true" style="display:block;min-height:600px"></bizdash-app></body></html>`);
  await elementPage.addScriptTag({ url: `${base}/dist/dashboard-element.js` });

  await elementPage.waitForFunction(
    () => document.querySelector('bizdash-app')?.shadowRoot?.querySelector('.stat-value'),
    null,
    { timeout: 10000 },
  );
  const stats = await elementPage.evaluate(
    () => document.querySelector('bizdash-app').shadowRoot.querySelectorAll('.stat').length,
  );
  assert(stats >= 9, `Custom Element zeigt nur ${stats} Kennzahlen`);

  // Ein Dialog im Shadow DOM muss dort landen und gestaltet sein - haenge er
  // am document.body, bekaeme er das eingebettete Stylesheet nie zu sehen.
  const root = elementPage.locator('bizdash-app');
  await root.locator('.nav-item:has-text("Kunden")').first().click();
  await elementPage.waitForTimeout(250);
  await root.locator('.page-actions .btn:has-text("Kunde anlegen")').click();
  await root.locator('.modal').waitFor({ state: 'visible', timeout: 5000 });
  const modalStyle = await elementPage.evaluate(() => {
    const shadow = document.querySelector('bizdash-app').shadowRoot;
    const panel = shadow.querySelector('.modal');
    if (!panel) return null;
    return {
      background: getComputedStyle(panel).backgroundColor,
      radius: getComputedStyle(panel).borderTopLeftRadius,
      strayInDocument: document.body.querySelector(':scope > .modal-overlay') !== null,
    };
  });
  assert(modalStyle, 'Der Dialog liegt nicht im Shadow DOM des Custom Elements.');
  assert(!modalStyle.strayInDocument, 'Der Dialog wurde ausserhalb des Custom Elements eingehaengt.');
  assert(modalStyle.background !== 'rgba(0, 0, 0, 0)',
    `Der Dialog im Custom Element ist ungestaltet (${modalStyle.background}).`);
  assert(parseFloat(modalStyle.radius) > 0, 'Das Stylesheet erreicht den Dialog im Shadow DOM nicht.');
  assert(elementErrors.length === 0, `Fehler im Custom Element: ${elementErrors.join(', ')}`);
  await elementPage.close();
});

/* ------------------------------------------------------------ Bericht -- */

await browser.close();
server.close();

console.log('');
if (failed) {
  console.log(`${results.length - failed} bestanden, ${failed} fehlgeschlagen\n`);
  for (const r of results.filter((x) => !x.ok)) {
    console.log(`✗ ${r.name}`);
    console.log(`  ${r.error?.message || r.error}\n`);
  }
  process.exit(1);
}
console.log(`✓ Alle ${results.length} Browser-Prüfungen bestanden\n`);
