'use client';

import { useRef, useState } from 'react';
import styles from './ContactForm.module.css';

const SUBJECTS = [
  { value: 'photovoltaik', label: 'Photovoltaik' },
  { value: 'waermepumpe', label: 'Wärmepumpe' },
  { value: 'stromspeicher', label: 'Stromspeicher' },
  { value: 'energiemanagement', label: 'Energiemanagement' },
  { value: 'kombination', label: 'Eine Kombination' },
  { value: 'sonstiges', label: 'Etwas anderes' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Contact form.
 *
 * The subject choice comes first because it is the easiest question to answer
 * and it frames everything after it (§35). Errors are rendered next to their
 * field, tied by aria-describedby, and the summary is announced through a live
 * region — a red border alone tells a screen-reader user nothing.
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
      const response = await fetch('/api/kontakt', {
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
        // Move focus to the first field that failed, not just colour it.
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
        <h3 className={styles.doneTitle}>Ihre Anfrage ist angekommen.</h3>
        <p className={styles.doneBody}>
          Wir melden uns. Wenn Sie noch etwas nachreichen möchten — Fotos vom Dach, die letzte
          Stromabrechnung — können Sie das jederzeit tun.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Was möchten Sie umsetzen?</legend>
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
        <Field name="ort" label="Ort" error={errors.ort} autoComplete="address-level2" required />
        <Field
          name="email"
          label="E-Mail"
          type="email"
          error={errors.email}
          autoComplete="email"
          required
        />
        <Field
          name="telefon"
          label="Telefon (optional)"
          type="tel"
          error={errors.telefon}
          autoComplete="tel"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="nachricht" className={styles.label}>
          Ihr Vorhaben
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
          Gebäudetyp, Baujahr, aktuelle Heizung, ungefährer Stromverbrauch — was Sie zur Hand haben.
        </p>
        {errors.nachricht && (
          <p className={styles.error} id="err-nachricht">
            {errors.nachricht}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="foto" className={styles.label}>
          Foto des Hauses (optional)
        </label>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className={styles.file}
          aria-describedby={errors.foto ? 'err-foto' : 'hint-foto'}
        />
        <p id="hint-foto" className={styles.hint}>
          Ein Bild von Dach oder Hausseite sagt oft mehr als eine Beschreibung. Bis 8 MB.
        </p>
        {errors.foto && (
          <p className={styles.error} id="err-foto">
            {errors.foto}
          </p>
        )}
      </div>

      {/* Honeypot — off-screen but not display:none, so bots still fill it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
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
