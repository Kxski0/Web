'use client';

import type { ReactNode } from 'react';
import { useInViewOnce } from './useInViewOnce';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'ul' | 'ol' | 'div';
};

/**
 * Container für gestaffelt eintretende Elemente.
 *
 * Er setzt nur ein Attribut; die Bewegung steht in globals.css. Jedes Kind
 * bekommt seine Reihenfolge über die CSS-Variable `--i` — der Container weiß
 * nicht, was er enthält, und die Kinder brauchen keinen eigenen Zustand.
 */
export function Stagger({ children, className, as: Tag = 'div' }: Props) {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-stagger={inView ? 'in' : 'pending'}
    >
      {children}
    </Tag>
  );
}
