'use client';

import { useRef, useState, type ReactNode } from 'react';
import styles from './ContactForm.module.css';

export type FormKind = 'kontakt' | 'termin' | 'gutschein';

type Choice = { value: string; label: string };

const SUBJECTS: Record<FormKind, Choice[]> = {
  kontakt: [
    { value: 'artikel', label: 'Ein bestimmtes Teil' },
    { value: 'verfuegbarkeit', label: 'Größe / Verfügbarkeit' },
    { value: 'geschenk', label: 'Geschenkberatung' },
    { value: 'sonstiges', label: 'Etwas anderes' },
  ],
  termin: [
    { value: 'erstausstattung', label: 'Erstausstattung' },
    { value: 'trageberatung', label: 'Trageberatung' },
    { value: 'kinderwagen', label: 'Kinderwagen' },
    { value: 'umstandsmode', label: 'Umstandsmode' },
    { value: 'sonstiges', label: 'Etwas anderes' },
  ],
  gutschein: [],
};

const DONE: Record<FormKind, { title: string; body: string }> = {
  kontakt: {
    title: 'Ihre Nachricht ist angekommen.',
    body: 'Wir melden uns. Wenn es eilig ist, rufen Sie gern einfach an — im Laden geht meistens jemand ran.',
  },
  termin: {
    title: 'Ihre Terminanfrage ist da.',
    body: 'Wir melden uns mit einem Vorschlag. Sagen Sie gern dazu, wann es bei Ihnen gar nicht passt.',
  },
  gutschein: {
    title: 'Ihre Gutscheinanfrage ist da.',
    body: 'Wir melden uns und besprechen Betrag, Übergabe und Bezahlung persönlich mit Ihnen.',
  },
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Formular für Kontakt, Termin und Gutschein.
 *
 * Die Auswahl des Anliegens steht zuerst: sie ist die am leichtesten zu
 * beantwortende Frage und rahmt alles Folgende. Fehler stehen neben ihrem Feld,
 * per aria-describedby verknüpft, und die Zusammenfassung läuft über einen
 * Live-Bereich — ein farbiger Rahmen allein sagt niemandem etwas, der ihn nicht
 * sieht.
 */
export function ContactForm({ kind = 'kontakt', extra }: { kind?: FormKind; extra?: ReactNode }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const subjects = SUBJECTS[kind];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrors({});
    setMessage('');

    try {
      // Mit Schrägstrich: next.config.ts setzt trailingSlash, ohne ihn
      // beantwortet der Server jeden Absendevorgang erst mit einer 308.
      const response = await fetch('/api/kontakt/', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('sent');
        formRef.current?.reset();
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        setStatus('error');
        setMessage('Bitte prüfen Sie die markierten Felder.');
        const first = Object.keys(data.errors)[0];
        formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      setStatus('error');
      setMessage(data.error ?? 'Die Anfrage konnte nicht gesendet werden.');
    } catch {
      setStatus('error');
      setMessage('Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Verbindung.');
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.done} role="status">
        <h3 className={styles.doneTitle}>{DONE[kind].title}</h3>
        <p className={styles.doneBody}>{DONE[kind].body}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <input type="hidden" name="form" value={kind} />

      {subjects.length > 0 && (
        <fieldset className={styles.fieldset} aria-describedby={errors.subject ? 'err-subject' : undefined}>
          <legend className={styles.legend}>
            {kind === 'termin' ? 'Worum soll es beim Termin gehen?' : 'Worum geht es?'}
          </legend>
          <div className={styles.choices}>
            {subjects.map((subject) => (
              <label key={subject.value} className={`pressable ${styles.choice}`}>
                <input type="radio" name="subject" value={subject.value} className={styles.radio} />
                <span>{subject.label}</span>
              </label>
            ))}
          </div>
          {errors.subject && (
            <p className={styles.error} id="err-subject" style={{ marginTop: '0.75rem' }}>
              {errors.subject}
            </p>
          )}
        </fieldset>
      )}

      {extra}

      <div className={styles.grid}>
        <Field name="name" label="Name" error={errors.name} autoComplete="name" required />
        <Field name="email" label="E-Mail" type="email" error={errors.email} autoComplete="email" required />
        <Field name="telefon" label="Telefon (optional)" type="tel" error={errors.telefon} autoComplete="tel" />
        {kind === 'termin' && (
          <Field
            name="termin"
            label="Wann passt es Ihnen? (optional)"
            error={errors.termin}
            hint="Zum Beispiel: werktags ab 16 Uhr, oder samstags."
          />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="nachricht" className={styles.label}>
          {kind === 'gutschein' ? 'Nachricht an die Beschenkten (optional)' : 'Ihre Nachricht'}
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={5}
          required={kind !== 'gutschein'}
          className={styles.textarea}
          aria-invalid={errors.nachricht ? true : undefined}
          aria-describedby={errors.nachricht ? 'err-nachricht' : 'hint-nachricht'}
        />
        <p id="hint-nachricht" className={styles.hint}>
          {kind === 'gutschein'
            ? 'Was auf dem Gutschein stehen soll — falls Sie sich etwas wünschen.'
            : 'Wenn es um ein bestimmtes Teil geht: Größe und ungefähre Beschreibung genügen.'}
        </p>
        {errors.nachricht && (
          <p className={styles.error} id="err-nachricht">
            {errors.nachricht}
          </p>
        )}
      </div>

      {/* Honigtopf — außerhalb des Bildes, aber nicht display:none, damit Bots ihn ausfüllen. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={`pressable ${styles.submit}`} disabled={status === 'sending'}>
          {status === 'sending' ? 'Wird gesendet …' : 'Absenden'}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}

export function Field({
  name,
  label,
  error,
  type = 'text',
  autoComplete,
  required,
  hint,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  const hintId = hint ? `hint-${name}` : undefined;
  const errId = error ? `err-${name}` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId ?? hintId}
      />
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p className={styles.error} id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}
