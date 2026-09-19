import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'quiet';

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
  /** Externe Ziele und tel:/mailto: gehen nicht über den Router. */
  external?: boolean;
};

const Arrow = () => (
  <svg className={styles.arrow} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Button({ href, variant = 'primary', arrow = true, children, className, external }: Props) {
  const cls = ['pressable', styles.button, styles[variant], className].filter(Boolean).join(' ');
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );

  if (external || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className={cls} {...(href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
