'use strict';

/* ====================================================================
   Empfang des Anfrageformulars
   --------------------------------------------------------------------
   Läuft als Serverless Function auf Vercel unter /api/anfrage.
   Keine Abhängigkeiten — der Versand geht über die HTTP-Schnittstelle
   des Maildienstes, nicht über SMTP.

   EINRICHTUNG (Vercel → Projekt → Settings → Environment Variables):

     MAIL_TO          Empfängeradresse, Standard: info@ruhrcargo.net
     MAIL_FROM        Absenderadresse, muss beim Dienst freigeschaltet sein
     MAIL_FROM_NAME   Anzeigename des Absenders, Standard: RuhrCargo Website

   Dazu genau EINEN Schlüssel, je nach Dienst:

     BREVO_API_KEY    Brevo (Sitz in Frankreich, damit innerhalb der EU)
     RESEND_API_KEY   Resend

   Fehlt der Schlüssel, antwortet die Funktion mit 503 und der Kennung
   "not_configured". Das Formular fällt dann auf das Mailprogramm des
   Besuchers zurück, statt ins Leere zu laufen.
   ==================================================================== */

// Bewusst pro Anfrage gelesen und nicht beim Laden des Moduls: eine
// geänderte Einstellung in Vercel greift so ohne Umweg über einen Kaltstart.
function einstellungen() {
  return {
    an: process.env.MAIL_TO || 'info@ruhrcargo.net',
    von: process.env.MAIL_FROM || '',
    vonName: process.env.MAIL_FROM_NAME || 'RuhrCargo Website',
    brevo: process.env.BREVO_API_KEY || '',
    resend: process.env.RESEND_API_KEY || '',
  };
}

// Längengrenzen je Feld. Alles darüber wird abgeschnitten, damit niemand
// über das Formular beliebig große Mengen Text einkippt.
const GRENZEN = {
  ladung: 60, ladungLabel: 80, von: 120, nach: 120, name: 120,
  firma: 160, email: 160, telefon: 60, termin: 20, nachricht: 4000,
};
const PFLICHT = ['ladung', 'von', 'nach', 'name', 'email'];
const MAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/* --- Drosselung ---------------------------------------------------- */
// Best effort: der Speicher gehört zur laufenden Instanz und ist nach einem
// Kaltstart wieder leer. Gegen einen verteilten Angriff hilft das nicht,
// gegen ein stumpf wiederholendes Skript schon.
const ZUGRIFFE = new Map();
const FENSTER_MS = 10 * 60 * 1000;
const MAX_IM_FENSTER = 5;

function zuVieleAnfragen(ip) {
  const jetzt = Date.now();
  const bisher = (ZUGRIFFE.get(ip) || []).filter((t) => jetzt - t < FENSTER_MS);
  bisher.push(jetzt);
  ZUGRIFFE.set(ip, bisher);
  if (ZUGRIFFE.size > 5000) ZUGRIFFE.clear();   // Notbremse gegen Speicherwachstum
  return bisher.length > MAX_IM_FENSTER;
}

/* --- Hilfen -------------------------------------------------------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function saeubern(wert, grenze) {
  if (typeof wert !== 'string') return '';
  // Steuerzeichen raus, Zeilenumbrüche im Fließtext bleiben erhalten
  return wert.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, grenze);
}

function textKoerper(d) {
  const z = [
    ['Ladung', d.ladungLabel || d.ladung],
    ['Abholung', d.von],
    ['Zustellung', d.nach],
    ['Wunschtermin', d.termin || 'keine Angabe'],
    ['', ''],
    ['Name', d.name],
    ['Firma', d.firma || '-'],
    ['E-Mail', d.email],
    ['Telefon', d.telefon || '-'],
  ];
  let t = z.map(([k, v]) => (k ? k + ': ' + v : '')).join('\n');
  t += '\n\nDetails zur Ladung:\n' + (d.nachricht || '-');
  t += '\n\n---\nGesendet über das Anfrageformular auf ruhrcargo.net';
  return t;
}

function htmlKoerper(d) {
  const zeile = (k, v) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
    `<td style="padding:6px 0;color:#111"><strong>${esc(v)}</strong></td></tr>`;
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 4px"><strong style="font-size:17px">Neue Transportanfrage</strong></p>
  <p style="margin:0 0 18px;color:#666">über das Formular auf der Website</p>
  <table style="border-collapse:collapse;margin-bottom:18px">
    ${zeile('Ladung', d.ladungLabel || d.ladung)}
    ${zeile('Abholung', d.von)}
    ${zeile('Zustellung', d.nach)}
    ${zeile('Wunschtermin', d.termin || 'keine Angabe')}
  </table>
  <table style="border-collapse:collapse;margin-bottom:18px">
    ${zeile('Name', d.name)}
    ${zeile('Firma', d.firma || '-')}
    ${zeile('E-Mail', d.email)}
    ${zeile('Telefon', d.telefon || '-')}
  </table>
  <p style="margin:0 0 6px;color:#666">Details zur Ladung</p>
  <p style="margin:0;white-space:pre-wrap">${esc(d.nachricht || '-')}</p>
  <p style="margin:24px 0 0;padding-top:12px;border-top:1px solid #e5e5e5;color:#888;font-size:13px">
    Antworten geht direkt an ${esc(d.email)}.</p>
</div>`;
}

/* --- Versandwege ---------------------------------------------------- */
async function ueberBrevo(key, mail) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: mail.von, name: mail.vonName },
      to: [{ email: mail.an }],
      replyTo: { email: mail.antwortAn, name: mail.antwortName },
      subject: mail.betreff,
      textContent: mail.text,
      htmlContent: mail.html,
    }),
  });
  return { ok: r.ok, status: r.status, body: await r.text() };
}

async function ueberResend(key, mail) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: `${mail.vonName} <${mail.von}>`,
      to: [mail.an],
      reply_to: mail.antwortAn,
      subject: mail.betreff,
      text: mail.text,
      html: mail.html,
    }),
  });
  return { ok: r.ok, status: r.status, body: await r.text() };
}

/* --- Einstieg ------------------------------------------------------- */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unbekannt';
  if (zuVieleAnfragen(ip)) return res.status(429).json({ error: 'rate_limited' });

  // Vercel legt den geparsten Body normalerweise auf req.body. Je nach
  // Laufzeit kommt er aber auch als Zeichenkette oder Buffer an.
  let roh = req.body;
  if (Buffer.isBuffer(roh)) roh = roh.toString('utf8');
  if (typeof roh === 'string') { try { roh = JSON.parse(roh); } catch (e) { roh = null; } }
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) {
    return res.status(400).json({ error: 'bad_request' });
  }

  // Honigtopf: nur Maschinen füllen dieses Feld aus. Wir melden bewusst
  // Erfolg, damit ein Bot nicht merkt, dass er erkannt wurde.
  if (typeof roh.website === 'string' && roh.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const d = {};
  for (const [feld, grenze] of Object.entries(GRENZEN)) d[feld] = saeubern(roh[feld], grenze);

  const fehlend = PFLICHT.filter((f) => !d[f]);
  if (fehlend.length) return res.status(422).json({ error: 'missing_fields', fields: fehlend });
  if (!MAIL_RE.test(d.email)) return res.status(422).json({ error: 'invalid_email' });
  if (roh.datenschutz !== 'on' && roh.datenschutz !== true) {
    return res.status(422).json({ error: 'consent_required' });
  }

  const cfg = einstellungen();
  if (!cfg.brevo && !cfg.resend) {
    // Noch kein Maildienst hinterlegt — das Formular weicht auf das
    // Mailprogramm des Besuchers aus.
    return res.status(503).json({ error: 'not_configured' });
  }

  // Resend erlaubt ohne eigene Domain den Versand über eine Testadresse.
  // Brevo verlangt immer einen freigeschalteten Absender.
  const von = cfg.von || (cfg.resend && !cfg.brevo ? 'onboarding@resend.dev' : '');
  if (!von) return res.status(503).json({ error: 'not_configured', detail: 'MAIL_FROM fehlt' });

  const mail = {
    an: cfg.an,
    von,
    vonName: cfg.vonName,
    antwortAn: d.email,
    antwortName: d.name,
    betreff: `Transportanfrage: ${d.ladungLabel || d.ladung} · ${d.von} → ${d.nach}`,
    text: textKoerper(d),
    html: htmlKoerper(d),
  };

  try {
    const r = cfg.brevo ? await ueberBrevo(cfg.brevo, mail) : await ueberResend(cfg.resend, mail);
    if (!r.ok) {
      // Antwort des Dienstes protokollieren, aber nie an den Besucher geben
      console.error('Mailversand fehlgeschlagen', r.status, r.body.slice(0, 500));
      return res.status(502).json({ error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mailversand fehlgeschlagen', err && err.message);
    return res.status(502).json({ error: 'send_failed' });
  }
};
