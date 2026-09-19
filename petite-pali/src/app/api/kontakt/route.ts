import { NextResponse } from 'next/server';

/**
 * Endpunkt für alle drei Formulare: Kontakt, Shopping-Termin und Gutschein.
 *
 * Ein Endpunkt statt drei, weil sich nur die Felder unterscheiden, nicht der
 * Weg: prüfen, Honigtopf abfangen, als JSON weiterreichen.
 *
 * Die Zustellung ist austauschbar und in diesem Repository NICHT konfiguriert.
 * Es gibt keinen Mailanbieter, keinen Schlüssel und kein Postfach — statt einen
 * Versand vorzutäuschen und damit echte Anfragen still zu verlieren, prüft der
 * Handler die Eingaben und antwortet ausdrücklich mit 503, solange
 * CONTACT_WEBHOOK_URL fehlt. Siehe CONTENT-TODO.md.
 *
 * Kein Dateiupload und keine Zahlungsfunktion. Der Gutschein wird wie bisher
 * persönlich ausgestellt; eine Zahlungsstrecke zu erfinden, die es im Laden
 * nicht gibt, wäre ein Versprechen, das niemand einlösen kann.
 */

const FORMS = {
  kontakt: {
    subjects: ['artikel', 'verfuegbarkeit', 'geschenk', 'sonstiges'],
    required: ['name', 'email', 'nachricht'] as const,
  },
  termin: {
    subjects: ['erstausstattung', 'trageberatung', 'kinderwagen', 'umstandsmode', 'sonstiges'],
    required: ['name', 'email', 'nachricht'] as const,
  },
  gutschein: {
    subjects: [],
    required: ['name', 'email', 'betrag'] as const,
  },
} as const;

type FormKey = keyof typeof FORMS;

const LABELS: Record<string, string> = {
  name: 'Bitte geben Sie Ihren Namen an.',
  email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
  nachricht: 'Ein, zwei Sätze helfen uns weiter.',
  betrag: 'Bitte geben Sie den gewünschten Betrag an.',
};

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Anfrage konnte nicht gelesen werden.' }, { status: 400 });
  }

  const get = (key: string) => (form.get(key) ?? '').toString().trim();

  // Honigtopf: ein Feld, das Menschen nicht sehen und einfache Bots ausfüllen.
  if (get('website') !== '') {
    return NextResponse.json({ ok: true });
  }

  const kind = get('form') as FormKey;
  const config = FORMS[kind];
  if (!config) {
    return NextResponse.json({ error: 'Unbekanntes Formular.' }, { status: 400 });
  }

  const payload: Record<string, string> = { form: kind };
  for (const key of ['subject', 'name', 'email', 'telefon', 'nachricht', 'betrag', 'empfaenger', 'anlass', 'termin']) {
    const value = get(key);
    if (value) payload[key] = value;
  }

  const errors: Record<string, string> = {};

  if (config.subjects.length > 0) {
    const subject = get('subject');
    if (!(config.subjects as readonly string[]).includes(subject)) {
      errors.subject = 'Bitte wählen Sie aus, worum es geht.';
    }
  }

  for (const field of config.required) {
    const value = get(field);
    if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) errors.email = LABELS.email;
      continue;
    }
    if (field === 'nachricht') {
      if (value.length < 10) errors.nachricht = LABELS.nachricht;
      continue;
    }
    if (value.length < 2) errors[field] = LABELS[field] ?? 'Bitte füllen Sie dieses Feld aus.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          'Das Formular ist noch nicht freigeschaltet. Rufen Sie uns bitte solange an oder schreiben Sie uns direkt eine E-Mail.',
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
