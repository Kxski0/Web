import Link from 'next/link';
import { Logo } from './Logo';
import { legalNav, mainNav } from '@/lib/navigation';

/**
 * Footer auf der dunkelsten Flaeche des Systems (Onyx) — die einzige Stelle,
 * an der eine dunkle Flaeche ueber die volle Breite laeuft.
 */
export function Footer() {
  return (
    <footer className="surface-dark bg-onyx-depth pb-[30px] pt-24 text-paper-white">
      <div className="container-page">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <Logo inverse />

          <nav aria-label="Footer" className="flex flex-col gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm transition-opacity hover:opacity-65"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Rechtliches" className="flex flex-col gap-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm transition-opacity hover:opacity-65"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-16 border-t border-hairline-inverse pt-6 text-body-sm text-paper-white/65">
          © {new Date().getFullYear()} EnergieSaar
        </p>
      </div>
    </footer>
  );
}
