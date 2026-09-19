import { NextResponse } from 'next/server';

/**
 * Endpunkt des Kontaktformulars.
 *
 * Die Zustellung ist austauschbar und in diesem Repository NICHT konfiguriert.
 * Es gibt keinen Mailanbieter, keinen Schlüssel und kein Postfach — statt einen
 * Versand vorzutäuschen und damit echte Anfragen still zu verlieren, prüft der
 * Handler die Eingaben und antwortet ausdrücklich mit 503, solange
 * CONTACT_WEBHOOK_URL fehlt. Siehe CONTENT-TODO.md.
 *
 * Sobald die Variable auf einen Endpunkt zeigt, der einen JSON-POST annimmt,
 * ist das Formular ohne Codeänderung scharf.
 *
 * Kein Dateiupload, anders als im Schwesterprojekt: eine Boutique braucht kein
 * Foto vom Kunden, und was nicht erhoben wird, muss auch nicht gespeichert,
 * begründet und wieder gelöscht werden.
 */

const SUBJECTS = ['artikel', 'verfuegbarkeit', 'geschenk', 'secondhand', 'sonstiges'] as const;

type FieldErrors = Record<string, string>;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Anfrage konnte nicht gelesen werden.' }, { status: 400 });
  }

  const get = (key: string) => (form.get(key) ?? '').toString().trim();

  const payload = {
    subject: get('subject'),
    name: get('name'),
    email: get('email'),
    telefon: get('telefon'),
    nachricht: get('nachricht'),
  };

  // Honigtopf: ein Feld, das Menschen nicht sehen und einfache Bots ausfüllen.
  if (get('website') !== '') {
    return NextResponse.json({ ok: true });
  }

  const errors: FieldErrors = {};
  if (!SUBJECTS.includes(payload.subject as (typeof SUBJECTS)[number])) {
    errors.subject = 'Bitte wählen Sie aus, worum es geht.';
  }
  if (payload.name.length < 2) errors.name = 'Bitte geben Sie Ihren Namen an.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  }
  if (payload.nachricht.length < 10) {
    errors.nachricht = 'Ein, zwei Sätze helfen uns weiter.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          'Das Kontaktformular ist noch nicht freigeschaltet. Rufen Sie uns bitte solange an oder schreiben Sie uns direkt eine E-Mail.',
        code: 'delivery_not_configured',
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`Upstream antwortete ${response.status}`);
  } catch {
    return NextResponse.json(
      { error: 'Die Anfrage konnte gerade nicht zugestellt werden. Bitte versuchen Sie es später erneut.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
