'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { kontaktSenden, type KontaktStatus } from '@/app/aktionen/kontakt';
import { unternehmen } from '@/content/unternehmen';
import { Feld, feldKlassen } from './Feld';
import { ButtonAction } from './Button';
import { cn } from '@/lib/cn';

const ANLIEGEN = [
  'Photovoltaik',
  'Energieberatung',
  'Strom & Gas',
  'Heizlösung',
  'Bauservice oder Bauelemente',
  'Hausverwaltung',
  'Etwas anderes',
];

function Absenden() {
  const { pending } = useFormStatus();
  return (
    <ButtonAction type="submit" disabled={pending}>
      {pending ? 'Wird gesendet …' : 'Anfrage senden'}
    </ButtonAction>
  );
}

export function KontaktFormular() {
  const [status, aktion] = useActionState<KontaktStatus | null, FormData>(
    kontaktSenden,
    null,
  );

  const felder = status && !status.ok && status.grund === 'validierung' ? status.felder : {};

  if (status?.ok) {
    return (
      <div className="rounded-[var(--radius-card)] border border-carbon-warm p-8">
        <p className="text-subheading font-light text-carbon-warm">
          Vielen Dank — Ihre Anfrage ist angekommen.
        </p>
        <p className="mt-3 text-body text-text-muted">
          Wir melden uns zeitnah bei Ihnen zurück.
        </p>
      </div>
    );
  }

  return (
    <form action={aktion} className="grid gap-6" noValidate>
      {/* Honeypot — vor Menschen verborgen, fuer Bots sichtbar. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Feld id="name" label="Name" autoComplete="name" fehler={felder.name} required />
        <Feld id="email" label="E-Mail" type="email" autoComplete="email" fehler={felder.email} required />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Feld id="telefon" label="Telefon" type="tel" autoComplete="tel" fehler={felder.telefon} required />
        <Feld id="anliegen" label="Anliegen" fehler={felder.anliegen}>
          <select
            id="anliegen"
            name="anliegen"
            defaultValue=""
            aria-invalid={felder.anliegen ? true : undefined}
            className={cn(feldKlassen, felder.anliegen ? 'border-2 border-carbon-warm' : 'border-carbon-warm/35')}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {ANLIEGEN.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Feld>
      </div>

      <Feld id="nachricht" label="Nachricht" optional>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={5}
          className={cn(feldKlassen, 'border-carbon-warm/35 resize-y')}
        />
      </Feld>

      {status && !status.ok && status.grund !== 'validierung' ? (
        <p className="border-t border-hairline pt-4 text-body-sm text-carbon-warm">
          {status.grund === 'nicht_konfiguriert'
            ? 'Der Formularversand ist auf diesem Server noch nicht eingerichtet.'
            : 'Die Anfrage konnte nicht übermittelt werden.'}{' '}
          Bitte erreichen Sie uns vorerst telefonisch unter{' '}
          <a href={unternehmen.telefonHref} className="underline underline-offset-4">
            {unternehmen.telefon}
          </a>{' '}
          oder per E-Mail an{' '}
          <a href={unternehmen.emailHref} className="underline underline-offset-4">
            {unternehmen.email}
          </a>
          .
        </p>
      ) : null}

      <div className="flex items-center gap-6">
        <Absenden />
        <p className="text-body-sm text-text-muted">
          Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.
        </p>
      </div>
    </form>
  );
}
