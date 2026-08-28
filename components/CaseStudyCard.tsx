import Image from 'next/image';
import { SectionLabel } from './SectionLabel';
import { cn } from '@/lib/cn';

/**
 * Kompakte dunkle Karte, die ueber einem Foto liegt — Filmstill-Bildunterschrift.
 */
export function CaseStudyCard({
  label,
  headline,
  thumbnailSrc,
  thumbnailAlt,
  className,
}: {
  label: string;
  headline: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'surface-dark flex items-center gap-4 rounded-[var(--radius-card)] bg-carbon-warm p-4',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <SectionLabel inverse className="mb-2">
          {label}
        </SectionLabel>
        <p className="text-body-sm font-normal text-paper-white">{headline}</p>
      </div>
      {thumbnailSrc ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-small)]">
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt ?? ''}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
