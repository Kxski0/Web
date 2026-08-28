import Link from 'next/link';
import { Logo } from './Logo';
import { legalNav, leistungsNav, mainNav } from '@/lib/navigation';
import { unternehmen } from '@/content/unternehmen';

/** Footer auf der dunkelsten Flaeche des Systems. */
export function Footer() {
  return (
    <footer className="surface-dark bg-onyx-depth pb-[30px] pt-24 text-paper-white">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Logo inverse />
            <address className="mt-6 not-italic text-body-sm text-paper-white/70">
              {unternehmen.strasse}
              <br />
              {unternehmen.plz} {unternehmen.ort}
              <br />
              <a href={unternehmen.telefonHref} className="transition-opacity hover:opacity-65">
                {unternehmen.telefon}
              </a>
              <br />
              <a href={unternehmen.emailHref} className="transition-opacity hover:opacity-65">
                {unternehmen.email}
              </a>
            </address>
          </div>

          <nav aria-label="Leistungen" className="md:col-span-2">
            <p className="text-label uppercase tracking-[0.12em] text-paper-white/50">
              Leistungen
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {leistungsNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm transition-opacity hover:opacity-65"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <nav aria-label="Unternehmen">
              <p className="text-label uppercase tracking-[0.12em] text-paper-white/50">
                Unternehmen
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {mainNav
                  .filter((i) => i.href !== '/leistungen')
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-body-sm transition-opacity hover:opacity-65"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>

            <nav aria-label="Rechtliches">
              <ul className="flex flex-col gap-2">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-body-sm transition-opacity hover:opacity-65"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-16 border-t border-hairline-inverse pt-6 text-body-sm text-paper-white/65">
          © {new Date().getFullYear()} {unternehmen.traeger} — {unternehmen.marke}
        </p>
      </div>
    </footer>
  );
}
