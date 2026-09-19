'use client';

import { useRef, useState } from 'react';
import styles from './ContactForm.module.css';

const SUBJECTS = [
  { value: 'artikel', label: 'Ein bestimmtes Teil' },
  { value: 'verfuegbarkeit', label: 'Größe / Verfügbarkeit' },
  { value: 'geschenk', label: 'Geschenkberatung' },
  { value: 'secondhand', label: 'Secondhand abgeben' },
  { value: 'sonstiges', label: 'Etwas anderes' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Kontaktformular.
 *
 * Die Auswahl des Anliegens steht zuerst: sie ist die am leichtesten zu
 * beantwortende Frage und rahmt alles Folgende. Fehler stehen neben ihrem Feld,
 * per aria-describedby verknüpft, und die Zusammenfassung läuft über einen
 * Live-Bereich — ein farbiger Rahmen allein sagt niemandem etwas, der ihn nicht
 * sieht.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrors({});
    setMessage('');

    try {
      // Mit Schrägstrich: next.config.ts setzt trailingSlash, ohne ihn
      // beantwortet der Server jeden Absendevorgang erst mit einer
      // 308-Umleitung. Die erhält zwar Methode und Rumpf, ist aber ein
      // vermeidbarer zusätzlicher Umlauf.
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
        // Fokus auf das erste fehlgeschlagene Feld, nicht bloß eine Einfärbung.
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
        <h3 className={styles.doneTitle}>Ihre Nachricht ist angekommen.</h3>
        <p className={styles.doneBody}>
          Wir melden uns. Wenn es eilig ist, rufen Sie gern einfach an — im Laden geht meistens
          jemand ran.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <fieldset
        className={styles.fieldset}
        aria-describedby={errors.subject ? 'err-subject' : undefined}
      >
        <legend className={styles.legend}>Worum geht es?</legend>
        <div className={styles.choices}>
          {SUBJECTS.map((subject) => (
            <label key={subject.value} className={styles.choice}>
              <input type="radio" name="subject" value={subject.value} className={styles.radio} />
              <span>{subject.label}</span>
            </label>
          ))}
        </div>
        {errors.subject && (
          <p className={styles.error} id="err-subject">
            {errors.subject}
          </p>
        )}
      </fieldset>

      <div className={styles.grid}>
        <Field name="name" label="Name" error={errors.name} autoComplete="name" required />
        <Field name="email" label="E-Mail" type="email" error={errors.email} autoComplete="email" required />
        <Field name="telefon" label="Telefon (optional)" type="tel" error={errors.telefon} autoComplete="tel" />
      </div>

      <div className={styles.field}>
        <label htmlFor="nachricht" className={styles.label}>
          Ihre Nachricht
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={5}
          required
          className={styles.textarea}
          aria-invalid={errors.nachricht ? true : undefined}
          aria-describedby={errors.nachricht ? 'err-nachricht' : 'hint-nachricht'}
        />
        <p id="hint-nachricht" className={styles.hint}>
          Wenn es um ein bestimmtes Teil geht: Größe und ungefähre Beschreibung genügen.
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
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Wird gesendet …' : 'Nachricht senden'}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  type = 'text',
  autoComplete,
  required,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
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
        aria-describedby={error ? `err-${name}` : undefined}
      />
      {error && (
        <p className={styles.error} id={`err-${name}`}>
          {error}
        </p>
      )}
    </div>
  );
}
