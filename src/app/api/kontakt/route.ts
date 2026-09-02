import { NextResponse } from 'next/server';

/**
 * Contact form endpoint.
 *
 * Delivery is pluggable and NOT configured in this repository. There is no
 * mail provider, no API key and no inbox to send to yet, so rather than
 * pretending a submission succeeded — which would silently lose real enquiries —
 * the handler validates the payload and returns an explicit 503 until
 * CONTACT_WEBHOOK_URL is set. See CONTENT-TODO.md.
 *
 * Set CONTACT_WEBHOOK_URL to any endpoint that accepts a JSON POST (a mail
 * service, a CRM intake, an automation webhook) and the form goes live with no
 * code change.
 */

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const SUBJECTS = [
  'photovoltaik',
  'waermepumpe',
  'stromspeicher',
  'energiemanagement',
  'kombination',
  'sonstiges',
] as const;

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
    ort: get('ort'),
    email: get('email'),
    telefon: get('telefon'),
    nachricht: get('nachricht'),
  };

  // Honeypot: a field hidden from people and irresistible to naive bots.
  if (get('website') !== '') {
    return NextResponse.json({ ok: true });
  }

  const errors: FieldErrors = {};
  if (!SUBJECTS.includes(payload.subject as (typeof SUBJECTS)[number])) {
    errors.subject = 'Bitte wählen Sie aus, worum es geht.';
  }
  if (payload.name.length < 2) errors.name = 'Bitte geben Sie Ihren Namen an.';
  if (payload.ort.length < 2) errors.ort = 'Bitte geben Sie den Ort an.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  }
  if (payload.nachricht.length < 10) {
    errors.nachricht = 'Ein paar Sätze zu Ihrem Vorhaben helfen uns weiter.';
  }

  const photo = form.get('foto');
  let photoMeta: { name: string; size: number; type: string } | null = null;
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_UPLOAD_BYTES) {
      errors.foto = 'Das Bild ist größer als 8 MB.';
    } else if (!ALLOWED_TYPES.includes(photo.type)) {
      errors.foto = 'Bitte laden Sie ein JPEG, PNG, WebP oder HEIC hoch.';
    } else {
      photoMeta = { name: photo.name, size: photo.size, type: photo.type };
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          'Das Kontaktformular ist noch nicht freigeschaltet. Bitte wenden Sie sich vorerst direkt an SolBauTec.',
        code: 'delivery_not_configured',
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, photo: photoMeta, receivedAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  } catch {
    return NextResponse.json(
      { error: 'Die Anfrage konnte gerade nicht zugestellt werden. Bitte versuchen Sie es später erneut.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
