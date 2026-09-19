import type { ComponentProps, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary';

type Props = ComponentProps<'a'> & {
  variant?: Variant;
  children: ReactNode;
  /** Der nachlaufende Pfeil, der beim Überfahren mitgeht. */
  arrow?: boolean;
};

export function Button({ variant = 'primary', arrow = true, children, className, ...rest }: Props) {
  return (
    <a {...rest} className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}>
      <span>{children}</span>
      {arrow && (
        <svg className={styles.arrow} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  );
}
