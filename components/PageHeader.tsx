import { DisplayHeading } from './DisplayHeading';
import { SectionLabel } from './SectionLabel';

/**
 * Kopfbereich der Unterseiten. Kein Foto — nur Vellum, Label und Ueberschrift.
 *
 * Der grosse obere Innenabstand haelt den Bereich unter der schwebenden,
 * fest positionierten Navigation frei.
 */
export function PageHeader({
  label,
  headline,
  intro,
}: {
  label?: string;
  headline: string;
  intro?: string;
}) {
  return (
    <section className="bg-vellum pb-16 pt-40">
      <div className="container-page">
        {label ? <SectionLabel className="mb-6">{label}</SectionLabel> : null}
        <DisplayHeading as="h1" className="max-w-3xl">
          {headline}
        </DisplayHeading>
        {intro ? (
          <p className="mt-6 max-w-2xl text-body text-text-muted">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
