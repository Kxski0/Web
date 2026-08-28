import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Bildcontainer mit dem markanten Radius — die dritte Signatur des Systems.
 *
 * Der Radius ist fluide (clamp), Decke exakt 80px. Fest 80px liesse ein
 * 340px breites Bild auf dem Handy wie einen Kreis aussehen.
 *
 * Kein Rahmen, keine Bildunterschrift, kein Schatten: Das Bild ist der
 * gesamte Inhalt.
 */
export function ImageCard({
  src,
  alt,
  className,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  src: string;
  /** Leerer String nur fuer rein dekorative Bilder. */
  alt: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[var(--radius-image)]',
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
