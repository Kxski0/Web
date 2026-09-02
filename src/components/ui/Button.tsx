import type { ComponentProps, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary';

type Props = ComponentProps<'a'> & {
  variant?: Variant;
  children: ReactNode;
  /** Renders the trailing arrow that shifts on hover (§32). */
  arrow?: boolean;
};

export function Button({ variant = 'primary', arrow = true, children, className, ...rest }: Props) {
  return (
    <a
      {...rest}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      data-variant={variant}
    >
      <span className={styles.label}>{children}</span>
      {arrow && (
        <svg
          className={styles.arrow}
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 5h16M12 1l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
          />
        </svg>
      )}
    </a>
  );
}
