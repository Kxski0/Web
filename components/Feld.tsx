import { cn } from '@/lib/cn';

/**
 * Formularfeld.
 *
 * Die Vorgabe erwaehnt Eingabefelder nur beilaeufig ("Input-Outlines") und
 * definiert keinen Fehlerzustand. Da das System keine zweite Farbe kennt,
 * traegt der Fehler ueber eine verstaerkte Rahmenstaerke und einen Text —
 * nicht ueber Rot. Der Text ist ueber aria-describedby angebunden, damit er
 * auch vorgelesen wird.
 */
const basis =
  'w-full rounded-[var(--radius-small)] border bg-paper-white px-4 py-3 ' +
  'text-body text-carbon-warm placeholder:text-text-muted';

export function Feld({
  id,
  label,
  fehler,
  optional = false,
  children,
  ...rest
}: {
  id: string;
  label: string;
  fehler?: string;
  optional?: boolean;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const fehlerId = `${id}-fehler`;

  return (
    <div>
      <label htmlFor={id} className="block text-label uppercase tracking-[0.12em] text-text-muted">
        {label}
        {optional ? ' (optional)' : ''}
      </label>
      <div className="mt-2">
        {children ?? (
          <input
            id={id}
            name={id}
            aria-invalid={fehler ? true : undefined}
            aria-describedby={fehler ? fehlerId : undefined}
            className={cn(basis, fehler ? 'border-2 border-carbon-warm' : 'border-carbon-warm/35')}
            {...rest}
          />
        )}
      </div>
      {fehler ? (
        <p id={fehlerId} className="mt-2 text-body-sm text-carbon-warm">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}

export const feldKlassen = basis;
