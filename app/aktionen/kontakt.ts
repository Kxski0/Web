'use server';

/**
 * Verarbeitung des Kontaktformulars.
 *
 * Zustellung laeuft ueber einen frei waehlbaren Webhook (CONTACT_WEBHOOK_URL) —
 * bewusst ohne zusaetzliche Abhaengigkeit, damit jeder Dienst oder ein eigener
 * Endpunkt angebunden werden kann. Ist die Variable nicht gesetzt, meldet die
 * Aktion das ehrlich zurueck, und das Formular verweist auf Telefon und
 * E-Mail, statt Eingaben stillschweigend zu verwerfen.
 */

export type KontaktStatus =
  | { ok: true }
  | { ok: false; grund: 'validierung'; felder: Record<string, string> }
  | { ok: false; grund: 'nicht_konfiguriert' }
  | { ok: false; grund: 'fehler' };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function kontaktSenden(
  _vorher: KontaktStatus | null,
  daten: FormData,
): Promise<KontaktStatus> {
  // Honeypot: von Menschen nie ausgefuellt, von einfachen Bots fast immer.
  if (String(daten.get('website') ?? '') !== '') return { ok: true };

  const name = String(daten.get('name') ?? '').trim();
  const email = String(daten.get('email') ?? '').trim();
  const telefon = String(daten.get('telefon') ?? '').trim();
  const anliegen = String(daten.get('anliegen') ?? '').trim();
  const nachricht = String(daten.get('nachricht') ?? '').trim();

  const felder: Record<string, string> = {};
  if (name.length < 2) felder.name = 'Bitte geben Sie Ihren Namen an.';
  if (!EMAIL.test(email)) felder.email = 'Bitte prüfen Sie die E-Mail-Adresse.';
  if (telefon.length < 5) felder.telefon = 'Bitte geben Sie eine Telefonnummer an.';
  if (!anliegen) felder.anliegen = 'Bitte wählen Sie ein Anliegen.';

  if (Object.keys(felder).length > 0) {
    return { ok: false, grund: 'validierung', felder };
  }

  const ziel = process.env.CONTACT_WEBHOOK_URL;
  if (!ziel) return { ok: false, grund: 'nicht_konfiguriert' };

  try {
    const antwort = await fetch(ziel, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        telefon,
        anliegen,
        nachricht,
        eingegangen: new Date().toISOString(),
      }),
    });
    if (!antwort.ok) return { ok: false, grund: 'fehler' };
    return { ok: true };
  } catch {
    return { ok: false, grund: 'fehler' };
  }
}
